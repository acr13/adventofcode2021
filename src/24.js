import fs from 'fs';

const input = fs.readFileSync('./src/inputs/24.txt', 'UTF-8')
  .split(/\r?\n/)
  .map(line => line.split(' '));

const stack = [];
const p1 = new Array(14);
const p2 = new Array(14);

for (let i = 0; i < 14; i++) {
  const [,, x] = input[18 * i + 4];

  if (x === '1') {
    const [,, a] = input[18 * i + 15];
    stack.push([i, Number(a)]);
  } else {
    let [j, n] = stack.pop();
    const [,, y] = input[18 * i + 5];
    n += Number(y);

    if (n > 0) {
      p1[i] = 9
      p1[j] = 9 - n
      p2[i] = 1 + n
      p2[j] = 1
    } else {
      p1[i] = 9 + n
      p1[j] = 9
      p2[i] = 1
      p2[j] = 1 - n
    }
  }
}

console.log('Part one:', Number(p1.join('')));
console.log('Part two:', Number(p2.join('')));
