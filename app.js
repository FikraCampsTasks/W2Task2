// to emulate a full ES2015+ environment 
import 'babel-polyfill'

// Declare news globally
let news;

// Listener trigger on page complete loading
document.addEventListener('DOMContentLoaded', ()=>{
  // Assign value to global news variable to hold container of article
  news = document.getElementById('news');
  // Declare and assign search to hold search input
  let search = document.getElementById('search')
  // Listener Trigger when press any key in keyboard
  search.addEventListener('keyup', (event)=>{
    // if "Enter" key press the getNews function will call
    if(event.key == 'Enter') {
      getNews(search.value)
    }
  })
  // Run one time with default value
  getNews('iraq')
})

/**
  * Get news from "newsapi.org" and update UI.
  * @param {string} query name of what you search for
**/
async function getNews(query) {
  let response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=978d6c3818ff431b8c210ae86550fb1f`)
  let content = await response.json()
  updateUI(content.articles.map(createArticle).join('\n'))
}

/**
  * Update content of news container element
  * @param {string} content
**/
function updateUI(content) {
  news.innerHTML = content
}

/**
  * Create HTML representation of article.
  * @param {object} article object holds data of article
  * @param {number} i index of article
  * @returns {string} html design of article
**/
function createArticle(article, i) {
  article.counter = 1
  return `
    <article id="${i}">
      <img width="124px" height="124px" src="${article.urlToImage}" alt="">
      <div id="text">
        <h1>${article.title}</h1>
        <p>${article.description}</p>
        <time>${article.publishedAt}</time>
      </div>
      <div id="voter">
        <img height="13px" src="${require('./assets/upvote.svg')}" alt="">
        <div id="counter${i}">${article.counter}</div>
        <img  height="13px" src="${require('./assets/downvote.svg')}" alt="">
      </div>
    </article>
  `
}