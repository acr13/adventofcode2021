import fs from 'fs';

const lines = fs.readFileSync('./src/inputs/10.txt', 'UTF-8').split(/\r?\n/);

const OPENING = ['(', '{', '[', '<'];
const PAIRS = { '(': ')', '{': '}', '[': ']', '<': '>' };

const removeCorruptedLines = (lines) => {
  const POINTS = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
  const corruptedLines = [];
  let corruptedScore = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stack = [];
    
    for (let j = 0; j < line.length; j++) {
      const c = line.charAt(j);

      if (OPENING.includes(c)) {
        stack.push(c);
      } else {
        const lastOpener = stack.pop();
        if (PAIRS[lastOpener] !== c) {
          corruptedScore += POINTS[c];
          corruptedLines.push(i);
        }
      }
    }
  }

  console.log('Part one:', corruptedScore);
  return lines.filter((_, idx) => !corruptedLines.includes(idx));
};

const incompleteScore = (stack) => {
  const POINTS = { ')': 1, ']': 2, '}': 3, '>': 4 };
  let score = 0;

  while(stack.length > 0) {
    score *= 5;
    const c = PAIRS[stack.pop()];
    score += POINTS[c];
  }

  return score;
}

const fixAndScoreIncompleteLines = (lines) => {
  const scores = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stack = [];
    
    for (let j = 0; j < line.length; j++) {
      const c = line.charAt(j);

      if (OPENING.includes(c)) {
        stack.push(c);
      } else {
        stack.pop();
      }
    }

    scores.push(incompleteScore(stack));
  }

  scores.sort((a, b) => b - a);
  // console.log(scores);
  return scores[Math.floor(scores.length / 2)];
};

const incompleteLines = removeCorruptedLines(lines);
console.log('Part two:', fixAndScoreIncompleteLines(incompleteLines));
