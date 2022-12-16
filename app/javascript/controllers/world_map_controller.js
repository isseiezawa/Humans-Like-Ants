import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import { OrbitControls } from "three/OrbitControls"
import * as d3 from "d3"
import { transformSVGPathExposed } from "../plugins/d3-threeD"

// import geoJson from "/assets/japan.geo.json"

// Connects to data-controller="world-map"
export default class extends Controller {
  connect() {
    window.addEventListener('DOMContentLoaded', this.init())
  }

  async init() {
    const element = document.getElementById('japan-map-container')
    // 描画範囲
    const width = element.clientWidth,
          height = element.clientHeight
    const scale = 1500

    // ***** three.js setting *****

    // シーンの追加
    const scene = new THREE.Scene()

    // レンダリング
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)
    element.appendChild(renderer.domElement)

    // カメラの設定
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      10000
    )
    camera.position.set(0, 0, 400)

    const controls = new OrbitControls(
      camera,
      renderer.domElement
    )
    controls.autoRotate = true

    controls.domElement.addEventListener('click', () => {
      controls.autoRotate = false
    })

    scene.add(camera)

    // ライトの追加
    const light = new THREE.DirectionalLight(0x006600)
    light.position.set(1, 2, 1).normalize();

    scene.add(light)

    // 環境光源
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(ambientLight);

    // ***** d3.js geoJson to shape *****

    const geoJson = '/assets/japan.geo.json'
    let geoData = []

    // 投影法
    const projection = d3.geoMercator() // メルカトル図法を描画
                        .center([136.0, 38.0]) // 日本の中心(経度, 緯度)
                        .translate([width/2, height/2]) //画面の中央
                        .scale(scale)

    //path変換関数生成
    const geoPath = d3.geoPath(projection)

    await d3.json(geoJson).then((json) => {
      geoData = json.features // 都道府県データの格納
    })

    //geoJSON→svg path→three.js mesh変換 
    let places = []
    for(let i = 0; i < geoData.length; i++) {
      const geoFeature = geoData[i]
      const properties = geoFeature.properties
      const feature = geoPath(geoFeature)

      // svgパスをthree.jsのmeshに変換
      const geoMesh = transformSVGPathExposed(feature) // new THREE.Shape() に変換

      places.push({'data': properties, 'mesh': geoMesh})
    }

    // ***** shape to mesh *****

    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00
    })

    const extrudeSettings = {
      steps: 2,
      depth: 2,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 1
    };

    const japan = new THREE.Group()

    for(let j = 0; j < places.length; j++) {
      const geometry = new THREE.ExtrudeGeometry( places[j].mesh[0], extrudeSettings ) // シェイプから押し出されたジオメトリを作成
      const mesh = new THREE.Mesh(geometry, material)

      japan.add(mesh)
    }

    scene.add(japan)

    // ***** japanを中心に持ってくる処理 *****
    const box3 = new THREE.Box3()
    box3.setFromObject(japan)

    // japanの位置がずれている為、position取得
    const centerX = (box3.max.x - box3.min.x) / 2 + box3.min.x
    const centerY = (box3.max.y - box3.min.y) / 2 + box3.min.y
    const centerZ = (box3.max.z - box3.min.z) / 2 + box3.min.z

    // オブジェクトの位置、回転を更新
    const mat = new THREE.Matrix4()
    mat.makeTranslation(-centerX, -centerY, -centerZ) // XYZ軸で移動する量(回転軸にしたい頂点が原点にくるように平行移動)
    japan.applyMatrix4(mat)
    mat.makeRotationFromEuler(new THREE.Euler( Math.PI / 1.2, 0, 0, 'XYZ' )) // X軸を回転軸としてで回転
    japan.applyMatrix4(mat)

    // ***** 星(パーティクル)追加 *****

    const amount = 300
    const space = 3000

    // 頂点情報
    const vertices = []
    for(let i = 0; i < amount; i++) {
      const x = space * (Math.random() - 0.5)
      const y = space * (Math.random() - 0.5)
      const z = space * (Math.random() - 0.5)

      vertices.push(x, y, z)
    }

    const starGeometry = new THREE.BufferGeometry()
    // ジオメトリに属性を設定
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

    const starMaterial = new THREE.PointsMaterial({
      size: 10,
      color: 0xffffff
    })

    const starMesh = new THREE.Points(starGeometry, starMaterial)

    scene.add(starMesh)

    animate()

    function animate() {
      requestAnimationFrame(animate)
      renderer.render( scene, camera )

      controls.update()
    }
  }
}
