import fs from 'fs';

let grid = [];

fs.readFileSync('./src/inputs/11.txt', 'UTF-8')
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
    [r - 1, c - 1],
    [r - 1, c + 1],
    [r + 1, c - 1],
    [r + 1, c + 1],
  ].filter(([r2, c2]) => r2 >= 0 && r2 < ROWS && c2 >= 0 && c2 < COLS);

const addOne = (grid) => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid[r][c]++;
    }
  }
  return grid;
};

const flash = (grid, step) => {
  const flashed = new Set();
  let done = false;

  while (!done) {
    done = true;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c] > 9 && !flashed.has(`${r},${c}`)) {
          flashed.add(`${r},${c}`);
          nearby(grid, r, c).forEach(([r2, c2]) => grid[r2][c2]++);
          done = false;
        }
      }
    }
  }

  if (flashed.size === 100) {
    console.log('Part two:', step + 1);
  }

  Array.from(flashed).map(key => key.split(',').map(Number))
    .forEach(([r, c]) => grid[r][c] = 0);

  return flashed.size;
};

let flashes = 0;
for (let i = 0; i < 471; i++) { // lolllll
  if (i === 100) {
    console.log('Part one:', flashes);
  }
  addOne(grid);
  flashes += flash(grid, i);
}