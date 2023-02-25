import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="avatar-tags-form"
export default class extends Controller {
  static targets = ['avatarTag']

  connect() {
    this.tagsListElement = document.getElementById('avatar-tags-list')
    this.selectElement = document.getElementById('select-tag')
  }

  async avatarTagList() {
    const params = this.avatarTagTarget.value
    const response = await fetch(`${location.origin}/avatar_tags/search?name=${params}`)
    const response_json = await response.json()

    while(this.selectElement.lastChild) {
      this.selectElement.removeChild(this.selectElement.lastChild)
    }

    response_json.forEach(tag => {
      const searched_tag_elment = document.createElement('a')
      searched_tag_elment.classList.add('searched-tag-button')
      searched_tag_elment.dataset.action = 'click->avatar-tags-form#setAvatarTag'
      searched_tag_elment.textContent = tag
      this.selectElement.appendChild(searched_tag_elment)
    })
  }

  setAvatarTag(event) {
    const text = event.currentTarget.textContent
    const textNode = document.createTextNode(text)

    const id = new Date().getTime();

    const label_element = document.createElement('label')
    label_element.innerHTML = `<input type='checkbox' checked='checked' name='user[avatar_tags_attributes][${id}][name]' value='${text}'>${text}`

    this.tagsListElement.appendChild(label_element)
  }
}
