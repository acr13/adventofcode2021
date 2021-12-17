const input =
  // 'target area: x=20..30, y=-10..-5';
  'target area: x=288..330, y=-96..-50';


const [inputX, inputY] = input.split('area: ')[1].split(', ');
const [minX, maxX] = inputX.split('x=')[1].split('..').map(Number);
const [minY, maxY] = inputY.split('y=')[1].split('..').map(Number);

const targetX = { min: minX, max: maxX };
const targetY = { min: minY, max: maxY };

const simulate = (startX, startY) => {
  let current = [0, 0];
  let velocity = [startX, startY];
  let highestPoint = -1;

  while (true) {
    current = [current[0] + velocity[0], current[1] + velocity[1]];
    velocity = [velocity[0] > 0 ? velocity[0] - 1 : velocity[0] < 0 ? velocity[0] + 1 : velocity[0], velocity[1] - 1];
    highestPoint = current[1] > highestPoint ? current[1] : highestPoint;

    if (current[0] >= targetX.min && current[0] <= targetX.max && current[1] >= targetY.min && current[1] <= targetY.max) {
      return { success: true, highestPoint };
    } else if (current[0] > targetX.max || current[1] < targetY.min) {
      return { success: false };
    }
  }
};

const solve = () => {
  let highest = -1;
  let successfulPoints = new Set();

  for (let x = 0; x < 1000; x++) {
    for (let y = -1000; y < 1000; y++) {
      const { success, highestPoint } = simulate(x, y);
      if (success) {
        successfulPoints.add(`${x},${y}`);
        highest = highestPoint > highest ? highestPoint : highest
      }
    }
  }

  return { highest, total: successfulPoints.size };
};


const { highest, total } = solve();
console.log('Part one:', highest);
console.log('Part two:', total);