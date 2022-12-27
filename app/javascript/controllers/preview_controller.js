import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="preview"
export default class extends Controller {
  static targets = [
                    'image',
                    'preview'
                  ]

  setImage() {
    const file = this.imageTarget.files[0]
    const reader = new FileReader()
    const preview = this.previewTarget
    // 読み込みが終了した時に発火
    reader.onloadend = () => {
      console.log(preview)
      preview.src = reader.result
    }
    if(file) {
      reader.readAsDataURL(file)
    }
  }
}
