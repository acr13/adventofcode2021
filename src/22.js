import fs from 'fs';

const parseLine = (line) => {
  const [toggle, right] = line.split(' ');
  const [xs, ys, zs] = right.split(',').map(x => x.substring(2).split('..').map(Number));
  return [toggle, [xs, ys, zs]];
};

const key = (x, y, z) => `${x},${y},${z}`;

const p1 = (instructions) => {
  const cubes = new Map();

  for (let i = 0; i < instructions.length; i++) {
    const [toggle, [[xMin, xMax], [yMin, yMax], [zMin, zMax]]] = instructions[i];
    if (xMin < -50 || xMax > 50 || yMin < -50 || yMax > 50 || zMin < -50 || zMax > 50) continue;

    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        for (let z = zMin; z <= zMax; z++) {
          toggle === 'on' ? cubes.set(key(x, y, z)) : cubes.delete(key(x, y, z));
        }
      }
    }
  }

  return cubes.size
};

const lineOverlap = (min0, max0, min1, max1) => [ Math.max(min0, min1), Math.min(max0, max1) ];
const volume = (box) => (box.xMax - box.xMin + 1) * (box.yMax - box.yMin + 1) * (box.zMax - box.zMin + 1);
const copyBox = (xMin, xMax, yMin, yMax, zMin, zMax) => ({
  xMin, xMax, yMin, yMax, zMin, zMax
});
const overlap = (box, boxes) => {
  return boxes.map(b => {
    const [overlapMinX, overlapMaxX] = lineOverlap(box.xMin, box.xMax, b.xMin, b.xMax);
    const [overlapMinY, overlapMaxY] = lineOverlap(box.yMin, box.yMax, b.yMin, b.yMax);
    const [overlapMinZ, overlapMaxZ] = lineOverlap(box.zMin, box.zMax, b.zMin, b.zMax);
    if (overlapMaxX - overlapMinX >= 0 &&
      overlapMaxY - overlapMinY >= 0 &&
      overlapMaxZ - overlapMinZ >= 0) {
      const tempBox = copyBox(overlapMinX, overlapMaxX, overlapMinY, overlapMaxY, overlapMinZ, overlapMaxZ);
      return volume(tempBox) - overlap(tempBox, boxes.slice(1 + boxes.indexOf(b)));
    } else {
      return 0; // No overlap
    }
  }).reduce((a, b) => a + b, 0);
};


// Go through the instructions in the reverse order - and check for any previous overlap if 'on'
const p2 = (instructions) => {
  let cubesOn = 0;
  const boxes = [];

  for (let i = instructions.length - 1; i >= 0; i--) {
    const [toggle, [[xMin, xMax], [yMin, yMax], [zMin, zMax]]] = instructions[i];
    const box = copyBox(xMin, xMax, yMin, yMax, zMin, zMax);
    toggle === 'on' && (cubesOn += (volume(box) - overlap(box, boxes)));
    boxes.push(box);
  }

  return cubesOn;
};

const instructions = fs.readFileSync('./src/inputs/22.txt', 'UTF-8')
  .split(/\r?\n/)
  .map(parseLine);

console.log('Part one:', p1(instructions));
console.log('Part two:', p2(instructions));