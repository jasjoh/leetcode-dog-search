/** All the logic associated with rendering the pathing / algo visualizer */


/** Generates and renders the empty HTML board / grid */
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
          gameCell.className = "end";
          break;
        case 'C':
          gameCell.className = "start";
          break;
      }
      gameRow.append(gameCell);
    }
    htmlBoard.append(gameRow);
  }
}

/** Places a 'piece' on the HTML board indicated a cell was visited */
function placePieceInHtml(y, x){
  const gamePiece = document.createElement("div");
  gamePiece.classList.add("gamePiece");
  gamePiece.classList.add("dog");

  const gameCell = document.getElementById(`game-cell-${y}-${x}`);
  gameCell.append(gamePiece);
}

/** Switches a cell to a 'visited' version */
function switchHtmlToPawPrint(y, x){
  const gameCell = document.getElementById(`game-cell-${y}-${x}`);
  const gamePiece = gameCell.getElementsByTagName("div")[0];
  gamePiece.classList.remove("dog");
  gamePiece.classList.add("paw-print");
}

/** Removes a piece (pathing finished for that piece) */
function removePieceFromHtml(y, x) {
  const gameCell = document.getElementById(`game-cell-${y}-${x}`);
  gameCell.innerHTML = "";
}

/** Updates cell visited counter */
function setCellVisitedCount(value) {
  cellVisitedCountHtml.innerText = `Total Cells Visited: ${value}`;
}

/** Updates the list of cells queued for pathing */
function updateHtmlQueueList(queue) {
  const e = document.getElementById('queue');
  let queueString = 'Queued Cells: ';
  for (let cell of queue) {
    queueString = queueString + cell.coords[0] + cell.coords[1] + " | ";
  }
  e.innerText = queueString;
}

/** Updates the list of visited cells as part of the current pathing attempt */
function updatedHtmlVisited(array) {
  const e = document.getElementById('visitedTracker');
  let visitedString = 'Visited: ';
  for (let cell of array) {
    visitedString = visitedString + cell + " | ";
  }
  e.innerText = visitedString;
}

/** Display the length of the last path */
function setLastPathLength(len) {
  const e = document.getElementById("lastPathLength");
  e.innerText = `Last Path Length: ${len}`;
}

/** Display the maximum path length */
function setMaxPathLength(len) {
  const e = document.getElementById("maxPathLength");
  e.innerText = `Max Path Length: ${len}`;
}

/** Display the amount of food found as part of the current pathing attempt */
function setFoodFoundAlongPath(foodFound) {
  const e = document.getElementById("foodFoundCounter");
  e.innerText = `Food Found on Last Path: ${foodFound}`;
}

/** Display the minimum good path length */
function setMinPathWithMaxFood(len) {
  const e = document.getElementById("minPathWithMaxFood");
  e.innerText = `Min Path Length with Max Food: ${len}`;
}

/** Highlight the path which achieved the min good path length */
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