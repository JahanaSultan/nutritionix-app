const apiId = 'e9f8b4d2'
const apiKey = 'e096345c1209194131feaf992a70b478'
const keyword = document.querySelector('#item')
const btn = document.querySelector('#search')
const result = document.querySelector('.result')
const filter = document.querySelector('.filter')
const pagination = document.querySelector('.pagination')
let items = []
let current = []
let categories = []

// fetch data and save

const fetchItems = async (word) => {
  categories = []
  await fetch(
    `https://api.nutritionix.com/v1_1/search/${word}?results=0:50&fields=item_name,brand_name,item_id,nf_calories&appId=${apiId}&appKey=${apiKey}`,
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.hits.length == 0) {
        alert('No Product!')
      } else {
        items = data.hits
        current = data.hits
        data.hits.map((e) => categories.push(e.fields.brand_name))
      }
    })
  if (items.length > 0) {
    displayResult()
    selectCategories()
  }
}

// Display Result

const displayResult = () => {
  result.innerHTML = ``
  items.map((e) => {
    result.innerHTML += `<div class="card">
      <p>Product: <span>${e.fields.item_name}</span></p>
      <p>Brand: <span>${e.fields.brand_name}</span></p>
      <p>Calori: <span>${e.fields.nf_calories}kkal</span></p>
  </div>`
  })
  paginate(items)
}

// Select Categories

const selectCategories = () => {
  filter.innerHTML = ``
  let uniquecategories = [...new Set(categories)]
  const select = document.createElement('select')
  filter.append(select)
  uniquecategories.map((e) => {
    select.innerHTML += `<option value="${e}">${e}</option>`
  })
  filter.querySelector('select').addEventListener('change', () => {
    items = current.filter(
      (e) => e.fields.brand_name == filter.querySelector('select').value,
    )
    displayResult()
  })
}

// Pagination
const paginate = (it) => {
  pagination.innerHTML = ``
  const ul = document.createElement('ul')
  const everyPage = 12
  const totalPageCount = Math.ceil(it.length / 12)
  const generatePages = (current) => {
    ul.innerHTML = ''
    for (let i = 1; i <= totalPageCount; i++) {
      let page = document.createElement('li')
      if (i === current) {
        page.classList.add('active')
      }
      page.innerText = i
      const page1 = (f) => {
        result.innerHTML = ''
        if (it.length > everyPage) {
          for (let j = (f - 1) * everyPage; j < f * everyPage; j++) {
            result.innerHTML += `<div class="card">
          <p>Product: <span>${it[j].fields.item_name}</span></p>
          <p>Brand: <span>${it[j].fields.brand_name}</span></p>
          <p>Calori: <span>${it[j].fields.nf_calories}kkal</span></p>
      </div>`
          }
        } else {
          for (let j = 0; j < it.length; j++) {
            result.innerHTML += `<div class="card">
                <p>Product: <span>${it[j].fields.item_name}</span></p>
                <p>Brand: <span>${it[j].fields.brand_name}</span></p>
                <p>Calori: <span>${it[j].fields.nf_calories}kkal</span></p>
            </div>`
          }
        }
      }
      page1(1)
      page.addEventListener('click', () => {
        generatePages(i)
        page1(i)
      })
      ul.append(page)
    }
    pagination.append(ul)
  }
  generatePages(1)
}

btn.addEventListener('click', () => {
  if (keyword.value) {
    fetchItems(keyword.value)
  } else {
    alert('Please enter food name!')
  }
})
