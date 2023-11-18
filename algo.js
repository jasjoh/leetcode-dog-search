const delayInMs = 20;

let visitedCells = [];
let iterations = 0;
let maxPathLength = 0;
let cellVisitedCount = 0;
let foodFound = 0;
let minPathWithMaxFood = undefined;

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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generatePaths(cellToCheck, priorVisitedCells, priorFoodFound, matrix) {

  let reachedHome = false;
  let foodFound = priorFoodFound;
  let visitedCells = priorVisitedCells.slice();

  let cy = cellToCheck.coords[0];
  let cx = cellToCheck.coords[1];
  visitedCells.push(`${cy}${cx}`);

  let cellsToVisitQueue = [];
  let cellVisited = false;

  if (cellToCheck.type === "F") { foodFound++; }
  if (cellToCheck.type === 'H') { reachedHome = true; }

  iterations++;
  if (iterations > 2000) { console.log("bailing at 2000 iterations"); return; }

  // HTML CALL
  setCellVisitedCount(++cellVisitedCount);
  placePieceInHtml(cy, cx);
  updatedHtmlVisited(visitedCells);

  // Delay as needed for watching algo visualization
  await delay(delayInMs);

  // If we reached home, we don't need to keep pathing
  if (!reachedHome) {

    // add up node if it exists and hasn't been visited
    if (
      matrix[cy-1] !== undefined &&
      matrix[cy-1][cx] !== undefined &&
      !visitedCells.includes(`${cy-1}${cx}`)
    ) {
      let newCell = new Cell([cy-1, cx], matrix[cy-1][cx]);
      cellToCheck.up = newCell;
      cellsToVisitQueue.push(newCell);
    }

    // add down node if it exists and hasn't been visited
    if (
      matrix[cy+1] !== undefined &&
      matrix[cy+1][cx] !== undefined &&
      !visitedCells.includes(`${cy+1}${cx}`)
    ) {
      let newCell = new Cell([cy+1, cx], matrix[cy+1][cx]);
      cellToCheck.down = newCell;
      cellsToVisitQueue.push(newCell);
    }

    // add left node if it exists and hasn't been visited
    if (
      matrix[cy][cx-1] !== undefined &&
      !visitedCells.includes(`${cy}${cx-1}`)
    ) {
      let newCell = new Cell([cy, cx-1], matrix[cy][cx-1]);
      cellToCheck.left = newCell;
      cellsToVisitQueue.push(newCell);
    }

    // add right node if it exists and hasn't been visited
    if (
      matrix[cy][cx+1] !== undefined &&
      !visitedCells.includes(`${cy}${cx+1}`)
    ) {
      let newCell = new Cell([cy, cx+1], matrix[cy][cx+1]);
      cellToCheck.right = newCell;
      cellsToVisitQueue.push(newCell);
    }

    let cellToVisit = undefined;
    while(cellsToVisitQueue.length > 0) {
      switchHtmlToPawPrint(cy, cx);
      cellVisited = true;
      updateHtmlQueueList(cellsToVisitQueue);
      cellToVisit = cellsToVisitQueue.pop();
      await generatePaths(cellToVisit, visitedCells, foodFound, matrix);
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

    if (foodFound === foodCount && reachedHome) {
      if (minPathWithMaxFood !== Math.min(minPathWithMaxFood, pathLength)) {
        minPathWithMaxFood = pathLength;
        setMinPathWithMaxFood(minPathWithMaxFood);
        highlightMinPath(visitedCells);
      }
    }
  }
}

