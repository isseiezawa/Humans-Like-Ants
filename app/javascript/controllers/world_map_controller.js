import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"

// Connects to data-controller="world-map"
export default class extends Controller {
  connect() {
    window.addEventListener('DOMContentLoaded', this.init())
  }

  init() {
  }
}
