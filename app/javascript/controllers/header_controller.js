import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="header"
export default class extends Controller {
  static targets = ['inputAvatarTag']

  async searchAvatarTags() {
    const listElement = document.getElementById('avatar-tag-lists')
    const value = this.inputAvatarTagTarget.value

    const response = await fetch(`${location.origin}/avatar_tags/search?name=${value}`)
    const response_json = await response.json()

    listElement.classList.add('show')

    // #avatar-tags-indexのelement以外を取り除く処理
    let childrenCount = listElement.childElementCount
    for(let i = 0; i < childrenCount; i++) {
      const child = listElement.children[i]
      
      if(child.id != 'avatar-tags-index') {
        child.remove()
        --childrenCount
        --i
      }
    }

    for(let i = 0; i < response_json.length; i++) {
      if(i > 20) { break }
      const searchedTagElment = document.createElement('li')
      searchedTagElment.html = `/avatar_tags/${response_json[i]}`
      searchedTagElment.innerHTML = `<a href='/avatar_tags/${response_json[i]}' class="dropdown-item">${response_json[i]}</a>`
      listElement.appendChild(searchedTagElment)
    }
  }
}
