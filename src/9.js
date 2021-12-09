import fs from 'fs';

const grid = [];

fs.readFileSync('./src/inputs/9.txt', 'UTF-8')
  .split(/\r?\n/)
  .map(line => grid.push(line.split('').map(Number)));

const ROWS = grid.length;
const COLS = grid[0].length;

const nearby = (grid, r, c) =>
  [
    [r, c - 1],
    [r, c + 1],
    [r - 1, c],
    [r + 1, c],
  ].filter(([r2, c2]) => r2 >= 0 && r2 < grid.length && c2 >= 0 && c2 < grid[0].length);

const isLowPoint = (grid, r, c) => nearby(grid, r, c).every(([r2, c2]) => grid[r2][c2] > grid[r][c]);

const getLowPoints = (grid) => {
  const lows = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0 ; c < COLS; c++) {
      if (isLowPoint(grid, r, c)) {
        lows.push([r, c, grid[r][c]]);
      }
    }
  }

  return lows;
};

const getBasins = (grid, lowPoints) => {
  const basins = [];

  for (let i = 0; i < lowPoints.length; i++) {
    const [r, c, l] = lowPoints[i];
    
    // BFS
    const nearbyCells = nearby(grid, r, c);
    const visited = new Set(`${r},${c}`);
    const basin = [l];

    while (nearbyCells.length > 0) {
      const [r2, c2] = nearbyCells.pop();
      
      // if this is good, check its neighbs
      if (!visited.has(`${r2},${c2}`) && grid[r2][c2] > grid[r][c] && grid[r2][c2] <= 8) { // no 9's
        visited.add(`${r2},${c2}`);
        basin.push(grid[r2][c2]);
        nearbyCells.push(...nearby(grid, r2, c2));
      }
    }
    
    basins.push(basin.length);
  }

  basins.sort((a, b) => b - a);
  return basins;
};


const lowPoints = getLowPoints(grid);
const p1 = lowPoints.map(n => n[2] + 1).reduce((sum, n) => sum + n, 0);
console.log('Part one:', p1);

const basins = getBasins(grid, lowPoints);
console.log('Part two:', basins[0] * basins[1] * basins[2]);
