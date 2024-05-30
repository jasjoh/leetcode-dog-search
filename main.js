/** Globals */

let cellVisitedCountHtml;
let controlsFormHtml;

let delayInMs = 20; // slower = easier to see path animation
let foodCount = 0;
let visitedCells = []; // tracks visited cells so we don't revisit them
let iterations = 0; // for preventing infinite loops / stack
let maxPathLength = 0; // legacy testing tracker
let cellVisitedCount = 0; // for displaying total cell visits
let foodFound = 0; // keep track of found food
let minPathWithMaxFood; // minimum good path length

const testMatrix = ["OOOO", "OOFF", "OCHO", "OFOO"]
// const testMatrix = ["OOOO", "OOFF", "OCHO", "OFOO"]
// const testMatrix = ["FOOF", "OCOO", "OOOH", "FOOO"];

/** End Globals */

document.addEventListener('DOMContentLoaded', (event) => {
  initializeDomElements();
  createHtmlBoard();
})

function initializeDomElements() {
  controlsFormHtml = document.getElementById('controls-form');
  controlsFormHtml.addEventListener('submit', startSearch);
  cellVisitedCountHtml = document.getElementById('cellVisitedCount');
}

function startSearch(event) {
  event.preventDefault();
  searchingChallenge(testMatrix);
}