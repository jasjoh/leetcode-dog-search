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



const cellVisitedCount = document.getElementById('cellVisitedCount');
// const testMatrix = ["OOOO", "OOFF", "OCHO", "OFOO"]
const testMatrix = ["FOOF", "OCOO", "OOOH", "FOOO"]
cellVisitedCount.innerText = 1;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createHtmlBoard() {
  // grab the DOM element where the board will live
  const htmlBoard = document.getElementById('grid');

  // now create the main rows
  for (let y = 0; y < testMatrix.length; y++) {
    const gameRow = document.createElement("tr");
    for (let x = 0; x < testMatrix[0].length; x++) {
      const gameCell = document.createElement("td");
      gameCell.setAttribute("id", `game-cell-${y}-${x}`);
      switch(testMatrix[y][x]) {
        case 'O':
          gameCell.className = "open";
          break;
        case 'F':
          gameCell.className = "food";
          break;
        case 'H':
          gameCell.className = "home";
          break;
        case 'C':
          gameCell.className = "dog";
          break;
      }
      gameRow.append(gameCell);
    }
    htmlBoard.append(gameRow);
  }
}

function placePieceInHtml(y, x){
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
  // gameCell.classList.add("visited");
  gameCell.innerHTML = "";
}

// function resetHtmlCellVisitedStatus(y, x) {
//   const gameCell = document.getElementById(`game-cell-${y}-${x}`);
//   gameCell.classList.remove("visited");
// }

function setCellVisitedCount(value) {
  cellVisitedCount.innerText = `Total Cells Visited: ${value}`;
}

function updateHtmlQueueList(queue) {
  const e = document.getElementById('queue');
  let queueString = 'Queued Cells: ';
  for (let cell of queue) {
    queueString = queueString + cell.coords[0] + cell.coords[1] + " | ";
  }
  e.innerText = queueString;
}

function updatedHtmlVisited(array) {
  const e = document.getElementById('visitedTracker');
  let visitedString = 'Visited: ';
  for (let cell of array) {
    visitedString = visitedString + cell + " | ";
  }
  e.innerText = visitedString;
}

function setLastPathLength(len) {
  const e = document.getElementById("lastPathLength");
  e.innerText = `Last Path Length: ${len}`;
}

function setMaxPathLength(len) {
  const e = document.getElementById("maxPathLength");
  e.innerText = `Max Path Length: ${len}`;
}

function setFoodFoundAlongPath(foodFound) {
  const e = document.getElementById("foodFoundCounter");
  e.innerText = `Food Found on Last Path: ${foodFound}`;
}

function setMinPathWithMaxFood(len) {
  const e = document.getElementById("minPathWithMaxFood");
  e.innerText = `Min Path Length with Max Food: ${len}`;
}

function highlightMinPath(visitedCells) {
  // clear prior highlights
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const gameCell = document.getElementById(`game-cell-${y}-${x}`);
      gameCell.classList.remove("minPath");
    }
  }

  // set new highlights
  for (let cell of visitedCells) {
    let y = cell[0];
    let x = cell[1];
    const gameCell = document.getElementById(`game-cell-${y}-${x}`);
    gameCell.classList.add("minPath");
  }
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
  let maxPathLength = 0;
  let cellVisitedCount = 0;
  let foodFound = 0;
  let minPathWithMaxFood = undefined;
  // let foundCell = false;

  generatePaths(dogCell, visitedCells, foodFound);

  async function generatePaths(cell, priorVisitedCells, priorFoodFound) {
    let foodFound = priorFoodFound;
    iterations++;
    setCellVisitedCount(++cellVisitedCount);
    if (iterations > 2000) { console.log("iterations at 100"); return; }
    console.log("generate path for cell:", cell);
    // console.log("visited cells:", visitedCells);
    let cy = cell.coords[0];
    let cx = cell.coords[1];
    placePieceInHtml(cy, cx);
    await delay(50);
    let visitedCells = priorVisitedCells.slice();
    visitedCells.push(`${cy}${cx}`);
    updatedHtmlVisited(visitedCells);
    let cellsToVisitQueue = [];
    let cellVisited = false;
    if (cell.type === "F") { foodFound++; }

    let hitHome = false;
    if (cell.type === 'H') {
      hitHome = true;
    }

    if (!hitHome) {

      // add up node if it exists and hasn't been visited
      console.log("checking up");
      // if (strArr[cy-1] !== undefined && strArr[cy-1][cx] !== undefined) {
      if (
        strArr[cy-1] !== undefined &&
        strArr[cy-1][cx] !== undefined &&
        !visitedCells.includes(`${cy-1}${cx}`) // && strArr[cy-1][cx] !== 'H'
      ) {
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
      if (
        strArr[cy+1] !== undefined &&
        strArr[cy+1][cx] !== undefined &&
        !visitedCells.includes(`${cy+1}${cx}`) // && strArr[cy+1][cx] !== 'H'
      ) {
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
      if (
        strArr[cy][cx-1] !== undefined &&
        !visitedCells.includes(`${cy}${cx-1}`) // && strArr[cy][cx-1] !== 'H'
      ) {
        let newCell = new Cell([cy, cx-1], strArr[cy][cx-1]);
        cell.left = newCell;
        console.log("dogCell:", dogCell);
        // generatePaths(newCell);
        // foundCell = true;
        cellsToVisitQueue.push(newCell);
      }

      console.log("checking right");
      // add right node if it exists and hasn't been visited
      if (
        strArr[cy][cx+1] !== undefined &&
        !visitedCells.includes(`${cy}${cx+1}`) // && strArr[cy][cx+1] !== 'H'
      ) {
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
        cellVisited = true;
        updateHtmlQueueList(cellsToVisitQueue);
        console.log("Iterating through queue:", cellsToVisitQueue);
        cellToVisit = cellsToVisitQueue.pop();
        await generatePaths(cellToVisit, visitedCells, foodFound);
        console.log("paths generated for:", cellToVisit);
      }
    }
    removePieceFromHtml(cy, cx);

    if (cellVisited === false) {
      setFoodFoundAlongPath(foodFound);
      let pathLength = visitedCells.length;
      setLastPathLength(pathLength);
      if (maxPathLength !== Math.max(maxPathLength, pathLength)) {
        maxPathLength = pathLength;
        setMaxPathLength(maxPathLength);
      }
      if (foodFound === 3 && hitHome) {
        if (minPathWithMaxFood !== Math.min(minPathWithMaxFood, pathLength)) {
          minPathWithMaxFood = pathLength;
          setMinPathWithMaxFood(minPathWithMaxFood);
          highlightMinPath(visitedCells);
        }
      }
    }

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
SearchingChallenge(testMatrix);