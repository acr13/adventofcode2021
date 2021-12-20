import fs from 'fs';

const enhance = [];
const grid = [];
let lights = new Set();
let readGrid = false;

const input = fs.readFileSync('./src/inputs/20.txt', 'UTF-8').split(/\r?\n/);

const toKey = (coord) => `${coord[0]},${coord[1]}`;
const toCoord = (key) => key.split(',').map(Number);

const nearbyBinary = (lights, r, c, on) =>
  [
    [r - 1, c - 1],
    [r - 1, c],
    [r - 1, c + 1],
    [r, c - 1],
    [r, c],
    [r, c + 1],
    [r + 1, c - 1],
    [r + 1, c],
    [r + 1, c + 1],
  ].map((c) => lights.has(toKey(c)) !== on ? '1' : '0')
  .join('');

for (let i = 0; i < input.length; i++) {
  if (input[i] === '') { readGrid = true; continue; }

  if (readGrid) {
    grid.push(input[i].split(''));
  } else {
    enhance.push(...input[i]);
  }
}

for (let i = 0; i < grid.length; i++) {
  for(let j = 0; j < grid[i].length; j++) {
    if (grid[i][j] === '#') {
      lights.add(toKey([i, j]));
    }
  }
}

const step = (lights, on) => {
  let newLights = new Set();
  const lightArray = Array.from(lights).map(key => toCoord(key));
  const rows = lightArray.map(x => x[0]);
  const cols = lightArray.map(x => x[1]);
  const rowLo = Math.min(...rows);
  const rowHi = Math.max(...rows);
  const colLo = Math.min(...cols);
  const colHi = Math.max(...cols);  

  for (let r = rowLo - 5; r < rowHi + 5; r++) {
    for (let c = colLo - 5; c < colHi + 5; c++) {
      const binIdx = parseInt(nearbyBinary(lights, r, c, on), 2);
      if ((enhance[binIdx] === '#') === on) {
        newLights.add(toKey([r, c]));
      }
    }
  }

  return newLights;
}

for (let i = 0; i < 50; i++) {
  lights = step(lights, i % 2 === 1);
  if (i === 1) {
    console.log('Part one:', lights.size);
  }
}

console.log('Part two:', lights.size);