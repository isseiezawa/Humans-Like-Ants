import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import { OrbitControls } from "three/OrbitControls"
import { FontLoader } from "three/FontLoader"
import { TextGeometry } from "three/TextGeometry"
import * as d3 from "d3"
import { transformSVGPathExposed } from "../plugins/d3-threeD"

// import geoJson from "/assets/japan.geo.json"

// Connects to data-controller="world-map"
export default class extends Controller {
  static targets = ['japanMapContainer']

  connect() {
    window.addEventListener('DOMContentLoaded', this.init())
  }

  async init() {
    const element = this.japanMapContainerTarget

    // ***** three.js setting *****

    // シーンの追加
    const scene = new THREE.Scene()

    // レンダリング
    const renderer = new THREE.WebGLRenderer()
    element.appendChild(renderer.domElement)

    // カメラの設定
    const camera = new THREE.PerspectiveCamera(75)
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

    // ***** 画面のリサイズ処理 *****

    onResize()

    window.addEventListener('resize', onResize)

    function onResize() {
      // デバイスのピクセル比を設定しキャンバスのぼやけを防ぐ為の処理
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(element.clientWidth, element.clientHeight)
        // カメラのアスペクト比を正す
      camera.aspect = element.clientWidth / element.clientHeight;
      camera.updateProjectionMatrix();
    }

    // ***** d3.js geoJson to shape *****

    // 描画範囲
    const width = element.clientWidth,
          height = element.clientHeight
    const scale = 1500

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
      const placeMaterial = new THREE.MeshPhongMaterial()
      const placeGeometry = new THREE.ExtrudeGeometry( places[j].mesh[0], extrudeSettings ) // シェイプから押し出されたジオメトリを作成
      const placeMesh = new THREE.Mesh(placeGeometry, placeMaterial)

      placeMesh.name = places[j].data.name
      placeMesh.userData.name_ja = places[j].data.name_ja
      
      japan.add(placeMesh)

      // 県の境界線を表示する為の処理
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x006600
      })
      const edge = new THREE.EdgesGeometry(placeGeometry)
      const line = new THREE.LineSegments(edge, lineMaterial)

      japan.add(line)
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

    // ***** オブジェクトとの交差を調べる  *****

    // カーソルの座標用のベクトル作成
    const cursor = new THREE.Vector2()

    element.addEventListener('mousemove', handleMouseMove)

    function handleMouseMove(event) {
      // 要素の寸法とビューポートに対する相対位置に関する情報を返す
      const rect = element.getBoundingClientRect()

      // canvas上のXY座標
      const cursorX = event.clientX - rect.left
      const cursorY = event.clientY - rect.top

      const rectWidth = rect.right - rect.left
      const rectHeight = rect.bottom - rect.top

      // -1〜+1の範囲で現在のマウス座標を登録
      cursor.x = ( cursorX / rectWidth ) * 2 - 1
      cursor.y = -( cursorY / rectHeight ) * 2 + 1
    }

    const raycaster = new THREE.Raycaster()

    // ***** 地域選択処理 *****

    let intersectionPlace
    let selectPlace

    element.addEventListener('click', handleClick)

    function handleClick() {
      // 2回同じ箇所が押された場合の処理
      if(intersectionPlace == selectPlace && selectPlace) {
        location.href = `${location.href}/${selectPlace.name.toLowerCase()}`
      }
      selectPlace = intersectionPlace
    }

    // ***** 文字作成雛形 *****

    const fontLoader = new FontLoader()
    const font = await fontLoader.loadAsync('/assets/japanese_font.json')
    const textMaterial = new THREE.MeshNormalMaterial()
    let textGeometry, textMesh

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

      // マウス位置からまっすぐに伸びる光線ベクトルを生成
      raycaster.setFromCamera(cursor, camera)

      const intersects = raycaster.intersectObjects(japan.children)

      // ***** マウスホバー時、placeが選択された際の色変更処理 *****

      if(intersects.length == 0) { intersectionPlace = null }

      japan.children.forEach((mesh) => {
        if(intersects.length > 0 && mesh == intersects[0].object && mesh.name) {
          mesh.material.color.setHex( 0xff0000 )
          intersectionPlace = intersects[0].object
        } else if(intersects.length == 0 && selectPlace == mesh){
          selectPlace.material.color.setHex( 0xff0000 )
        } else if(mesh.isLineSegments == true) {
          return // lineには変更をかけない
        } else {
          mesh.material.color.setHex( 0x00ff00 )
        }
      })

      if(intersectionPlace) {
        createText(intersectionPlace.userData.name_ja)
        changeElementBgColor(intersectionPlace.name)
      } else if(selectPlace) {
        createText(selectPlace.userData.name_ja)
        changeElementBgColor(selectPlace.name)
      }
    }

    function createText(text) {
      const sceneLast = scene.children[scene.children.length -1]

      if(sceneLast.isMesh == true) {
        scene.remove(sceneLast)
        sceneLast.material.dispose();
        sceneLast.geometry.dispose();
      }

      textGeometry = new TextGeometry(text, {
        font: font,
        size: 50,
        height: 30
      })

      textGeometry.center()

      textMesh = new THREE.Mesh(textGeometry, textMaterial)
    
      scene.add(textMesh)
    }

    function changeElementBgColor(placeName) {
      const removeRedElements = document.getElementsByClassName('bg-danger')
      for(let i = 0; 0 < removeRedElements.length; i++) {
        removeRedElements[i].classList.remove('bg-danger')
      }
      const addRedElement = document.getElementById(`place-name-${placeName.toLowerCase()}`)
      addRedElement.classList.add('bg-danger')
    }
  }
}
