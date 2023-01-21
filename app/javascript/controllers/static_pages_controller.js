import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import { GLTFLoader } from "three/GLTFLoader"

// Connects to data-controller="static-pages"
export default class extends Controller {
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
    // requestAnimationFrameの戻り値のIDを格納
    this.requestID

    // 時間を追跡するためのオブジェクト
    this.clock = new THREE.Clock()

    // シーン作成
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color( 0xF0F8FF );

    // カメラ作成
    this.camera = new THREE.PerspectiveCamera(75)
    this.camera.position.setZ(10)
    this.camera.far = 1000

    // レンダラー作成
    this.renderer = new THREE.WebGLRenderer()
    // GLTFLoaderを使用する為の設定
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.element.appendChild(this.renderer.domElement)

        // 環境光源
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize()
    this.scene.add(directionalLight)

    // ***** 画面のリサイズ処理 *****

    const onResize = () => {
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.element.offsetWidth, this.element.offsetHeight)
      this.camera.aspect = this.element.offsetWidth / this.element.offsetHeight
      this.camera.updateProjectionMatrix()
    }

    onResize()

    window.addEventListener('resize', onResize)

    // ***** モデル作成 *****

    const modelFile = '/assets/ant/original_ant.gltf'

    const gltfLoader = new GLTFLoader()
    const gltfModel = await gltfLoader.loadAsync(
                                                  modelFile,
                                                  (xhr) => {
                                                    console.log( ( Math.trunc(xhr.loaded / xhr.total * 100) ) + '% loaded' )
                                                  }
                                                )
    // AnimationMixerを作成しAnimationClipのリストを取得
    this.mixer = new THREE.AnimationMixer(gltfModel.scene)
    // Animation Actionを生成（クリップ（アニメーションデータ）を指定）
    const action = this.mixer.clipAction(gltfModel.animations[2])
    action.play()

    this.scene.add(gltfModel.scene)

    this.animate()
  }

  animate() {
    const delta = this.clock.getDelta()

    this.requestID = requestAnimationFrame(this.animate.bind(this))

    this.renderer.render(this.scene, this.camera)

    this.mixer.update(delta)
  }
}
