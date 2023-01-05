import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import { GLTFLoader } from "three/GLTFLoader"
import Stats from "stats"

// Connects to data-controller="ants-world"
export default class extends Controller {
  static targets = ['antsWorldElement']
  connect() {
    window.addEventListener('DOMContentLoaded', this.init())
  }

  async init() {
    const element = this.antsWorldElementTarget

    const width = element.offsetWidth
    const height = element.offsetHeight

    // 時間を追跡するためのオブジェクト
    const clock = new THREE.Clock()

    // シーン作成
    const scene = new THREE.Scene()
    scene.background = new THREE.Color( 0xF0F8FF );

    // カメラ作成
    const camera = new THREE.PerspectiveCamera(75)

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
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    // 環境光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize()
    scene.add(ambientLight, directionalLight)

    // ***** モデル作成 *****

    let groundModel,
        userModels = [],
        modelsPositionY = [],
        mixer
    const mixerGroup = new THREE.AnimationObjectGroup()

    const grand = '/assets/ground/ground.gltf'
    const modelFile = '/assets/ant/original_ant.gltf'

    await createGltfModel(grand, 'ground', 20)
    await createGltfModel(modelFile, 'userModel', 1)

    animate()

    async function createGltfModel(gltfFile, name, size) {
      const gltfLoader = new GLTFLoader()
      const gltfModel = await gltfLoader.loadAsync(gltfFile)

      if(gltfModel.animations.length) {
        mixerGroup.add(gltfModel.scene)
        // AnimationMixerを作成しAnimationClipのリストを取得
        mixer = new THREE.AnimationMixer(mixerGroup)
        // Animation Actionを生成（クリップ（アニメーションデータ）を指定）
        const action = mixer.clipAction(gltfModel.animations[0])

        action.play()
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
          groundModel = gltfModel.scene
          break
        case 'userModel':
          gltfModel.scene.position.setX(Math.random() * 6 - 3)
          gltfModel.scene.position.setZ(Math.random() * 6 - 3)

          // モデルの足元をy軸の0の上に配置する数値
          const putHeight = scaleFactor * -box3.min.y
          modelsPositionY.push(putHeight)
          userModels.push(gltfModel.scene)
          break
      }

      scene.add(gltfModel.scene)
    }

    function animate() {
      requestAnimationFrame(animate)

      stats.update()

      renderer.render(scene, camera)

      if(mixer) {
        // getDelta()->.oldTimeが設定されてから経過した秒数を取得し、.oldTimeを現在の時刻に設定
        mixer.update(clock.getDelta())
      }

      // ***** 当たり判定 *****

      for(let i = 0; i < userModels.length; i++) {
        const modelPositionUpY = new THREE.Vector3()
        modelPositionUpY.copy(userModels[i].position)
        modelPositionUpY.setY(50)

        const modelRay = new THREE.Raycaster(modelPositionUpY, new THREE.Vector3(0, -1, 0))
        const modelHitGround = modelRay.intersectObject(groundModel)

        if(modelHitGround.length > 0) {
          const positionY = modelsPositionY[i] + modelHitGround[0].point.y
          userModels[i].position.setY(positionY)
        }
      }
    }
  }
}
