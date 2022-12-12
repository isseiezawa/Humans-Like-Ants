import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import * as d3 from "d3"

// import geoJson from "/assets/japan.geo.json"

// Connects to data-controller="world-map"
export default class extends Controller {
  connect() {
    window.addEventListener('DOMContentLoaded', this.init())
  }

  init() {
    const element = document.getElementById('japan-map-container')
    // 描画範囲
    const width = element.clientWidth,
          height = element.clientHeight
    const scale = 1500

    const geoJson = '/assets/japan.geo.json'

    // 要素を追加する
    const svg = d3.select('#japan-map-container')
      .append('svg')
      .attr('width', width) // svg要素の横幅を指定
      .attr('height', height) // svg要素の縦幅を指定

    // 投影法
    const projection = d3.geoMercator()
          .center([136.0, 38.0]) // 日本の中心(経度, 緯度)
          .translate([width/2, height/2]) //画面の中央
          .scale(scale)

    const geoPath = d3.geoPath(projection) // svg pathデータ文字列の生成

    d3.json(geoJson).then((json) => {
      svg.selectAll('path')
        .data(json.features) // 都道府県データの格納
        .enter()
        .append('path')
          .attr('d', geoPath)
          .style('fill', 'green') // 塗りつぶし色
          .style('stroke', 'black') // 枠線の色
    })
  }
}
