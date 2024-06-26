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

// used for visualizer
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Parent function that accepts a matrix to path through */
function searchingChallenge(matrix) {

  // find the starting location + count the amount of food needed
  let dogCoords = [];
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      if (matrix[i][j] === 'C') {
        dogCoords = [i, j];
      }
      if (matrix[i][j] === 'F') {
        foodCount++;
      }
    }
  }

  // start the recursion
  let dogCell = new Cell(dogCoords, 'D')
  generatePaths(dogCell, visitedCells, foodFound, matrix);

}
/**
 * The core recursive function that is used to generate paths
 * Accepts:
 * - A cell to generate further paths from
 * - A list of cells previously visited (which should not be visited again)
 * - A count of how much food has been found
 * - The source matrix in which pathing is taking place
 * Logic:
 * - Determines whether this cell is the home (end) or not
 * - Creates a copy of found food
 * - Creates a copy of the list of prior visited cells
 * - Add itself to the list of visited cells (for passing to future cells)
 * - Checks if it's a food cell and if so, increments the food count
 * - Updates the HTML visualizer to:
 * -- increment visited cells counts
 * -- place a piece in the HTML grid showing the cell was visited
 * -- display the updated visited cell list
 * - If not the home cell, checks each cardinal direction to see if additional paths are available
 * - If a path is available (exists and hasn't been visited)
 * -- Instantiates a new cell and adds it to a queue of cells to recursively path
 * -- Updates the piece rendering to be a "visited" (e.g. a paw print)
 * - Dequeues and recursively paths the cells in the queue
 * - Updates the display of queued cells in the HTML
 * - Upon fully emptying the queues (if needed / not home)
 * -- updates the display to remove the piece (we've completed all paths)
 * -- updates path length trackers and food trackers
 * -- updates min / max lengths
 * Returns undefined
 */
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

  // For preventing infinite loops
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
    setFoodFoundAlongPath(foodFound); // visualization logic

    let pathLength = visitedCells.length;
    setLastPathLength(pathLength);  // visualization logic

    // legacy max path length checking logic / visualization
    if (maxPathLength !== Math.max(maxPathLength, pathLength)) {
      maxPathLength = pathLength;
      setMaxPathLength(maxPathLength);
    }

    // logic to check if we traveled a valid "good" path
    if (foodFound === foodCount && reachedHome) {
      // logic to see if we have a new min "good" path length
      if (minPathWithMaxFood !== Math.min(minPathWithMaxFood, pathLength)) {
        minPathWithMaxFood = pathLength;
        setMinPathWithMaxFood(minPathWithMaxFood);
        highlightMinPath(visitedCells);
      }
    }
  }
}

