const fs = require('fs');
const vents = fs.readFileSync('./src/inputs/5.txt', 'UTF-8')
  .split(/\r?\n/)
  .map(line =>line.split(' -> ')
    .map(coord => coord.split(',').map(Number))
  );
const MAX = Math.max(...vents.flat().flat());

const getGrid = () => {
  const grid = [];

  for (let i = 0; i <= MAX; i++) {
    grid.push(new Array(MAX).fill(0));
  }

  return grid;
};

const G1 = getGrid();
const G2 = getGrid();
const countOverlap = (grid) => grid.reduce((sum, row) => sum += row.filter(cell => cell >= 2).length , 0);

for (let i = 0; i < vents.length; i++) {
  const [ [x1, y1], [x2, y2] ] = vents[i];
  
  // vertical  
  if (x1 === x2) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      G1[y][x1]++;
      G2[y][x1]++;
    }
  } else if (y1 === y2) { // horizontal
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      G1[y1][x]++;
      G2[y1][x]++;
    }
  } else { // diagonal
    for (let i = 0; i <= Math.abs(x1 - x2); i++) {
      const x = x1 > x2 ? x1 - i : x1 + i;
      const y = y1 > y2 ? y1 - i : y1 + i;
      G2[y][x]++;
    }
  }
}

console.log('Part one:', countOverlap(G1));
console.log('Part two:', countOverlap(G2));