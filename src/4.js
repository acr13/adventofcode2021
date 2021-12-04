const fs = require('fs');
const file = fs.readFileSync('./src/inputs/4.txt', 'UTF-8').split(/\r?\n/);

const numbers = file[0].split(',').map(Number);
const cards = [ [] ];

for (let i = 2; i < file.length; i++) {
  const line = file[i];
  if (line === '') {
    cards.push([]);
  } else {
    const row = line.split(' ').filter(x => x !== '').map(Number);
    cards[cards.length - 1].push(row);
  }
}

const isWinner = (card) => {
  for (let r = 0; r < card.length; r++) {
    const row = card[r].join('');
    if (row === 'XXXXX') {
      return true;
    }
  }

  for (let c = 0; c < card[0].length; c++) {
    let col = '';
    for (let r = 0; r < card.length; r++) {
      col += card[r][c];
    }
    if (col === 'XXXXX') {
      return true;
    }
  }

  return false;
};

const calculateScore = (card, n, winners) => {
  const remaining = card
    .map(row => row.filter(x => x !== 'X'))
    .flat()
    .reduce((sum, val) => sum += val, 0);
  return remaining * n;
};

const play = (numbers, cards) => {
  const winners = [];

  for (let i = 0; i < numbers.length; i++) {
    const n = numbers[i];

    for (let j = 0; j < cards.length; j++) {
      const card = cards[j];
      if (winners.includes(j)) continue;

      for (let r = 0; r < card.length; r++) {
        for (let c = 0; c < card[r].length; c++) {
          if (card[r][c] === n) {
            card[r][c] = 'X';
            if (i >= 4 && isWinner(card)) {
              winners.push(j);

              if (winners.length === 1) {
                const score = calculateScore(card, n, winners);
                console.log('Part one:', score);
              } else if (winners.length === cards.length) {
                const score = calculateScore(card, n, winners);
                console.log('Part two:', score);
              }
            }
          }
        }
      }
    }
  }
};

play(numbers, cards);