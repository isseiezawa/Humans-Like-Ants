import * as THREE from "three"
// 3D文字盤
import * as ThreeMeshUI from "three-mesh-ui"

class TextBoard {
  constructor(fontJson, fontImage) {
    // ***** 全てのブロックを入れるコンテナ作成 *****
    this.container = new ThreeMeshUI.Block({
      width: 1.2,
      height: 0.5,
      padding: 0.1,
      backgroundOpacity: 0.2,
      contentDirection: 'row',
      justifyContent: 'space-between',
      fontFamily: fontJson,
      fontTexture: fontImage
    })

    // 衝突があるまで非表示
    this.container.visible = false

    // ***** 画像を入れるブロック *****
    this.imageBlock = new ThreeMeshUI.Block({
      width: 0.4,
      height: 0.4,
      padding: 0.04,
      backgroundSize: 'stretch',
      borderRadius: 0.05,
      offset: 0.1 //親要素から小要素までの距離
    })

    // ***** テキストを入れるブロック *****
    this.textBlock = new ThreeMeshUI.Block({
      width: 0.4,
      height: 0.4,
      padding: 0.04,
      fontColor: new THREE.Color(0x000000),
      textAlign: 'left',
      bestFit: 'auto',
      backgroundColor: new THREE.Color(0xffffff),
      offset: 0.1
    })

    // テキスト挿入部分
    this.text = new ThreeMeshUI.Text({
      fontSize: 0.05
    })

    this.textBlock.add(this.text)

    // ***** 名前を挿入するブロック *****
    this.nameBlock = new ThreeMeshUI.Block({
      justifyContent: 'end',
      width: 0.16,
      height: 0.5,
      padding: 0.04,
      backgroundOpacity: 0
    })

    // nameBlockの下の方に配置するブロック
    this.nameBox = new ThreeMeshUI.Block({
      width: 0.16,
      height: 0.05,
      fontColor: new THREE.Color(0x800000),
      backgroundColor: new THREE.Color(0xffffff),
      backgroundOpacity: 0.2,
      textAlign: 'center',
      bestFit: 'auto',
    })

    this.nameBlock.add(this.nameBox)

    // 名前挿入部分
    this.name = new ThreeMeshUI.Text({
      fontSize: 0.05
    })

    this.nameBox.add(this.name)

    this.container.add(
      this.imageBlock,
      this.nameBlock,
      this.textBlock
    )
  }

  setContents(text = 'Hello!', userName = '蟻', imageUrl = null) {
    // 文字を表示
    this.container.visible = true
    this.text.set({
      content: text
    })
    this.name.set({
      content: userName
    })

    if (imageUrl) {
      this.imageBlock.visible = true
      const loader = new THREE.TextureLoader()
      loader.load(imageUrl, (texture) => {
        this.imageBlock.set({
          backgroundTexture: texture
        })
      })
    } else {
      this.imageBlock.visible = false
    }
  }

  setTextPosition(camera, collisionObjectPosition) {
    const vec = new THREE.Vector3()
    // subVectors(a: vector, b: vector)-> ベクトルa-bを実行
    vec.subVectors(camera.position, collisionObjectPosition)

    // multiplyScalar(s: Float)-> ベクトルをスカラーで乗算
    const vec2 = vec.multiplyScalar(0.5)

    // addVectors(a: Vector3, b: Vector3)-> ベクトルa+bを実行
    vec.addVectors(collisionObjectPosition, vec2)

    // 文字盤の位置座標に計算したベクトルをセット
    this.container.position.copy(vec)

    this.container.lookAt(camera.position)
    // 文字盤はこっちに向いているので、カメラの動きをコピーすれば反転して寄ってくるようになる
    this.container.rotation.copy(camera.rotation)
  }
}

export { TextBoard }