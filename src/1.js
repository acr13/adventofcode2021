const fs = require('fs');
const numbers = fs.readFileSync('./src/inputs/1.txt', 'UTF-8')
  .split(/\r?\n/)
  .map(Number);

let p1 = 0;
let p2 = 0;

for (let i = 1; i < numbers.length; i++) {
  if (numbers[i] > numbers[i - 1]) { p1++; }
  if (i > 2 && numbers[i] > numbers[i - 3]) { p2++; }
}

console.log('Part one:', p1);
console.log('Part two:', p2);