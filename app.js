// to emulate a full ES2015+ environment
import "babel-polyfill";

// Declare news globally
let news;

// Listener trigger on page complete loading
document.addEventListener("DOMContentLoaded", () => {
  // Assign value to global news variable to hold container of article
  news = document.getElementById("news");
  // Declare and assign search to hold search input
  let search = document.getElementById("search");
  // Listener Trigger when press any key in keyboard
  search.addEventListener("keyup", event => {
    // if "Enter" key press the getNews function will call
    if (event.key == "Enter") {
      getNews(search.value);
    }
  });
  // Run one time with default value
  getNews("iraq");
});

// Listener to all clicks on pages
document.addEventListener("click", event => {
  let element = event.target;
  // Using switch to filter click on up and down vote only
  let counterId;
  switch (element.id) {
    case "upVote":
      counterId = `counter${element.getAttribute("counter")}`;
      updateCounter(counterId, 1);
      break;
      case "downVote":
      counterId = `counter${element.getAttribute("counter")}`;
      updateCounter(counterId, -1);
      break;
  }
});

/**
 * Get news from "newsapi.org" and update UI.
 * @param {string} query name of what you search for
 **/
async function getNews(query) {
  let response = await fetch(
    `https://newsapi.org/v2/everything?q=${query}&apiKey=978d6c3818ff431b8c210ae86550fb1f`
  );
  let content = await response.json();
  updateUI(content.articles.map(createArticle).join("\n"));
}

/**
 * Update content of news container element
 * @param {string} content
 **/
function updateUI(content) {
  news.innerHTML = content;
}

/**
 * Create HTML representation of article.
 * @param {object} article object holds data of article
 * @param {number} i index of article
 * @returns {string} html design of article
 **/
function createArticle(article, i) {
  // Using url as id to retrieve counter value
  article.counter = retrieveVote(article.url);
  return `
    <article id="${i}">
      <img width="124px" height="124px" src="${article.urlToImage}" alt="">
      <div id="text">
        <h1>${article.title}</h1>
        <p>${article.description}</p>
        <time>${article.publishedAt}</time>
      </div>
      <div id="voter">
        <img height="13px" id="upVote" counter=${i} src="${require("./assets/upvote.svg")}" alt="">
        <div id="counter${i}" url=${article.url}>${article.counter}</div>
        <img  height="13px" id="downVote" counter=${i} src="${require("./assets/downvote.svg")}" alt="">
      </div>
    </article>
  `;
}

/**
 * Store vote counter to countersDB in local storage.
 * @param {String} id used as key in countersDB
 * @param {number} count number of votes
 **/
function storeVote(id, count) {
  let countersDB = JSON.parse(localStorage.getItem("countersDB") || "{}");
  countersDB[id] = count;
  localStorage.setItem("countersDB", JSON.stringify(countersDB));
}

/**
 * Retrieve vote counter from countersDB in local storage.
 * @param {String} id used as key in countersDB
 * @returns {string} number of votes
 **/
function retrieveVote(id) {
  let countersDB = JSON.parse(localStorage.getItem("countersDB") || "{}");
  return countersDB[id] || 0;
}

/**
 * Update counter value in html and store it to localstorage.
 * @param {String} id used as key in countersDB
 * @param {String} number value to add to counter
 **/
function updateCounter(id, number) {
  let counter = document.getElementById(id);
  counter.innerText = Number(counter.innerText) + number;
  // use url as id
  let storeId = counter.getAttribute("url");
  let count = counter.innerText;
  storeVote(storeId, count);
}
