import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import { GLTFLoader } from "three/GLTFLoader"
// 一人称視点
import { PointerLockControls } from "three/PointerLockControls"
import * as ThreeMeshUI from "three-mesh-ui"
import { TextBoard } from "../modules/TextBoard"
import { Heart } from "../modules/Heart"
import { TWEEN } from "tween"
import Stats from "stats"

// Connects to data-controller="ants-world"
export default class extends Controller {
  static targets = ['antsWorldElement']

  connect() {
    window.addEventListener('DOMContentLoaded', this.init())
  }

  disconnect() {
    // キャッシュが残ってしまうrenderer scene削除
    this.renderer.dispose()

    const cleanMaterial = material => {
      material.dispose()

      // dispose textures
      for (const key of Object.keys(material)) {
        const value = material[key]
        if (value && typeof value === 'object' && 'minFilter' in value) {
          value.dispose()
        }
      }
    }

    this.scene.traverse(object => {
      if (!object.isMesh) return

      object.geometry.dispose()

      if (object.material.isMaterial) {
        cleanMaterial(object.material)
      } else {
        // an array of materials
        for (const material of object.material) cleanMaterial(material)
      }
    })

    // アニメーションの中止
    cancelAnimationFrame(this.requestID)

    // canvasを取り除く
    while(this.element.firstChild){
      this.element.removeChild(this.element.firstChild)
    }
  }

  async init() {
    const tweetData = JSON.parse(this.antsWorldElementTarget.dataset.json)

    // requestAnimationFrameの戻り値のIDを格納
    this.requestID

    // 時間を追跡するためのオブジェクト
    this.clock = new THREE.Clock()

    // raycasterがヒットした際の待機時間監視(60fps = 1秒間に60画描写)
    this.waitFrame = 60

    // シーン作成
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color( 0xF0F8FF );

    // カメラ作成
    this.camera = new THREE.PerspectiveCamera(75)
    this.camera.position.setY(1)
    this.camera.far = 100

    // レンダラー作成
    this.renderer = new THREE.WebGLRenderer()
    // GLTFLoaderを使用する為の設定
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.element.appendChild(this.renderer.domElement)

    // FPSを表示させる処理
    this.stats = Stats()
    this.stats.showPanel(0)
    Object.assign(this.stats.dom.style, {
      'position': 'fixed',
      'height': 'max-content',
      'top': 'auto',
      'bottom': '0'
    });
    this.element.appendChild(this.stats.dom)

    // ***** 画面のリサイズ処理 *****

    const onResize = () => {
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.element.offsetWidth, this.element.offsetHeight)
      this.camera.aspect = this.element.offsetWidth / this.element.offsetHeight
      this.camera.updateProjectionMatrix()
    }

    onResize()

    window.addEventListener('resize', onResize)

    // 環境光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize()
    this.scene.add(ambientLight, directionalLight)

    // ***** 一人称視点 *****

    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false
    // 移動速度
    this.velocity = new THREE.Vector3()
    // 移動方向
    this.direction = new THREE.Vector3()

    this.controls = new PointerLockControls(this.camera, this.renderer.domElement)

    this.element.addEventListener('click', () => {
      this.controls.lock()
    })

    const onKeyDown = (event) => {
      switch(event.code) {
        case 'KeyW':
          this.moveForward = true
          break
        case 'KeyA':
          this.moveLeft = true
          break
        case 'KeyS':
          this.moveBackward = true
          break
        case 'KeyD':
          this.moveRight = true
          break
      }
    }
  
    const onKeyUp = (event) => {
      switch(event.code) {
        case 'KeyW':
          this.moveForward = false
          break
        case 'KeyA':
          this.moveLeft = false
          break
        case 'KeyS':
          this.moveBackward = false
          break
        case 'KeyD':
          this.moveRight = false
          break
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)

    this.cameraRaycaster = new THREE.Raycaster()

    // ***** モデル作成 *****

    this.groundObject
    this.groundScaleFactor
    this.groundCenter
    this.groundAttribute
    this.stoneObjects = []
    this.gltfModelGroups = []
    this.gltfModels = []
    this.collisionModel
    this.mixers = []

    const ground = '/assets/ground/ground.gltf'
    const stone = '/assets/stone/stone.gltf'
    const modelFile = '/assets/ant/original_ant.gltf'

    await this.createGltfModel(ground, 'ground', 20)
    await this.createGltfModel(stone, 'stone', 26)

    for(let i = 0; i < tweetData.length; i++) {
      await this.createGltfModel(modelFile, 'userModel', 1, tweetData[i])
    }

    this.textBoard  = new TextBoard()
    this.scene.add(this.textBoard.container)

    // ***** Like Bullet(いいね発射) *****

    this.bulletDirection = new THREE.Vector3()
    this.likeBullet

    this.bulletRaycaster = new THREE.Raycaster()
    this.bulletRaycaster.far = 0.2

    const shooting = () => {
      if(this.likeBullet) {
            // 二つ発射されていたら一個目削除
        this.likeBullet.material.dispose()
        this.likeBullet.geometry.dispose()
        this.scene.remove(this.likeBullet)
          }
  
      this.likeBullet = new Heart()
      this.likeBullet.position.copy(this.camera.position)
      this.likeBullet.rotation.copy(this.camera.rotation)
      this.scene.add(this.likeBullet)
  
      this.camera.getWorldDirection(this.bulletDirection)
    }

    this.element.addEventListener('dblclick', shooting)

    // ***** 空作成 *****

    const textureLoader = new THREE.TextureLoader()
    const skyTexture = await textureLoader.loadAsync('/assets/sky.jpeg')
    const skyGeometry = new THREE.SphereGeometry(30, 30, 30)
    const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
    const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial)
    this.scene.add(skyMesh)

    this.animate()
  }

  async createGltfModel(gltfFile, name, size, data) {
    const gltfLoader = new GLTFLoader()
    const gltfModel = await gltfLoader.loadAsync(
                                                  gltfFile,
                                                  (xhr) => {
                                                    console.log( ( Math.trunc(xhr.loaded / xhr.total * 100) ) + '% loaded' )
                                                  }
                                                )

    if(gltfModel.animations.length) {
      // AnimationMixerを作成しAnimationClipのリストを取得
      const mixer = new THREE.AnimationMixer(gltfModel.scene)
      // Animation Actionを生成（クリップ（アニメーションデータ）を指定）
      const action = mixer.clipAction(gltfModel.animations[0])

      action.play()

      this.mixers.push(mixer)
    }

    // 取得したモデルのサイズを均一にするための計算
    const box3 = new THREE.Box3()
    // 世界軸に沿った最小のバウンディングボックスを計算
    box3.setFromObject( gltfModel.scene )

    // modelを原点の位置に移動
    const modelCenter = box3.getCenter(new THREE.Vector3())
    gltfModel.scene.position.set(-modelCenter.x, -modelCenter.y, -modelCenter.z)

    // 原点(0, 0, 0)を持つgroupに挿入
    const gltfModelGroup = new THREE.Group()
    gltfModelGroup.add(gltfModel.scene)

    gltfModelGroup.name = name

    // 現物のサイズを出力
    const width = box3.max.x - box3.min.x
    const height = box3.max.y - box3.min.y
    const length = box3.max.z - box3.min.z
    
    // 最大値を取得(最大サイズを引数のsizeに)
    const maxSize = Math.max(width, height, length)
    const scaleFactor =  size / maxSize

    gltfModelGroup.scale.multiplyScalar(scaleFactor)

    switch(name) {
      case 'ground':
        this.groundObject = gltfModelGroup
        // 地面の倍率と頂点座標を格納
        this.groundScaleFactor = scaleFactor
        this.groundCenter = modelCenter
        this.groundAttribute = gltfModel.scene.children[0].geometry.attributes.position
        break
      case 'stone':
        this.stoneObjects.push(gltfModelGroup)
        break
      case 'userModel':
        // 地面の頂点座標を一つ決める処理
        const randomIndex = Math.floor(Math.random() * this.groundAttribute.count)
        const x = (this.groundAttribute.getX(randomIndex) + -this.groundCenter.x) * this.groundScaleFactor
        const y = (this.groundAttribute.getY(randomIndex) + -this.groundCenter.y) * this.groundScaleFactor
        const z = (this.groundAttribute.getZ(randomIndex) + -this.groundCenter.z) * this.groundScaleFactor

        // オブジェクトの中心から足元までの距離を求める処理
        const putHeight = scaleFactor * ( modelCenter.y -box3.min.y )
        gltfModelGroup.position.set(x, y + putHeight, z)

        // traverseで子孫のMeshにdataを格納する
        gltfModel.scene.traverse((child) => {
          if(child.isMesh) {
            child.userData = {
              imageUrl: data.image_url,
              text: data.post,
              userName: data.user.name
            }
          }
        })
        this.gltfModelGroups.push(gltfModelGroup)
        // animation切り替え用
        this.gltfModels.push(gltfModel)
        break
      }
    this.scene.add(gltfModelGroup)
  }

  switchAnimation(hitModelScene) {
    // 配列の要素を全削除する (インデックス0以降のすべての要素を削除)
    this.mixers.splice(0)
    for(let i = 0; i < this.gltfModels.length; i++) {
      if(this.gltfModels[i].animations.length) {
        const mixer = new THREE.AnimationMixer(this.gltfModels[i].scene)
        const clipNumber = this.gltfModels[i].scene == hitModelScene ? 1 : 0
        const action = mixer.clipAction(this.gltfModels[i].animations[clipNumber])

        action.play()

        this.mixers.push(mixer)
      }
    }
  }

  collision() {
    // 前のTweenの処理を中断して、その位置から新しいTweenを実行する
    TWEEN.removeAll()

    // ベクトルの大きさが1の方向ベクトル取得
    const cameraDirection = this.camera.getWorldDirection(new THREE.Vector3())
    const backX = this.camera.position.x - cameraDirection.x
    const backZ = this.camera.position.z - cameraDirection.z

    new TWEEN.Tween(this.camera.position)
              .to({x: backX, y: this.camera.position.y, z: backZ}, 1000)
              .easing(TWEEN.Easing.Back.Out)
              .start()
  }

  animate() {
    const delta = this.clock.getDelta()

    this.requestID = requestAnimationFrame(this.animate.bind(this))

    this.waitFrame++

    ThreeMeshUI.update()

    TWEEN.update()
    this.stats.update()

    this.renderer.render(this.scene, this.camera)

    if(this.controls.isLocked) {
      this.direction.z = Number(this.moveForward) - Number(this.moveBackward)
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft)

      // 減衰(速度の低下)
      this.velocity.z -= this.velocity.z * 5.0 * delta
      this.velocity.x -= this.velocity.x * 5.0 * delta

      if(this.moveForward || this.moveBackward) {
        this.velocity.z -= this.direction.z * 10 * delta
      }
      if(this.moveRight || this.moveLeft) {
        this.velocity.x -= this.direction.x * 10 * delta
      }

      // 速度を元にカメラの前進後進を決める
      this.controls.moveForward(-this.velocity.z * delta)
      this.controls.moveRight(-this.velocity.x * delta)

      if(this.mixers) {
        // getDelta()->.oldTimeが設定されてから経過した秒数を取得し、.oldTimeを現在の時刻に設定
        for(const mixer of this.mixers) {
          mixer.update(delta)
        }
      }

      // ***** 当たり判定 *****

      const nowCameraPosition = new THREE.Vector3()
      nowCameraPosition.copy(this.camera.position)
      // yのみ高さを指定するのは、判定のraycasterは下向きになっている為
      nowCameraPosition.setY(10)
      this.cameraRaycaster.set(nowCameraPosition, new THREE.Vector3(0, -1, 0))

      // *** 地面接触 ***
      const hitGround = this.cameraRaycaster.intersectObject(this.groundObject)
      if(hitGround.length > 0) {
        this.camera.position.setY(0.6 + hitGround[0].point.y)
      }

      // *** 岩接触 ***
      const hitStone = this.cameraRaycaster.intersectObjects(this.stoneObjects)
      if(hitStone.length > 0) {
        this.controls.moveForward(this.velocity.z * delta)
        this.controls.moveRight(this.velocity.x * delta)
        this.collision()
      }

      // *** モデル接触 ***
      if(this.waitFrame > 60) {
        const hitModel = this.cameraRaycaster.intersectObjects(this.gltfModelGroups)
        if(hitModel.length > 0) {
          // 最小の構成 Mesh(衝突) < Group(gltfModel.scene) < Group(gltfModelGroup)
          this.collisionModel = hitModel[0].object.parent.parent
          const userData = hitModel[0].object.userData
          this.textBoard.setContents(
            userData.text,
            userData.userName,
            userData.imageUrl
          )
          this.collision()
          this.waitFrame = 0
        }
      }

      if(this.collisionModel) {
        // 親をたどってグループ化されているObjectにlookAtを適用
        if(this.collisionModel.name == 'userModel') {
          this.collisionModel.lookAt(this.camera.position)
          this.textBoard.setTextPosition(this.camera, this.collisionModel.position)
        } else if(this.collisionModel.parent.name == 'userModel') {
          this.collisionModel.parent.lookAt(this.camera.position)
          this.textBoard.setTextPosition(this.camera, this.collisionModel.parent.position)
        } else if(this.collisionModel.parent.parent.name == 'userModel') {
          this.collisionModel.parent.parent.lookAt(this.camera.position)
          this.textBoard.setTextPosition(this.camera, this.collisionModel.parent.parent.position)
        }
      }

      // *** Like Bullet ***
      if(this.likeBullet) {
        this.likeBullet.position.x += this.bulletDirection.x * delta
        this.likeBullet.position.y += this.bulletDirection.y * delta
        this.likeBullet.position.z += this.bulletDirection.z * delta
        this.likeBullet.rotation.z += delta * 2

        if(this.waitFrame > 60) {
          this.bulletRaycaster.set(this.likeBullet.position, new THREE.Vector3(0, -1, 0))
          const bulletHitMesh = this.bulletRaycaster.intersectObjects(this.gltfModelGroups)
          if(bulletHitMesh.length > 0) {
                // material, geometryはWebGLRendererにキャッシュされる為削除
            this.likeBullet.material.dispose()
            this.likeBullet.geometry.dispose()
            this.scene.remove(this.likeBullet)

            // 最小の構成 Mesh(衝突) < Group(gltfModel.scene) < Group(gltfModelGroup)
            const bulletHitObject = bulletHitMesh[0].object.parent.parent

            // gltfModel.sceneを格納
            if(bulletHitObject.name == 'userModel') {
              this.switchAnimation(bulletHitObject.children)
            } else if(bulletHitObject.parent.name == 'userModel') {
              this.switchAnimation(bulletHitObject)
            } else if(bulletHitObject.parent.parent.name == 'userModel') {
              this.switchAnimation(bulletHitObject.parent)
            }
            this.waitFrame = 0
          }
        }
      }
    }
  }
}
