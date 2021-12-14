import fs from 'fs';

const lines = fs.readFileSync('./src/inputs/14.txt', 'utf-8').split(/\r?\n/);
const rules = {};

let polymer = lines.shift().split(''); lines.shift();

lines.forEach(line => {
  const [left, right] = line.split(' -> ');
  rules[left] = right;
});

const freqMap = (polymer) => {
  const map = {};

  for (let i = 0; i < polymer.length; i++) {
    const c = polymer[i];
    if (!map[c]) { map[c] = 0; }
    map[c]++;
  }

  return map;
};

const step = (polymer, rules) => {
  for (let i = 1; i < polymer.length; i++) {
    const pair = `${polymer[i - 1]}${polymer[i]}`;
    if (rules[pair]) {
      polymer.splice(i, 0, rules[pair]);
      i++;
    }
  }

  return polymer;
};

const p1 = (polymer, rules) => {
  let p = [...polymer];
  for (let i = 0; i < 10; i++) {
    p = step(p, rules);
  }
  
  const map = freqMap(p);
  const freq = Object.values(map);
  const most = Math.max(...freq);
  const least = Math.min(...freq);

  return most - least;
}

// hmm cant brute force this
const p2 = (polymer, rules) => {
  let pairs = {};

  for (let i = 1; i < polymer.length; i++) {
    const pair = `${polymer[i - 1]}${polymer[i]}`;
    if (!pairs[pair]) { pairs[pair] = 0; }
    pairs[pair]++;
  }

  // for each pair ('SV' with count of N)
  // given a particular rule 'SV' -> O
  // increase pair 'SO' += N and pair 'OV' += N
  for (let i = 0; i < 40; i++) {
    let newPairs = {};

    for (const pair in pairs) {
      if (rules[pair]) {
        const newChar = rules[pair];
        const first = `${pair.charAt(0)}${newChar}`;
        if (!newPairs[first]) { newPairs[first] = 0; }

        const second = `${newChar}${pair.charAt(1)}`;
        if (!newPairs[second]) { newPairs[second] = 0; }

        newPairs[first] += pairs[pair];
        newPairs[second] += pairs[pair];
      }
    }

    pairs = newPairs;
  }

  const freqMap = {};

  for (const pair in pairs) {
    const first = pair.charAt(0);
    if (!freqMap[first]) { freqMap[first] = 0; }
    freqMap[first] += pairs[pair];

    const second = pair.charAt(1);
    if (!freqMap[second]) { freqMap[second] = 0; }
    freqMap[second] += pairs[pair];
  }

  const freq = Object.values(freqMap).map(x => Math.ceil(x / 2));
  const most = Math.max(...freq);
  const least = Math.min(...freq);

  return most - least;
}

console.log('Part one:', p1(polymer, rules));
console.log('Part two:', p2(polymer, rules));
