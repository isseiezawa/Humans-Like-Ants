import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import { GLTFLoader } from "three/GLTFLoader"
// 一人称視点
import { PointerLockControls } from "three/PointerLockControls"
import { TextBoard } from "../modules/TextBoard"
import * as ThreeMeshUI from "three-mesh-ui"
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
        groundAttribute,
        stoneObjects = [],
        modelObjects = [],
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

      gltfModel.scene.name = name

      // 取得したモデルのサイズを均一にするための計算
      const box3 = new THREE.Box3()
      // 世界軸に沿った最小のバウンディングボックスを計算
      box3.setFromObject( gltfModel.scene )
      // 現物のサイズを出力
      const width = box3.max.x - box3.min.x
      const height = box3.max.y - box3.min.y
      const length = box3.max.z - box3.min.z
      
      // 最大値を取得(最大サイズを引数のsizeに)
      const maxSize = Math.max(width, height, length)
      const scaleFactor =  size / maxSize

      gltfModel.scene.scale.multiplyScalar(scaleFactor)

      switch(name) {
        case 'ground':
          groundObject = gltfModel.scene
          // 地面の倍率と頂点座標を格納
          groundScaleFactor = scaleFactor
          groundAttribute = gltfModel.scene.children[0].geometry.attributes.position
          break
        case 'stone':
          stoneObjects.push(gltfModel.scene)
          break
        case 'userModel':
          modelObjects.push(gltfModel.scene)
          // 地面の頂点座標を一つ決める処理
          const randomIndex = Math.floor(Math.random() * groundAttribute.count)
          const x = groundAttribute.getX(randomIndex) * groundScaleFactor
          const y = groundAttribute.getY(randomIndex) * groundScaleFactor
          const z = groundAttribute.getZ(randomIndex) * groundScaleFactor

          // オブジェクトの中心から足元までの距離を求める処理
          const putHeight = scaleFactor * -box3.min.y

          gltfModel.scene.position.set(x, y + putHeight, z)

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
      }

      scene.add(gltfModel.scene)
    }

    function onKeyDown(event) {
      switch(event.code) {
        case 'KeyW':
          moveForward = true
          break
        case "KeyA":
          moveLeft = true
          break
        case "KeyS":
          moveBackward = true
          break
        case "KeyD":
          moveRight = true
          break
      }
    }

    function onKeyUp(event) {
      switch(event.code) {
        case "KeyW":
          moveForward = false
          break
        case "KeyA":
          moveLeft = false
          break
        case "KeyS":
          moveBackward = false
          break
        case "KeyD":
          moveRight = false
          break
      }
    }

    function animate() {
      const delta = clock.getDelta()

      requestAnimationFrame(animate)

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
        const hitModel = cameraRaycaster.intersectObjects(modelObjects)
        if(hitModel.length > 0) {
          collisionModel = hitModel[0].object.parent
          const userData = hitModel[0].object.userData
          textBoard.setContents(
            userData.text,
            userData.userName,
            userData.imageUrl
          )
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
      }
    }
  }
}
