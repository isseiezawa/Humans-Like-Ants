import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="validate"
export default class extends Controller {
  static targets = [
                    'input',
                    'inputLength',
                    'formButton',
                    'error'
                  ]
  static values = {
                    characterCount: Number
                  }

  connect() {
    this.inputForm()
  }

  inputForm() {
    this.characterCountCheck()
    this.allowedCharacters()
  }

  characterCountCheck() {
    // 文字数チェック
    const length = this.inputTarget.value.length

    this.inputLengthTarget.textContent = `${length} / ${this.characterCountValue}`

    if(length > this.characterCountValue || length == 0) {
      this.inputLengthTarget.classList.add('text-danger')
      this.formButtonTarget.disabled = true
    } else {
      this.inputLengthTarget.classList.remove('text-danger')
      this.formButtonTarget.disabled = false
    }
  }

  allowedCharacters() {
    // 許可された文字チェック
    const allowString = /^[a-zA-Z0-9０-９\u3040-\u309f\u30a0-\u30ff\uFF5E!\！\?\？\+\―\*\(\)\（\）\'\"\&\%\$\s。、ㇰヶㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺャㇻㇼㇽㇾㇿヮ蟻好嬉喜友晴一運営]+$/
    const exceptSpace = /\S+/
    const inputValue = this.inputTarget.value

    if(!inputValue.match(exceptSpace) || !inputValue) {
      this.errorTarget.textContent = '空文字のみ、または入力されていません'
      this.formButtonTarget.disabled = true
    } else if(inputValue.match(allowString) && inputValue) {
      this.errorTarget.textContent = ''
      this.formButtonTarget.disabled = false
    } else {
      this.errorTarget.textContent = '使用できない文字が含まれています'
      this.formButtonTarget.disabled = true
    }
  }
}
