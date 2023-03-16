const jobsContainer = document.querySelector('[data-jobs-container]')
const searchContainer  = document.querySelector('[data-search]')
const searchFilters = document.querySelector('[data-search-content]')
const btnClear = document.querySelector('[data-btn-clear]')
let filterArray = []

btnClear.addEventListener('click', clearSearch)
jobsContainer.addEventListener('click', displaySearch)
searchFilters.addEventListener('click', removeFilter)

// Fetch the JSON data
async function getData() {
  const res = await fetch('../data.json')
  const data = await res.json()

  return data
}

// Make cards
function makeCard(item) {
  return `
  ${cardBorder(item.featured)}
    <div class="job-info">
      <img src="${item.logo}" alt=""/>
      <div>
        <div>
          <span class="company">${item.company}</span>  
          ${createNewFlags(item.new, item.featured)}
        </div>
        <p class="position">${item.position}</p>
        <div class="job-details">
          <span>${item.postedAt}</span>
          <div class="dot"></div>
          <span>${item.contract}</span>
          <div class="dot"></div>
          <span>${item.location}</span>
        </div>
      </div>
    </div>
    <div class="job-req" data-job-container>
      <button class="filter">${item.role}</button>
      <button class="filter">${item.level}</button>
      ${createLang(item.languages)}
      ${createTool(item.tools)}
    </div>
  </div>
  `
}

// Show cards
function showCard() {
  let cards = ''
  getData().then(data => {
    data.forEach(item => {
      cards += makeCard(item)
      jobsContainer.innerHTML = cards
    })
  })
}

showCard()

// Add featured border or not
function cardBorder(featured) {
  if (featured) {
    return `<div class="job-card featured-border">`
  }

  return `<div class="job-card">`
} 

// Create New Cards
function createNewFlags(newFlag, featuredFlag) {
  let flag = ''
  if (newFlag) {
    flag += `<span class="new">New!</span>`
  }
  if (featuredFlag) {
    flag += `<span class="featured">Featured</span>`
  }

  return flag
}

// Create Languages Buttons
function createLang(langs) {
  let langCards = ''
  langs.forEach(lang => {
    langCards += `<button class="filter">${lang}</button>`
  })
  return langCards
}

function createTool(tools) {
  let toolCards = ''
  tools.forEach(tool => {
    toolCards += `<button class="filter">${tool}</button>`
  })
  return toolCards
}

// Clears all the filter terms
function clearSearch() {
  searchContainer.classList.add('hidden')
  filterArray = []
  filterJob()
}

// Display Search Bar
function displaySearch(e) {
  let element = e.target
  if (element.classList.contains('filter')) {
    searchContainer.classList.remove('hidden')
    displayFilter(element)
  }
} 

// Display Filter on Search
function displayFilter(element) {
  let filter = ''
  if (!filterArray.includes(element.textContent)) {
    filterArray.push(element.textContent)
  }

  filterArray.forEach(element => {
    filter += `
    <div class="option">
      <span>${element}</span>
      <button aria-label="close" class="filter-remove">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    `
    searchFilters.innerHTML = filter
    filterJob()
  })
}

// Update jobs list by changing filters
function filterJob() {
  if (filterArray.length !== 0) {
    let cards = ''
    getData().then(data => {
      data.forEach(job => {
        if (validJobs(job)) {
          cards += makeCard(job)
          jobsContainer.innerHTML = cards
        }
      })
    })
  } else {
    searchContainer.classList.add('hidden')
    showCard()
  }
}

// Jobs are valid or not
function validJobs(job) {
  let isValid = true
  filterArray.forEach(element => {
    if (job.role !== element && job.level !== element && !job.languages.includes(element) && !job.tools.includes(element)) {
      isValid = false
    }
  })
  return isValid
}

// Remove any filter
function removeFilter(e) {
  let element = e.target
  if (element.classList.contains('filter-remove')) {
    const elementToRemove = element.parentElement
    let index = filterArray.indexOf(elementToRemove.textContent.split('')[0].trim())
    filterArray.splice(index,1)
    elementToRemove.remove()
    filterJob()
  }
}