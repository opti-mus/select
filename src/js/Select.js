class Select {
  constructor(sel, data) {
    this.sel = sel
    this.data = data
    this.init()
    this.visualSelect()
    this.addOption()
    this._height = 34
    this._labels = []
    this._searchResults = this.data.options
    this.searchSelect()
  }
  init() {
    this.sel.insertAdjacentHTML('beforeend', this._toHTML(this.data))
  }
  visualSelect() {
    const placeholder = this.sel.querySelector('.select__placeholder')
    const close = this.sel.querySelector('.select__close')
    placeholder.addEventListener('click', () => {
      this.openSelect()
      close.addEventListener('click', this.closeSelect.bind(this))
    })
  }
  openSelect() {
    const list = this.sel.querySelector('.select__main')
    const close = this.sel.querySelector('.select__close')
    close.classList.add('anim')
    list.style.height = 'auto'
  }
  closeSelect() {
    const list = this.sel.querySelector('.select__main')
    const close = this.sel.querySelector('.select__close')

    if (!this._labels.length) this._height = 34
    list.style.height = this._height + 'px'
    close.classList.remove('anim')
  }
  addOption() {
    const list = document.querySelector('.select__list')
    list.addEventListener('click', (e) => {
      const label = e.target.dataset.label
      if (label && e.target.classList.contains('disable')) return
      e.target.classList.add('disable')
      this.drawLabel(label)
    })
  }
  drawLabel(label) {
    const placeholder = this.sel.querySelector('.select__placeholder')
    const { multiSelect } = this.data
    if (!multiSelect) {
      placeholder.innerHTML = label
      this.enableOption(label, true)
      this.closeSelect()
      return
    }
    this._labels.push(label)
    this._labels = this._labels.filter((el) => el)
    placeholder.innerHTML = this.listLabel(this._labels)
    this._height = placeholder.offsetHeight - 4

    this.closeSelect()
    this.removeLabel()
  }

  removeLabel() {
    const placeholder = this.sel.querySelector('.select__placeholder')
    if (!this._labels.length) placeholder.innerHTML = this.data.placeholder

    placeholder.addEventListener('click', (e) => {
      let label = e.target.dataset.label
      if (this._labels.includes(label)) {
        let inx = this._labels.indexOf(label)
        this._labels.splice(inx, 1)
        this.drawLabel()
        this.enableOption(label)
      }
    })
  }
  enableOption(label, multi = false) {
    const list = this.sel.querySelectorAll('.select__option')
    list.forEach((element) => {
      if (multi && element.dataset.label !== label)
        element.classList.remove('disable')
      if (element.dataset.label == label && !multi)
        element.classList.remove('disable')
    })
  }
  searchSelect() {
    const { search } = this.data
    if (!search) return
    const searchInput = this.sel.querySelector('.select__search')
    searchInput.addEventListener('input', this.searchOptions.bind(this))
  }
  searchOptions(e) {
    let result = []
    let inputValue = e.target.value.toLowerCase()
    let a = this._searchResults.map((el) => {
      let optionTitle = el.title.toLowerCase()
      if (optionTitle.indexOf(inputValue) >= 0) {
        result.push(el)
      }
    })
    this.drawSearchResult(result)
    console.log(result)
  }
  drawSearchResult(result = []) {
    const listOptions = this.sel.querySelector('.select__list')
    listOptions.innerHTML = this.listOption(result)
  }
  listLabel(arr) {
    return arr
      .map(
        (el) =>
          `<span class='select__label'>${el} <i data-label=${el}>&times;</i></span>`
      )
      .join('')
  }
  listOption(arr) {
    return (
      arr
        .map(
          (el) =>
            `<li class='select__option' data-label=${el.title}>${el.title}</li>`
        )
        .join('') ||
      `<li class='select__option disable' >Ничего не найдено</li>`
    )
  }
  _toHTML(data) {
    const { options, search, placeholder, multiSelect } = data
    let searchEl = search ? `<input class='select__search' type='text'/>` : ''
    let charClose = multiSelect
      ? `<span class='select__close'>&times;</span>`
      : `<span class='select__close'>&gt;</span>`
    let allOptions = options
      ? options
          .map(
            (el) =>
              `<li class='select__option' data-label=${el.title}>${el.title}</li>`
          )
          .join('')
      : ''

    return `
      <div class='select' >
        <div class='select__main'>
          ${charClose}
          <span class='select__placeholder' data-select='1'>${
            placeholder || ''
          }</span>
          ${searchEl}
          <ul class='select__list'>
            ${allOptions}
          </ul>
        </div>
      </div>
    `
  }
}

const select = new Select(document.querySelector('.select-wrapper'), {
  multiSelect: true,
  search: true,
  placeholder: 'По каким жанрам искать?',
  options: [
    {
      title: 'Приключение',
    },
    {
      title: 'Ниндзя',
    },
    {
      title: 'Якудза',
    },
    {
      title: 'Военная-тематика',
    },
    {
      title: 'Безумие',
    },
    {
      title: 'Вампиры',
    },
    {
      title: 'Война',
    },
  ],
})
window.s = select
