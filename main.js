function SearchingChallenge(matrix) {

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

  let dogCell = new Cell(dogCoords, 'D');
  generatePaths(dogCell, visitedCells, foodFound, matrix);

}

createHtmlBoard();
SearchingChallenge(testMatrix);