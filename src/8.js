import fs from 'fs';

const input = fs.readFileSync('./src/inputs/8.txt', 'UTF-8').split(/\r?\n/);

const p1 = input.reduce((sum, line) => {
  const outputs = line.split(' | ')[1].split(' ');
  return sum + outputs.filter(output => [2, 3, 4, 7].includes(output.length)).length;
}, 0);
console.log('Part one:', p1);

// GROUPS

//    [group 0]
// [1]         [0]
// [1]         [0]
//    [group 1]
// [2]         [0]
// [2]         [0]
//    [group 2]

// 1. Find the number with length 3, thats group 0 (real life number 7)
// 2. Find the number with length 4 (number 4). letters NOT in group 0 are group 1
// 3. Remaining letters are group 2
// 4. for each encoded number, count how many letters are in each group


const DIGIT_GROUPS = {
  '312': 0, '200': 1, '212': 2,
  '311': 3, '220': 4, '221': 5,
  '222': 6, '300': 7, '322': 8,
  '321': 9
};

const solveDigits = (line) => {
  const [left, right] = line.split(' | ');
  const groups = calcuateGroups(left.split(' '))
  return decodeNumbers(groups, right.split(' '));
};

const calcuateGroups = (encodedNumbers) => {
  const groups = [];

  // group 0 is number 7
  groups.push(encodedNumbers.find(n => n.length === 3));

  const group1 = encodedNumbers.find(n => n.length === 4)
    .split('')
    .filter(c => !groups[0].includes(c))
    .join('');
  groups.push(group1);
  
  groups.push('abcdefg'.split('').filter(c => !groups.join('').includes(c)).join(''));
  return groups;
};

const decodeNumbers = (groups, numbers) => {
  const number = [];

  for (let i = 0; i < numbers.length; i++) {
    const n = numbers[i];
    const groupNumber = [0, 0, 0];
    for (let j = 0; j < n.length; j++) {
      groupNumber[getGroupIndex(n.charAt(j), groups)]++;
    }
    number.push(DIGIT_GROUPS[groupNumber.join('')]);
  }

  return Number(number.join(''));
};

const getGroupIndex = (c, groups) => groups.findIndex(group => group.includes(c));

const p2 = input.reduce((sum, line) => sum + solveDigits(line), 0);
console.log('Part two:', p2);