const fs = require('fs');

const numbers = fs.readFileSync('./src/inputs/1.txt', 'UTF-8')
    .split(/\r?\n/)
    .map(Number);

const p1 = (numbers) => {
  let count = 0;

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > numbers[i - 1]) {
      count++;
    }
  }

  return count;
};

const p2 = (numbers) => {
  let count = 0;

  for (let i = 3; i < numbers.length; i++) {
    const current = numbers[i] + numbers[i - 1] + numbers[i - 2];
    const prev = numbers[i - 1] + numbers[i - 2] + numbers[i - 3];
    if (current > prev) {
      count++;
    }
  }

  return count;
};

console.log('Part one:', p1(numbers));
console.log('Part two:', p2(numbers));