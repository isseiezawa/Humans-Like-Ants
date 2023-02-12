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
                    'twitterId',
                    'twitterIdLength',
                    'selfIntroduction',
                    'selfIntroductionLength',
                    'selfIntroductionError',
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
      } else {
        this.inputflag = false
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

    this.twitterIdflag = true
    this.selfIntroductionflag = true
  }

  // ***** 使い回すバリデーション *****

  validateCount(inputLength, setLength, emptyAllow = false) {
    const validate = {text: '', flag: false}
    // 文字数チェック
    validate.text = `${inputLength} / ${setLength}`

    if(inputLength <= setLength && inputLength != 0) {
      validate.flag = true
    } else if(inputLength <= setLength && emptyAllow) {
      validate.flag = true
    } else {
      validate.flag = false
    }

    return validate
  }

  validateAllowCharacters(inputValue, emptyAllow = false) {
    const validate = {text: '', flag: false}

    // 許可された文字チェック
    const allowRegex = /^[a-zA-Z0-9０-９\u3040-\u309f\u30a0-\u30ff\uFF5E!\！\?\？\+\―\*\(\)\（\）\'\"\&\%\$\s。、ㇰヶㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺャㇻㇼㇽㇾㇿヮ蟻好嬉喜友晴一運営]+$/
    const exceptSpaceRegex = /\S+/

    if(inputValue.match(allowRegex) && inputValue.match(exceptSpaceRegex) && inputValue) {
      validate.text = ''
      validate.flag = true
    } else if(emptyAllow && !inputValue) {
      validate.text = ''
      validate.flag = true
    } else if(!inputValue.match(exceptSpaceRegex) || !inputValue) {
      validate.text = '空文字のみ、または入力されていません'
      validate.flag = false
    } else {
      validate.text = '使用できない文字が含まれています'
      validate.flag = false
    }

    return validate
  }

  // ***** 項目ごとに指定するバリデーション *****

  validateDefault() {
    const inputValue = this.inputTarget.value

    // 許可された文字
    const validateAllowCharacters = this.validateAllowCharacters(inputValue)
    this.inputErrorTarget.textContent = validateAllowCharacters.text

    // 文字数
    const validateCount = this.validateCount(inputValue.length, this.characterCountValue)
    this.inputLengthTarget.textContent = validateCount.text

    if(validateCount.flag) {
      this.inputLengthTarget.classList.remove('text-danger')
    } else {
      this.inputLengthTarget.classList.add('text-danger')
    }

    if(validateAllowCharacters.flag && validateCount.flag) {
      this.inputflag = true
    } else {
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

    if(passwordLength >= 8 && passwordLength != 0) {
      this.passwordLengthTarget.classList.remove('text-danger')
      this.passwordflag = true
    } else {
      this.passwordLengthTarget.classList.add('text-danger')
      this.passwordflag = false
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

  validateTwitterId() {
    const twitterIdValue = this.twitterIdTarget.value

    // 文字数
    const validateCount = this.validateCount(twitterIdValue.length, 50, true)
    console.log(validateCount.flag)
    this.twitterIdflag = validateCount.flag
    this.twitterIdLengthTarget.textContent = validateCount.text

    if(validateCount.flag) {
      this.twitterIdLengthTarget.classList.remove('text-danger')
    } else {
      this.twitterIdLengthTarget.classList.add('text-danger')
    }
  }

  validateSelfIntroduction() {
    const selfIntroductionValue = this.selfIntroductionTarget.value

    // 許可された文字
    const validateAllowCharacters = this.validateAllowCharacters(selfIntroductionValue, true)
    this.selfIntroductionErrorTarget.textContent = validateAllowCharacters.text

    // 文字数
    const validateCount = this.validateCount(selfIntroductionValue.length, 160, true)
    this.selfIntroductionLengthTarget.textContent = validateCount.text

    if(validateCount.flag) {
      this.selfIntroductionLengthTarget.classList.remove('text-danger')
    } else {
      this.selfIntroductionLengthTarget.classList.add('text-danger')
    }

    if(validateAllowCharacters.flag && validateCount.flag) {
      this.selfIntroductionflag = true
    } else {
      this.selfIntroductionflag = false
    }
  }

// ***** flagを確認してsubmit buttonの状態を変える *****

  submitButtonChange() {
    switch (this.formTypeValue) {
      case 'userCreate':
        if(this.inputflag && this.emailflag && this.passwordflag && this.passwordConfirmationflag) {
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
        if(this.inputflag && this.emailflag && this.twitterIdflag && this.selfIntroductionflag) {
          this.submitButtonTarget.disabled = false
        } else {
          this.submitButtonTarget.disabled = true
        }
        break
      case 'tweetCreate':
        if(this.inputflag) {
          this.submitButtonTarget.disabled = false
        } else {
          this.submitButtonTarget.disabled = true
        }
        break
    }
  }
}
