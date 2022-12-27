import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="validate"
export default class extends Controller {
  static targets = [
                    'post',
                    'postLength',
                    'formButton'
                  ]
  static values = {
                    characterCount: Number
                  }

  connect() {
    this.postForm()
  }

  postForm() {
    const length = this.postTarget.value.length

    this.postLengthTarget.textContent = `${length} / ${this.characterCountValue}`

    if(length > this.characterCountValue || length == 0) {
      this.postLengthTarget.classList.add('text-danger')
      this.formButtonTarget.disabled = true
    } else {
      this.postLengthTarget.classList.remove('text-danger')
      this.formButtonTarget.disabled = false
    }
  }
}
