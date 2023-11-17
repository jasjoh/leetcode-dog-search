const cellVisitedCountHtml = document.getElementById('cellVisitedCount');
cellVisitedCountHtml.innerText = 1;

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
  gameCell.innerHTML = "";
}

function setCellVisitedCount(value) {
  cellVisitedCountHtml.innerText = `Total Cells Visited: ${value}`;
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