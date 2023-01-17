import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="validate"
export default class extends Controller {
  static targets = [
                    'input',
                    'inputLength',
                    'inputError',
                    'email',
                    'emailError',
                    'password',
                    'passwordLength',
                    'passwordConfirmation',
                    'passwordConfirmationError',
                    'submitButton'
                  ]

  static values = {
                    formType: String,
                    characterCount: Number
                  }

  initialize() {
    // this.has[Name]Targetスコープ内に一致するターゲットがあるかどうかを示すブール値
    if(this.hasInputTarget) {
      if(this.inputTarget.value) {
        this.inputflag = true
        this.inputLengthflag = true
      } else {
        this.inputflag = false
        this.inputLengthflag = false
      }
    }

    if(this.hasEmailTarget) {
      if(this.emailTarget.value) {
        this.emailflag = true
      } else {
        this.emailflag = false
      }
    }

    if(this.hasPasswordTarget) {
      if(this.passwordTarget.value) {
        this.passwordflag = true
      } else {
        this.passwordflag = false
      }
    }

    if(this.hasPasswordConfirmationTarget) {
      if(this.passwordConfirmationTarget.value) {
        this.passwordConfirmationflag = true
      } else {
        this.passwordConfirmationflag = false
      }
    }
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
      this.inputLengthflag = false
    } else {
      this.inputLengthTarget.classList.remove('text-danger')
      this.inputLengthflag = true
    }
  }

  allowedCharacters() {
    // 許可された文字チェック
    const allowRegex = /^[a-zA-Z0-9０-９\u3040-\u309f\u30a0-\u30ff\uFF5E!\！\?\？\+\―\*\(\)\（\）\'\"\&\%\$\s。、ㇰヶㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺャㇻㇼㇽㇾㇿヮ蟻好嬉喜友晴一運営]+$/
    const exceptSpaceRegex = /\S+/
    const inputValue = this.inputTarget.value

    if(inputValue.match(allowRegex) && inputValue.match(exceptSpaceRegex) && inputValue) {
      this.inputErrorTarget.textContent = ''
      this.inputflag = true
    } else if(!inputValue.match(exceptSpaceRegex) || !inputValue) {
      this.inputErrorTarget.textContent = '空文字のみ、または入力されていません'
      this.inputflag = false
    } else {
      this.inputErrorTarget.textContent = '使用できない文字が含まれています'
      this.inputflag = false
    }
  }

  validateEmail() {
    const validEmailRegex = /^[a-zA-Z0-9_+-]+(\.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
    const exceptSpaceRegex = /\S+/
    const emailValue = this.emailTarget.value

    if(emailValue.match(validEmailRegex) && emailValue) {
      this.emailErrorTarget.textContent = ''
      this.emailflag = true
    } else if(!emailValue.match(exceptSpaceRegex) || !emailValue) {
      this.emailErrorTarget.textContent = '空文字のみ、または入力されていません'
      this.emailflag = false
    } else {
      this.emailErrorTarget.textContent = 'メールの形式ではありません'
      this.emailflag = false
    }
  }

  validatePassword() {
    const passwordLength = this.passwordTarget.value.length

    this.passwordLengthTarget.textContent = `7 < ${passwordLength}`

    if(passwordLength < 8 || passwordLength == 0) {
      this.passwordLengthTarget.classList.add('text-danger')
      this.passwordflag = false
    } else {
      this.passwordLengthTarget.classList.remove('text-danger')
      this.passwordflag = true
    }

    if(this.hasPasswordConfirmationTarget) {
      const passwordValue = this.passwordTarget.value
      const passwordConfirmationValue = this.passwordConfirmationTarget.value
      if(passwordValue == passwordConfirmationValue) {
        this.passwordConfirmationErrorTarget.textContent = ''
        this.passwordConfirmationflag = true
      } else {
        this.passwordConfirmationflag = false
        this.passwordConfirmationErrorTarget.textContent = 'パスワードと一致しません'
      }
    }
  }

  validatePasswordConfirmation() {
    const passwordValue = this.passwordTarget.value
    const passwordConfirmationValue = this.passwordConfirmationTarget.value

    if(passwordValue == passwordConfirmationValue) {
      this.passwordConfirmationErrorTarget.textContent = ''
      this.passwordConfirmationflag = true
    } else {
      this.passwordConfirmationErrorTarget.textContent = 'パスワードと一致しません'
      this.passwordConfirmationflag = false
    }
  }

  submitButtonChange() {
    switch (this.formTypeValue) {
      case 'userCreate':
        if(this.inputflag && this.inputLengthflag && this.emailflag && this.passwordflag && this.passwordConfirmationflag) {
          this.submitButtonTarget.disabled = false
        } else {
          this.submitButtonTarget.disabled = true
        }
        break
      case 'userSession':
        if(this.emailflag) {
          this.submitButtonTarget.disabled = false
        } else {
          this.submitButtonTarget.disabled = true
        }
        break
      case 'userEdit':
        if(this.inputflag && this.inputLengthflag && this.emailflag) {
          this.submitButtonTarget.disabled = false
        } else {
          this.submitButtonTarget.disabled = true
        }
        break
      case 'tweetCreate':
        if(this.inputflag && this.inputLengthflag) {
          this.submitButtonTarget.disabled = false
        } else {
          this.submitButtonTarget.disabled = true
        }
        break
    }
  }
}
