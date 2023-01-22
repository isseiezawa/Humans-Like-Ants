import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import { GLTFLoader } from "three/GLTFLoader"
import { FontLoader } from "three/FontLoader"
import { TextGeometry } from "three/TextGeometry"

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

    // カメラ作成
    this.camera = new THREE.PerspectiveCamera(75)
    this.camera.position.setZ(10)
    this.camera.far = 1000

    // レンダラー作成
    this.renderer = new THREE.WebGLRenderer()
    // GLTFLoaderを使用する為の設定
    this.renderer.outputEncoding = THREE.sRGBEncoding
    // 影を落とす設定
    this.renderer.shadowMap.enabled = true
    this.element.appendChild(this.renderer.domElement)

        // 環境光源
    this.light = new THREE.DirectionalLight(0xffff9e);
    this.light.position.set(0, 3, 10)
    this.light.castShadow = true

    this.lightGroup = new THREE.Group()
    this.lightGroup.add(this.light)

    this.scene.add(this.lightGroup)


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

    gltfModel.scene.traverse((child) => {
      if(child.isMesh) {
        child.castShadow = true
      }
    })

    // AnimationMixerを作成しAnimationClipのリストを取得
    this.mixer = new THREE.AnimationMixer(gltfModel.scene)
    // Animation Actionを生成（クリップ（アニメーションデータ）を指定）
    const action = this.mixer.clipAction(gltfModel.animations[2])
    action.play()

    this.scene.add(gltfModel.scene)

    // ***** 地面追加 *****

    const geometry = new THREE.PlaneGeometry(100, 100)
    const material = new THREE.MeshStandardMaterial({ color: 0x808080 })
    const plane = new THREE.Mesh(geometry, material)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -1.9

    plane.receiveShadow = true
    this.scene.add(plane)

    // ***** 文字追加 *****

    const fontLoader = new FontLoader()
    const font = await fontLoader.loadAsync('/assets/japanese_font.json')
    const textMaterial = new THREE.MeshLambertMaterial({ color: 0x469536 })
    const textGeometry = new TextGeometry('Humans Like Ants', {
      font: font,
      size: 30,
      height: 10
    })
    textGeometry.center()
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    textMesh.position.y = 50
    textMesh.position.z = -50
  
    this.scene.add(textMesh)

    this.animate()
  }

  animate() {
    const delta = this.clock.getDelta()

    this.requestID = requestAnimationFrame(this.animate.bind(this))

    this.renderer.render(this.scene, this.camera)

    this.mixer.update(delta)

    // ライトを原点方向に見つめさせる処理
    this.light.lookAt(new THREE.Vector3(0, 0, 0))

    this.lightGroup.rotation.y += 5 * delta
  }
}
