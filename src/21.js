const playDeterministic = (positions) => {
  const scores = [0, 0];

  let currentPlayerIdx = 0;
  let die = 1;
  let diceRolls = 0;

  while (!scores.some(score => score >= 1000)) {
    let currentScore = 0;
    for (let i = 0; i < 3; i++) {
      currentScore += die;
      die++;
      diceRolls++;
      if (die > 100) { die = 1; }
    }

    positions[currentPlayerIdx] = ((positions[currentPlayerIdx] - 1 + currentScore) % 10) + 1;
    scores[currentPlayerIdx] += positions[currentPlayerIdx];

    // console.log(`player ${currentPlayerIdx + 1} rolls ${die}, to space ${positions[currentPlayerIdx]}, total score = ${scores[currentPlayerIdx]}`);
    currentPlayerIdx = currentPlayerIdx === 0 ? 1 : 0;
  }

  return diceRolls * Math.min(...scores);
};

const diceDistribution = (num) => {
  switch (num) {
      case 3: return 1;   // 111
      case 4: return 3;   // 112, 121, 211
      case 5: return 6;   // 113, 131, 311, 122, 212, 221
      case 6: return 7;   // 123, 132, 213, 231, 312, 321, 222
      case 7: return 6;   // 223, 232, 322, 133, 313, 331
      case 8: return 3;   // 233, 323, 332
      case 9: return 1;   // 333
  }
};

const playSplitUniverse = (p1, p2, isP1Turn) => {
  if (p1.score >= 21) {
    return 1;
  } else if (p2.score >= 21) {
    return 0;
  }

  const p = isP1Turn ? p1 : p2;
  let sum = 0;

  // each roll is 3 new copies of the game, min is 3, max is 9
  // using a helper above to map these into actual copies of the game
  for (let die = 3; die <= 9; die++) {
      const oldPos = p.pos;
      const oldScore = p.score;
      const multiplier = diceDistribution(die);

      p.pos = ((p.pos - 1 + die) % 10) + 1;
      p.score += p.pos;
      sum += multiplier * playSplitUniverse(p1, p2, !isP1Turn);

      p.pos = oldPos;
      p.score = oldScore;
  }

  return sum;
};

const partTwo = (positions) => {
  const p1 = { pos: positions[0], score: 0 };
  const p2 = { pos: positions[1], score: 0 };

  return playSplitUniverse(p1, p2, true);
};

console.log('Part one:', playDeterministic([4, 7]));
console.log('Part two:', partTwo([4, 7]));