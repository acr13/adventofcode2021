import fs from 'fs';

const numbers = fs.readFileSync('./src/inputs/7.txt', 'UTF-8').split(',').map(Number);

const p1 = (numbers) => {
  const MIN = Math.min(...numbers);
  const MAX = Math.max(...numbers);

  let minFuel = Infinity;

  for (let i = MIN; i <= MAX; i++) {
    let fuel = 0;

    for (let j = 0; j < numbers.length; j++) {
      fuel += Math.abs(numbers[j] - i);
    }

    minFuel = fuel < minFuel ? fuel : minFuel
  }

  return minFuel;
};

const p2 = (numbers) => {
  const MIN = Math.min(...numbers);
  const MAX = Math.max(...numbers);

  let minFuel = Infinity;

  for (let i = MIN; i <= MAX; i++) {
    let fuel = 0;

    for (let j = 0; j < numbers.length; j++) {
      const delta = Math.abs(numbers[j] - i);
      let deltaFuel = 0;

      for (let i = 1; i <= delta; i++) {
        deltaFuel += i;
      }

      fuel += deltaFuel;
    }

    minFuel = fuel < minFuel ? fuel : minFuel
  }

  return minFuel;
}

console.log('Part one:', p1(numbers));
console.log('Part two:', p2(numbers));