const fs = require('fs');
const numbers = fs.readFileSync('./src/inputs/3.txt', 'UTF-8').split(/\r?\n/);
const WIDTH = numbers[0].length;

const mostCommonBit = (numbers, col) => {
  let ones = 0;

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i].charAt(col) === '1') {
      ones++;
    }
  }

  return ones >= (numbers.length / 2) ? '1' : '0';
};

const leastCommonBit = (numbers, col) => mostCommonBit(numbers, col) === '1' ? '0' : '1';

const getGamma = (numbers) => {
  let gamma = '';

  for (let i = 0; i < WIDTH; i++) {
    gamma += mostCommonBit(numbers, i);
  }

  return gamma;
}

const p1 = (numbers) => {
  const gamma = getGamma(numbers);
  const epislon = gamma.split('').map(x => x === '1' ? '0' : '1').join('');
  return parseInt(gamma, 2) * parseInt(epislon, 2);
}

const getOxygen = (numbers) => {
  for (let i = 0; i < WIDTH; i++) {
    const most = mostCommonBit(numbers, i);
    numbers = numbers.filter(x => x.charAt(i) === most);

    if (numbers.length === 1) {
      return parseInt(numbers[0], 2);
    }
  }
};

const getCO2 = (numbers) => {
  for (let i = 0; i < WIDTH; i++) {
    const least = leastCommonBit(numbers, i);
    numbers = numbers.filter(x => x.charAt(i) === least);

    if (numbers.length === 1) {
      return parseInt(numbers[0], 2);
    }
  }
};

const p2 = (numbers) => getOxygen([...numbers]) * getCO2([...numbers]);

console.log('Part one:', p1(numbers));
console.log('Part two:', p2(numbers));