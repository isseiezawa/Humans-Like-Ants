import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import { GLTFLoader } from "three/GLTFLoader"
import { OrbitControls } from "three/OrbitControls"

// Connects to data-controller="show-avatar"
export default class extends Controller {
  static targets = ['vertices']

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
  }

  async init() {
    const userData = JSON.parse(this.element.dataset.json)

    // requestAnimationFrameの戻り値のIDを格納
    this.requestID

    // 時間を追跡するためのオブジェクト
    this.clock = new THREE.Clock()

    // wire-frameのswitch用(自身の反転ができなかった為)
    this.boolean = true

    // シーン作成
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color( 0xF0F8FF )

    // レンダラー作成
    const canvasElement = document.getElementById('show-avatar-canvas')
    const canvasWidth = canvasElement.clientWidth,
          canvasHeight = canvasElement.clientHeight

    this.renderer = new THREE.WebGLRenderer({canvas: canvasElement})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(canvasWidth, canvasHeight)
    // GLTFLoaderを使用する為の設定
    this.renderer.outputEncoding = THREE.sRGBEncoding

    // カメラ作成
    this.camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 100)
    this.camera.position.setZ(1)

    // 環境光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(1, 1, 1).normalize()
    this.scene.add(ambientLight, directionalLight)

    // コントローラ作成
    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )

    const gridHelper = new THREE.GridHelper()
    this.scene.add(gridHelper)

    // ***** モデル作成 *****

    const modelFile = userData ? userData.avatar_url : '/assets/ant/original_ant.gltf'

    const gltfLoader = new GLTFLoader()
    this.gltfModel = await gltfLoader.loadAsync(
                                                  modelFile,
                                                  (xhr) => {
                                                    console.log( ( Math.trunc(xhr.loaded / xhr.total * 100) ) + '% loaded' )
                                                  }
                                                )
    if(this.gltfModel.animations.length) {
      // AnimationMixerを作成しAnimationClipのリストを取得
      this.mixer = new THREE.AnimationMixer(this.gltfModel.scene)
      // Animation Actionを生成（クリップ（アニメーションデータ）を指定）
      const action = this.mixer.clipAction(this.gltfModel.animations[0])

      action.play()
    }

    // 頂点の数を出力する
    let vertices = 0
    this.gltfModel.scene.traverse( function ( child ) {
      if ( child.isMesh ) {
        vertices += child.geometry.attributes.position.count
      }
    })
    this.verticesTarget.textContent = Math.floor(vertices / 3)

    // 取得したモデルのサイズを均一にするための計算
    const box3 = new THREE.Box3()
    // 世界軸に沿った最小のバウンディングボックスを計算
    box3.setFromObject(this.gltfModel.scene )
    // modelを原点の位置に移動
    const modelCenter = box3.getCenter(new THREE.Vector3())
    this.gltfModel.scene.position.set(-modelCenter.x, -modelCenter.y, -modelCenter.z)

    // 原点(0, 0, 0)を持つgroupに挿入
    const gltfModelGroup = new THREE.Group()
    gltfModelGroup.add(this.gltfModel.scene)

    // 現物のサイズを出力
    const width = box3.max.x - box3.min.x
    const height = box3.max.y - box3.min.y
    const length = box3.max.z - box3.min.z
    
    // 最大値を取得(最大サイズを1に)
    const maxSize = Math.max(width, height, length)
    const scaleFactor =  1 / maxSize

    gltfModelGroup.scale.multiplyScalar(scaleFactor)
    // オブジェクトの中心から足元までの距離を求める処理
    const putHeight = scaleFactor * ( modelCenter.y -box3.min.y )

    // モデルを見つめたいので地面を下げる
    gridHelper.position.setY(-putHeight)

    this.scene.add(gltfModelGroup)

    this.animate()
  }

  switchWireFrame() {
    this.gltfModel.scene.traverse((child) => {
      if(child.material) {
        child.material.wireframe = this.boolean
      }
    })
    this.boolean = !this.boolean
  }

  animate() {
    const delta = this.clock.getDelta()
    this.requestID = requestAnimationFrame(this.animate.bind(this))

    this.renderer.render(this.scene, this.camera)

    this.controls.update()

    if(this.mixer) {
      this.mixer.update(delta)
    }
  }
}
