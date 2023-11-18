
/** Parent function that accepts a matrix to path through */
function SearchingChallenge(matrix) {

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

createHtmlBoard();
SearchingChallenge(testMatrix);