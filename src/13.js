import fs from 'fs';

const coords = [];
const folds = [];
let G = [];

const lines = fs.readFileSync('./src/inputs/13.txt', 'utf-8').split(/\r?\n/);
let read = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line === '') { read = true; continue; }

  if (!read) {
    coords.push(line.split(',').map(Number));
  } else {
    folds.push(line.split(' ')[2].split('='));
  }
}

const COLS = Math.max(...coords.map(coord => coord[0]));
const ROWS = Math.max(...coords.map(coord => coord[1]));

for (let i = 0; i <= ROWS; i++) {
  G.push(new Array(COLS + 1).fill('.'));
}

coords.forEach(([x, y]) => { G[y][x] = '#'; });

const foldUp = (grid, n) => {
  let newI = 0;
  for (let i = grid.length - 1; i > n; i--) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '#') {
        grid[newI][j] = grid[i][j];
      }
    }
    newI++;
    grid.pop();
  }
  grid.pop();

  return grid;
};

const foldLeft = (grid, n) => {
  for (let i = 0; i < grid.length; i++) {
    let newJ = 0;
    for (let j = grid[i].length - 1; j > n; j--) {
      if (grid[i][j] === '#') {
        grid[i][newJ] = grid[i][j];
      }
      newJ++;
    }

    grid[i].splice(n);
  }

  return grid;
};

const countDots = (grid) => {
  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '#') {
        count++;
      }
    }
  }

  return count;
};

for (let i = 0; i < folds.length; i++) {
  const [dir, n] = folds[i];

  if (dir === 'y') {
    G = foldUp(G, n);
  } else {
    G = foldLeft(G, n);
  } 

  if (i === 0) { // jesus christ
    console.log('Part one:', countDots(G));
  }
}

console.log('Part two:');
for (let i = 0; i < G.length; i++) {
  let line = '';
  for (let j = 0; j < G[0].length; j++) {
    line += G[i][j] === '.' ? ' ' : '#';
  }
  console.log(line);
}