This repo is my attempt to visualize the algorithm associated with a leetcode problem.

The problem involves a 4x4 matrix representing a grid through which a dog can traverse. The grid includes anywhere from 1 to 8 pieces of food randomly distributed throughout the gird and a cell which serves as the dog's home. The goal of the exercise is to develop an algorithm which finds the shortest distance the dog can travel on the grid which results in it finding all the food and reaching it's home. The dog is allowed to navigate up, down, left, right and assumingly should not visit the same cell twice.

I had never solved this kind of problem before and was having a challenging time visualizing it, so I built a simple HTML table to visualize the grid and had the algorithm draw its traversal on the grid.

Notes:
- Leverages vanilla HTML / CSS / JS only
- Algo leverages trees (representing potential paths), recursion (pathing logic) and queues (tracking branches to path)
