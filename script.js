/**
 * Psuedocode
 * - assumption: fastest route will never backtrack so once a cell ...
 * - ... has been visited, we won't visit it again
 *
 * We could build a list of candidate paths and then for each path,
 * check to make sure all the cells with food in them are in the path
 *
 * To build the list of candidate paths, we start at the dog and move
 * in one of four directions. We stop moving when:
 * - we hit the house
 * - we hit can't move in any direction because
 * -- we've been there before
 * -- we're its an invalid location (out of bounds)
 *
 * We achieve this in three phases:
 * - build the tree of all valid paths from dog location as linked lists
 * - traverse each path and keep array of paths which have all food ...
 * ... and end at home
 * - find min length of this array of paths
 *
 */

const counter = document.getElementById('count');
counter.innerText = 1;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createHtmlBoard() {
  // grab the DOM element where the board will live
  const htmlBoard = document.getElementById('grid');

  // now create the main rows
  for (let y = 0; y < 4; y++) {
    const gameRow = document.createElement("tr");
    for (let x = 0; x < 4; x++) {
      const gameCell = document.createElement("td");
      gameCell.setAttribute("id", `game-cell-${y}-${x}`);
      gameRow.append(gameCell);
    }
    htmlBoard.append(gameRow);
  }
}

async function placePieceInHtml(y, x){
  console.log("placing piece in html at yx:", y, x);
  // create the game piece and add classes to support styling
  const gamePiece = document.createElement("div");
  gamePiece.classList.add("gamePiece");

  // select the game cell where the piece will be placed and place it
  const gameCell = document.getElementById(`game-cell-${y}-${x}`);
  gameCell.append(gamePiece);
}

function removePieceFromHtml(y, x) {
  const gameCell = document.getElementById(`game-cell-${y}-${x}`);
  gameCell.classList.add("visited");
  gameCell.innerHTML = "";
}

function incrementCount() {
  let value = Number(counter.innerText);
  value++;
  counter.innerText = value;
}

function updatedHtmlQueue(queue) {
  const queueDiv = document.getElementById('queue');
  let queueString = 'Queued Cells: ';
  for (let cell of queue) {
    queueString = queueString + cell.coords[0] + cell.coords[1] + " | ";
  }
  queueDiv.innerText = queueString;
}

function updatedHtmlVisited(array) {
  const visitedDiv = document.getElementById('visited');
  let visitedString = 'Visited: ';
  for (let cell of array) {
    visitedString = visitedString + cell + " | ";
  }
  visitedDiv.innerText = visitedString;
}

function SearchingChallenge(strArr) {
  console.log("function call w/ strArr:", strArr);

  class Cell {
    constructor(coords, type) {
      this.coords = coords;
      this.type = type;
      this.left = undefined;
      this.right = undefined;
      this.up = undefined;
      this.down = undefined;
    }
  }

  let dogCoords = [];
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      if (strArr[i][j] === 'C') {
        dogCoords = [i, j];
      }
    }
  }

  let dogCell = new Cell(dogCoords, 'D');
  let visitedCells = [];
  let iterations = 0;
  // let foundCell = false;

  generatePaths(dogCell, visitedCells);

  async function generatePaths(cell, priorVisitedCells) {
    iterations++;
    incrementCount();
    if (iterations > 1000) { console.log("iterations at 100"); return; }
    console.log("generate path for cell:", cell);
    // console.log("visited cells:", visitedCells);
    let cy = cell.coords[0];
    let cx = cell.coords[1];
    await delay(100);
    await placePieceInHtml(cy, cx);
    let visitedCells = priorVisitedCells.slice();
    visitedCells.push(`${cy}${cx}`);
    updatedHtmlVisited(visitedCells);
    let cellsToVisitQueue = [];

    // add up node if it exists and hasn't been visited
    console.log("checking up");
    // if (strArr[cy-1] !== undefined && strArr[cy-1][cx] !== undefined) {
    if (strArr[cy-1] !== undefined && strArr[cy-1][cx] !== undefined && !visitedCells.includes(`${cy-1}${cx}`)) {
      let newCell = new Cell([cy-1, cx], strArr[cy-1][cx]);
      cell.up = newCell;
      console.log("dogCell:", dogCell);
      // generatePaths(newCell);
      // foundCell = true;
      cellsToVisitQueue.push(newCell);
    }

    console.log("checking down");
    // add down node if it exists and hasn't been visited
    // if (strArr[cy+1] !== undefined && strArr[cy+1][cx] !== undefined) {
    if (strArr[cy+1] !== undefined && strArr[cy+1][cx] !== undefined && !visitedCells.includes(`${cy+1}${cx}`)) {
      let newCell = new Cell([cy+1, cx], strArr[cy+1][cx]);
      cell.down = newCell;
      console.log("dogCell:", dogCell);
      // generatePaths(newCell);
      // foundCell = true;
      cellsToVisitQueue.push(newCell);
    }

    console.log("checking left");
    // add left node if it exists and hasn't been visited
    // if (strArr[cy][cx-1] !== undefined) {
    if (strArr[cy][cx-1] !== undefined && !visitedCells.includes(`${cy}${cx-1}`)) {
      let newCell = new Cell([cy, cx-1], strArr[cy][cx-1]);
      cell.left = newCell;
      console.log("dogCell:", dogCell);
      // generatePaths(newCell);
      // foundCell = true;
      cellsToVisitQueue.push(newCell);
    }

    console.log("checking right");
    // add right node if it exists and hasn't been visited
    if (strArr[cy][cx+1] !== undefined && !visitedCells.includes(`${cy}${cx+1}`)) {
    // if (strArr[cy][cx+1] !== undefined) {
      let newCell = new Cell([cy, cx+1], strArr[cy][cx+1]);
      cell.right = newCell;
      console.log("dogCell:", dogCell);
      // generatePaths(newCell);
      // foundCell = true;
      cellsToVisitQueue.push(newCell);
    }

    let cellToVisit = undefined;
    while(cellsToVisitQueue.length > 0) {
      updatedHtmlQueue(cellsToVisitQueue);
      console.log("Iterating through queue:", cellsToVisitQueue);
      cellToVisit = cellsToVisitQueue.pop();
      await generatePaths(cellToVisit, visitedCells);
      console.log("paths generated for:", cellToVisit);
    }
    removePieceFromHtml(cy, cx);
    console.log("exiting function");
    // debugger;
  }

  console.log("dogCell:", dogCell);

/*
  class Path {
    constructor() {
      this.start = null;
      this.end = null;
      this.length = 0;
    }

    prepend(node) {
      this.start = node;
      if (this.length === 0) { this.end = node; }
      this.length++;
    }

    append(node) {
      this.end = node;
      if (this.length === 0) { this.start = node; }
      this.length++;
    }
  }

  */

  // code goes here
  return strArr;

}

// keep this function call here
createHtmlBoard();
SearchingChallenge(["OOOO", "OOFF", "OCHO", "OFOO"]);