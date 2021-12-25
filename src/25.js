import fs from 'fs';

let grid = [];

fs.readFileSync('./src/inputs/25.txt', 'UTF-8')
  .split(/\r?\n/)
  .map(line => grid.push([...line.split('')]));

const emptyGrid = () => {
  const g = [];
  for (let i = 0; i < grid.length; i++) {
    g.push([]);
    for (let j = 0; j < grid[i].length; j++) {
      g[i][j] = grid[i][j];
    }
  }
  return g;
}

// brute force lols
const run = () => {
  let steps = 0;

  while (true) {
    const newGrid = emptyGrid();
    let moved = false;
  
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === '>') {
          let rightC = (c + 1 >= grid[r].length) ? 0 : c + 1;
          if (grid[r][rightC] === '.') {
            newGrid[r][rightC] = '>';
            newGrid[r][c] ='.';
            moved = true;
          }
        }
      }
    }
  
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === 'v') {
          let downR = (r + 1 >= grid.length) ? 0 : r + 1;
          // only tricky part...
          // down arrows can move down if the previous step it was an empty space, OR if it was a
          // right arrow that has moved
          if ((grid[downR][c] === '>' || grid[downR][c] === '.') && newGrid[downR][c] === '.') {
            newGrid[downR][c] = 'v';
            newGrid[r][c] = '.'
            moved = true;
          }
        }
      }
    }
  
    grid = newGrid;
    steps++;
  
    if (!moved) {
      return steps;
    }
  }
};

console.log('Part one:', run());
