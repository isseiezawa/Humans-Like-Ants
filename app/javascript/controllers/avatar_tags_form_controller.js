import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="avatar-tags-form"
export default class extends Controller {
  static targets = ['inputAvatarTag']

  connect() {
    this.tagsListElement = document.getElementById('avatar-tags-list')
    this.selectElement = document.getElementById('select-tag')

    this.searchAvatarTags()
  }

  async searchAvatarTags() {
    const params = this.inputAvatarTagTarget.value
    const response = await fetch(`${location.origin}/avatar_tags/search?name=${params}`)
    const response_json = await response.json()

    while(this.selectElement.lastChild) {
      this.selectElement.removeChild(this.selectElement.lastChild)
    }

    for(let i = 0; i < response_json.length; i++) {
      if(i > 10) { break }
      const searchedTagElment = document.createElement('a')
      searchedTagElment.classList.add('searched-tag-button')
      searchedTagElment.dataset.action = 'click->avatar-tags-form#setAvatarTag'
      searchedTagElment.textContent = response_json[i]
      this.selectElement.appendChild(searchedTagElment)
    }
  }

  setAvatarTag(event) {
    const text = event.currentTarget.textContent

    const id = new Date().getTime()

    const labelElement = document.createElement('label')
    labelElement.innerHTML = `<input type='checkbox' checked='checked' name='user[avatar_tags_attributes][${id}][name]' value='${text}'>${text}`

    this.tagsListElement.appendChild(labelElement)
  }

  addAvatarTag() {
    const input = this.inputAvatarTagTarget
    const inputValue = input.value.replace(/\s+/g, '')
    if(inputValue) {
      const id = new Date().getTime()

      const labelElement = document.createElement('label')
      labelElement.innerHTML = `<input type='checkbox' checked='checked' name='user[avatar_tags_attributes][${id}][name]' value='${inputValue}'>${inputValue}`

      this.tagsListElement.appendChild(labelElement)

      input.value = ''
    }
  }
}
