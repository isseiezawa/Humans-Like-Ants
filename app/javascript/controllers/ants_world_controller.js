import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import { GLTFLoader } from "three/GLTFLoader"
// 一人称視点
import { PointerLockControls } from "three/PointerLockControls"
import * as ThreeMeshUI from "three-mesh-ui"
import { TextBoard } from "../modules/TextBoard"
import { Heart } from "../modules/Heart"
import Stats from "stats"

// Connects to data-controller="ants-world"
export default class extends Controller {
  static targets = ['antsWorldElement']
  connect() {
    window.addEventListener('DOMContentLoaded', this.init())
  }

  async init() {
    const element = this.antsWorldElementTarget

    // 時間を追跡するためのオブジェクト
    const clock = new THREE.Clock()

    // raycasterがヒットした際の待機時間監視(60fps = 1秒間に60画描写)
    let waitFrame = 60

    // シーン作成
    const scene = new THREE.Scene()
    scene.background = new THREE.Color( 0xF0F8FF );

    // カメラ作成
    const camera = new THREE.PerspectiveCamera(75)
    camera.position.setY(1)
    camera.far = 100

    // レンダラー作成
    const renderer = new THREE.WebGLRenderer()
    // GLTFLoaderを使用する為の設定
    renderer.outputEncoding = THREE.sRGBEncoding
    element.appendChild(renderer.domElement)

    // FPSを表示させる処理
    const stats = Stats()
    stats.showPanel(0)
    Object.assign(stats.dom.style, {
      'position': 'fixed',
      'height': 'max-content',
      'top': 'auto',
      'bottom': '0'
    });
    element.appendChild(stats.dom)

    // ***** 画面のリサイズ処理 *****

    onResize()

    window.addEventListener('resize', onResize)

    function onResize() {
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(element.offsetWidth, element.offsetHeight)
      camera.aspect = element.offsetWidth / element.offsetHeight
      camera.updateProjectionMatrix()
    }

    // 環境光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize()
    scene.add(ambientLight, directionalLight)

    // ***** 一人称視点 *****

    let moveForward = false,
        moveBackward = false,
        moveLeft = false,
        moveRight = false,
        // 移動速度
        velocity = new THREE.Vector3(),
        // 移動方向
        direction = new THREE.Vector3()

    const controls = new PointerLockControls(camera, renderer.domElement)

    element.addEventListener('click', () => {
      controls.lock()
    })

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)

    const cameraRaycaster = new THREE.Raycaster()

    // ***** モデル作成 *****

    let groundObject,
        groundScaleFactor,
        groundCenter,
        groundAttribute,
        stoneObjects = [],
        gltfModelGroups = [],
        gltfModels = [],
        collisionModel,
        mixers = []

    const ground = '/assets/ground/ground.gltf'
    const stone = '/assets/stone/stone.gltf'
    const modelFile = '/assets/ant/original_ant.gltf'

    await createGltfModel(ground, 'ground', 20)
    await createGltfModel(stone, 'stone', 26)
    await createGltfModel(modelFile, 'userModel', 1)

    const textBoard  = new TextBoard()
    scene.add(textBoard.container)

    // ***** Like Bullet(いいね発射) *****

    let bulletDirection = new THREE.Vector3(),
        likeBullet

    const bulletRaycaster = new THREE.Raycaster()
    bulletRaycaster.far = 0.2

    element.addEventListener('dblclick', shooting)

    // ***** 空作成 *****

    const textureLoader = new THREE.TextureLoader()
    const skyTexture = await textureLoader.loadAsync('/assets/sky.jpeg')
    const skyGeometry = new THREE.SphereGeometry(30, 30, 30)
    const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
    const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial)
    scene.add(skyMesh)

    animate()

    async function createGltfModel(gltfFile, name, size) {
      const gltfLoader = new GLTFLoader()
      const gltfModel = await gltfLoader.loadAsync(gltfFile)

      if(gltfModel.animations.length) {
        // AnimationMixerを作成しAnimationClipのリストを取得
        const mixer = new THREE.AnimationMixer(gltfModel.scene)
        // Animation Actionを生成（クリップ（アニメーションデータ）を指定）
        const action = mixer.clipAction(gltfModel.animations[0])

        action.play()

        mixers.push(mixer)
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
          groundObject = gltfModelGroup
          // 地面の倍率と頂点座標を格納
          groundScaleFactor = scaleFactor
          groundCenter = modelCenter
          groundAttribute = gltfModel.scene.children[0].geometry.attributes.position
          break
        case 'stone':
          stoneObjects.push(gltfModelGroup)
          break
        case 'userModel':
          // 地面の頂点座標を一つ決める処理
          const randomIndex = Math.floor(Math.random() * groundAttribute.count)
          const x = (groundAttribute.getX(randomIndex) + -groundCenter.x) * groundScaleFactor
          const y = (groundAttribute.getY(randomIndex) + -groundCenter.y) * groundScaleFactor
          const z = (groundAttribute.getZ(randomIndex) + -groundCenter.z) * groundScaleFactor

          // オブジェクトの中心から足元までの距離を求める処理
          const putHeight = scaleFactor * ( modelCenter.y -box3.min.y )
          gltfModelGroup.position.set(x, y + putHeight, z)

          // traverseで子孫のMeshにdataを格納する
          gltfModel.scene.traverse((child) => {
            if(child.isMesh) {
              child.userData = {
                id: 1,
                imageUrl: '/assets/sky.jpeg',
                text: 'hi',
                userName: 'issei'
              }
            }
          })
          gltfModelGroups.push(gltfModelGroup)
          // animation切り替え用
          gltfModels.push(gltfModel)
          break
        }
      scene.add(gltfModelGroup)
    }

    function onKeyDown(event) {
      switch(event.code) {
        case 'KeyW':
          moveForward = true
          break
        case 'KeyA':
          moveLeft = true
          break
        case 'KeyS':
          moveBackward = true
          break
        case 'KeyD':
          moveRight = true
          break
      }
    }

    function onKeyUp(event) {
      switch(event.code) {
        case 'KeyW':
          moveForward = false
          break
        case 'KeyA':
          moveLeft = false
          break
        case 'KeyS':
          moveBackward = false
          break
        case 'KeyD':
          moveRight = false
          break
      }
    }

    function shooting() {
      if(likeBullet) {
        // 二つ発射されていたら一個目削除
        likeBullet.material.dispose()
        likeBullet.geometry.dispose()
        scene.remove(likeBullet)
      }

      likeBullet = new Heart()
      likeBullet.position.copy(camera.position)
      likeBullet.rotation.copy(camera.rotation)
      scene.add(likeBullet)

      camera.getWorldDirection(bulletDirection)
    }

    function switchAnimation(hitModelScene) {
      // 配列の要素を全削除する (インデックス0以降のすべての要素を削除)
      mixers.splice(0)
      for(let i = 0; i < gltfModels.length; i++) {
        if(gltfModels[i].animations.length) {
          const mixer = new THREE.AnimationMixer(gltfModels[i].scene)
          const clipNumber = gltfModels[i].scene == hitModelScene ? 1 : 0
          const action = mixer.clipAction(gltfModels[i].animations[clipNumber])

          action.play()

          mixers.push(mixer)
        }
      }
    }

    function animate() {
      const delta = clock.getDelta()

      requestAnimationFrame(animate)

      waitFrame++

      ThreeMeshUI.update()

      stats.update()

      renderer.render(scene, camera)

      if(controls.isLocked) {
        direction.z = Number(moveForward) - Number(moveBackward)
        direction.x = Number(moveRight) - Number(moveLeft)

        // 減衰(速度の低下)
        velocity.z -= velocity.z * 5.0 * delta
        velocity.x -= velocity.x * 5.0 * delta

        if(moveForward || moveBackward) {
          velocity.z -= direction.z * 10 * delta
        }
        if(moveRight || moveLeft) {
          velocity.x -= direction.x * 10 * delta
        }

        // 速度を元にカメラの前進後進を決める
        controls.moveForward(-velocity.z * delta)
        controls.moveRight(-velocity.x * delta)

        if(mixers) {
          // getDelta()->.oldTimeが設定されてから経過した秒数を取得し、.oldTimeを現在の時刻に設定
          for(const mixer of mixers) {
            mixer.update(delta)
          }
        }

        // ***** 当たり判定 *****

        const nowCameraPosition = new THREE.Vector3()
        nowCameraPosition.copy(camera.position)
        // yのみ高さを指定するのは、判定のraycasterは下向きになっている為
        nowCameraPosition.setY(10)
        cameraRaycaster.set(nowCameraPosition, new THREE.Vector3(0, -1, 0))

        // *** 地面接触 ***
        const hitGround = cameraRaycaster.intersectObject(groundObject)
        if(hitGround.length > 0) {
          camera.position.setY(0.6 + hitGround[0].point.y)
        }

        // *** 岩接触 ***
        const hitStone = cameraRaycaster.intersectObjects(stoneObjects)
        if(hitStone.length > 0) {
          controls.moveForward(velocity.z * delta)
          controls.moveRight(velocity.x * delta)
        }

        // *** モデル接触 ***
        if(waitFrame > 60) {
          const hitModel = cameraRaycaster.intersectObjects(gltfModelGroups)
          if(hitModel.length > 0) {
            // 最小の構成 Mesh(衝突) < Group(gltfModel.scene) < Group(gltfModelGroup)
            collisionModel = hitModel[0].object.parent.parent
            const userData = hitModel[0].object.userData
            textBoard.setContents(
              userData.text,
              userData.userName,
              userData.imageUrl
            )
            waitFrame = 0
          }
        }

        if(collisionModel) {
          // 親をたどってグループ化されているObjectにlookAtを適用
          if(collisionModel.name == 'userModel') {
            collisionModel.lookAt(camera.position)
            textBoard.setTextPosition(camera, collisionModel.position)
          } else if(collisionModel.parent.name == 'userModel') {
            collisionModel.parent.lookAt(camera.position)
            textBoard.setTextPosition(camera, collisionModel.parent.position)
          } else if(collisionModel.parent.parent.name == 'userModel') {
            collisionModel.parent.parent.lookAt(camera.position)
            textBoard.setTextPosition(camera, collisionModel.parent.parent.position)
          }
        }

        // *** Like Bullet ***
        if(likeBullet) {
          likeBullet.position.x += bulletDirection.x * delta
          likeBullet.position.y += bulletDirection.y * delta
          likeBullet.position.z += bulletDirection.z * delta
          likeBullet.rotation.z += delta * 2

          if(waitFrame > 60) {
            bulletRaycaster.set(likeBullet.position, new THREE.Vector3(0, -1, 0))
            const bulletHitMesh = bulletRaycaster.intersectObjects(gltfModelGroups)
            if(bulletHitMesh.length > 0) {
              // material, geometryはWebGLRendererにキャッシュされる為削除
              likeBullet.material.dispose()
              likeBullet.geometry.dispose()
              scene.remove(likeBullet)

              // 最小の構成 Mesh(衝突) < Group(gltfModel.scene) < Group(gltfModelGroup)
              const bulletHitObject = bulletHitMesh[0].object.parent.parent

              // gltfModel.sceneを格納
              if(bulletHitObject.name == 'userModel') {
                switchAnimation(bulletHitObject.children)
              } else if(bulletHitObject.parent.name == 'userModel') {
                switchAnimation(bulletHitObject)
              } else if(bulletHitObject.parent.parent.name == 'userModel') {
                switchAnimation(bulletHitObject.parent)
              }
              waitFrame = 0
            }
          }
        }
      }
    }
  }
}
