import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import { GLTFLoader } from "three/GLTFLoader"
import { FontLoader } from "three/FontLoader"
import { TextGeometry } from "three/TextGeometry"
import { TWEEN } from "tween"
import { OrbitControls } from "three/OrbitControls"

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

    if(!this.requestID) {
      setTimeout(() => {
        cancelAnimationFrame(this.requestID)
      }, 1000)
    }

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
    this.camera.position.set(0, 0, 500)
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

    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )

    // ***** 文字追加 *****

    const title = 'HumansLikeAnts'
    this.characters = []
    const titlePositions = [
      {x: -250, y: 120},
      {x: -170, y: 120},
      {x: -90, y: 120},
      {x: -10, y: 120},
      {x: 70, y: 120},
      {x: 150, y: 120},
      {x: -150, y: -40},
      {x: -70, y: -40},
      {x: 10, y: -40},
      {x: 90, y: -40},
      {x: -50, y: -200},
      {x: 30, y: -200},
      {x: 110, y: -200},
      {x: 190, y: -200}
    ]

    const fontLoader = new FontLoader()
    const font = await fontLoader.loadAsync('/assets/japanese_font.json')
    const textMaterial = new THREE.MeshNormalMaterial({ wireframe: true })

    for(let i = 0; i < title.length; i++) {
      this.createText(title.charAt(i), font, textMaterial)
    }

    // ***** animation *****

    for(let j = 0; j < this.characters.length; j++) {
      new TWEEN.Tween(this.characters[j].position)
                .to({x: titlePositions[j].x, y: titlePositions[j].y, z: -50}, 4000)
                .easing(TWEEN.Easing.Bounce.Out)
                .start()

      new TWEEN.Tween(this.characters[j].rotation)
                .to({y: Math.PI * 6}, 3000)
                .easing(TWEEN.Easing.Linear.None)
                .start()
    }

    new TWEEN.Tween(this.camera.position)
              .to({x: 0, y: 0, z: 10}, 4000) // 5秒後に指定した位置へ
              .delay(5000) // 1秒後スタート
              .easing(TWEEN.Easing.Bounce.In)
              .start()
              .onComplete(() => {
                this.controls.autoRotateSpeed = 4
                this.controls.autoRotate = true
              })

    this.animate()
  }

  createText(character, font, material) {
    const textGeometry = new TextGeometry(character, {
      font: font,
      size: 80,
      height: 20
    })
    const textMesh = new THREE.Mesh(textGeometry, material)
    textMesh.position.setX(Math.random() * 2000 - 1000)
    textMesh.position.setY(Math.random() * 2000 - 1000)
    textMesh.position.setZ(Math.random() * 1000)
    this.scene.add(textMesh)
    this.characters.push(textMesh)
  }

  animate() {
    const delta = this.clock.getDelta()

    this.requestID = requestAnimationFrame(this.animate.bind(this))

    this.renderer.render(this.scene, this.camera)

    this.mixer.update(delta)
    TWEEN.update()
    this.controls.update()

    // ライトを原点方向に見つめさせる処理
    this.light.lookAt(new THREE.Vector3(0, 0, 0))

    this.lightGroup.rotation.y += 5 * delta
  }
}
