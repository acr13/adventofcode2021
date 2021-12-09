import fs from 'fs';

const grid = [];

fs.readFileSync('./src/inputs/9.txt', 'UTF-8')
  .split(/\r?\n/)
  .map(line => grid.push(line.split('').map(Number)));

const COLS = grid.length;
const ROWS = grid[0].length;

const nearby = (grid, c, r) =>
  [
    [c - 1, r],
    [c + 1, r],
    [c, r - 1],
    [c, r + 1],
  ].filter(([c2, r2]) => c2 >= 0 && c2 < grid.length && r2 >= 0 && r2 < grid[0].length);

const isLowPoint = (grid, c, r) => nearby(grid, c, r).every(([c2, r2]) => grid[c2][r2] > grid[c][r]);

// step thru the grid, checking each cell if all nearby cells are less than the current cell
const getLowPoints = (grid) => {
  const lows = [];

  for (let c = 0; c < COLS; c++) {
    for (let r = 0 ; r < ROWS; r++) {
      if (isLowPoint(grid, c, r)) {
        lows.push([c, r, grid[c][r]]);
      }
    }
  }

  return lows;
};

const getBasins = (grid, lowPoints) => {
  const basins = [];

  for (let i = 0; i < lowPoints.length; i++) {
    const [c, r, l] = lowPoints[i];
    
    // BFS
    const nearbyCells = nearby(grid, c, r);
    const visited = new Set(`${c},${r}`);
    const basin = [l];

    while (nearbyCells.length > 0) {
      const [c2, r2] = nearbyCells.pop();
      
      // if this is good, check its neighbs
      if (!visited.has(`${c2},${r2}`) && grid[c2][r2] > grid[c][r] && grid[c2][r2] <= 8) { // no 9's
        visited.add(`${c2},${r2}`);
        basin.push(grid[c2][r2]);
        nearbyCells.push(...nearby(grid, c2, r2));
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
