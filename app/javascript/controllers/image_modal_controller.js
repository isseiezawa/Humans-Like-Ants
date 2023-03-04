import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="image-modal"
export default class extends Controller {
  connect() {
    // モーダルが表示された際のイベント
    this.element.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget
      const imageSrc = button.getAttribute('data-bs-image-modal')
      document.getElementById('modal-image').src = imageSrc
    })
  }
}
