const fs = require('fs');
const file = fs.readFileSync('./src/inputs/2.txt', 'UTF-8')
  .split(/\r?\n/)
  .map(line => {
    const parts = line.split(' ');
    return [parts[0], Number(parts[1])];
  });

const p1 = (moves) => {
  let x = 0;
  let y = 0;

  for (let i = 0; i < moves.length; i++) {
    const [inst, n] = moves[i];
    if (inst === 'forward') {
      x += n;
    } else if (inst === 'up') {
      y -= n;
    } else { // inst === 'down'
      y += n;
    }
  }

  return x * y;
};

const p2 = (moves) => {
  let x = 0;
  let y = 0;
  let aim = 0;

  for (let i = 0; i < moves.length; i++) {
    const [inst, n] = moves[i];
    if (inst === 'forward') {
      x += n;
      y += (aim * n);
    } else if (inst === 'up') {
      aim -= n;
    } else { // inst === 'down'
      aim += n;
    }
  }

  return x * y;
}

console.log('Part one:', p1(file));
console.log('Part one:', p2(file));