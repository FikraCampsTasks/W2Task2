import 'babel-polyfill'
let news;


document.addEventListener('DOMContentLoaded', ()=>{
  news = document.getElementById('news');
  let search = document.getElementById('search')

  search.addEventListener('keyup', (event)=>{
    // console.log(event)/
    if(event.key == 'Enter') {
      getNews(search.value)
    }
  })

  getNews('iraq')
})

async function getNews(query) {
  let response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=978d6c3818ff431b8c210ae86550fb1f`)
  let content = await response.json()
  console.log(content)
  updateUI(content.articles.map(createArticle).join('\n'))
}

function updateUI(content) {
  news.innerHTML = content
}

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