import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"

// Connects to data-controller="static-pages"
export default class extends Controller {
  connect() {
    window.addEventListener('DOMContentLoaded', this.init())
  }

  init() {
    const elementWidth = this.element.offsetWidth
    const elementHeight = this.element.offsetHeight

    // シーン作成
    const scene = new THREE.Scene()
    scene.background = new THREE.Color( 0xF0F8FF );

    // カメラ作成
    const camera = new THREE.PerspectiveCamera(
      75, // 視野角
      elementWidth / elementHeight, //アスペクト比
      0.1,
      10000 // 描写距離
    )
    camera.position.set(0, 0, 1000);

    // レンダラー作成
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#topPageCanvas')
    })
    // デバイスの解像度を指定する。
    renderer.setPixelRatio(window.devicePixelRatio);
    //寸法
    renderer.setSize(elementWidth , elementHeight)

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1, 1, 1);
    // シーンに追加
    scene.add(directionalLight);

    // 箱を作成(仮)
    const geometry = new THREE.BoxGeometry(400, 400, 400);
    const material = new THREE.MeshNormalMaterial();
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);

    animate()

    // 毎フレーム時に実行されるループイベント
    function animate() {
      requestAnimationFrame(animate)

      box.rotation.x += 0.01
      box.rotation.y += 0.01

      // レンダリング
      renderer.render(scene, camera)
    }
  }
}
