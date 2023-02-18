import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="reload-button-move"
export default class extends Controller {
  connect() {
    const reloadElement = document.getElementById('reload-button')
    reloadElement.style.transform = 'scale(2.0) translate(-100%, -100%)'

    reloadElement.addEventListener('click', () => {
      reloadElement.style.transform = null
    })
  }
}
