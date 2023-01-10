import * as THREE from "three"

class Heart extends THREE.Mesh {
  constructor() {
    // ハート型作成
    const heartShape = new THREE.Shape()
    const x = 0, y = 0
    heartShape.moveTo( x, y )
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y )
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 )
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 )
    heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 )
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y )
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 )

    // 厚みを出す設定
    const extrudeSettings = {
                              depth: 8,
                              bevelEnabled: true,
                              bevelSegments: 2,
                              steps: 2,
                              bevelSize: 1,
                              bevelThickness: 1
                            }

    const heartBulletGeometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings )
    const bulletMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })

    super( heartBulletGeometry, bulletMaterial )
    this.scale.multiplyScalar(0.01)
  }
}

export { Heart }