import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import { GLTFLoader } from "three/GLTFLoader"

// Connects to data-controller="ants-world"
export default class extends Controller {
  static targets = ['antsWorldElement']
  connect() {
    window.addEventListener('DOMContentLoaded', this.init())
  }

  init() {
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

    let mixer
    const mixerGroup = new THREE.AnimationObjectGroup()

    const modelFile = '/assets/ant/original_ant.gltf'
    const grand = '/assets/grand/grand.gltf'

    createGltfModel(modelFile)
    createGltfModel(grand)

    animate()


    async function createGltfModel(gltfFile) {
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

      scene.add(gltfModel.scene)
    }

    function animate() {
      requestAnimationFrame(animate)

      renderer.render(scene, camera)

      if(mixer) {
        // getDelta()->.oldTimeが設定されてから経過した秒数を取得し、.oldTimeを現在の時刻に設定
        mixer.update(clock.getDelta())
      }
    }
  }
}
