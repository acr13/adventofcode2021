import fs from 'fs';

let input = fs.readFileSync('./src/inputs/6.txt', 'UTF-8').split(',').map(Number);
let fishMap = {};

input.forEach(n => {
  if (!fishMap[n]) { fishMap[n] = 0; }
  fishMap[n]++;
});

const DAYS = 256;
let i = 0;

while (i < DAYS) {
  const newFishMap = {};

  if (i === 80) {
    const sum = Object.values(fishMap).reduce((sum, n) => sum + n, 0);
    console.log('Part one:', sum);
  }

  // [key, value] === [time, count] (count of fish with same days / time left)
  for (const [key, count] of Object.entries(fishMap)) {
    if (parseInt(key) === 0) {
      if (!newFishMap[6]) { newFishMap[6] = 0; }
      if (!newFishMap[8]) { newFishMap[8] = 0; }
      newFishMap[6] += count;
      newFishMap[8] += count;
    } else {
      if (!newFishMap[key - 1]) { newFishMap[key - 1] = 0; }
      newFishMap[key - 1] += count;
    }
  }

  fishMap = newFishMap;
  i++;
}

const sum = Object.values(fishMap).reduce((sum, n) => sum + n, 0);
console.log('Part two:', sum);