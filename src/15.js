import fs from 'fs';

const grid = [];

fs.readFileSync('./src/inputs/15.txt', 'UTF-8')
  .split(/\r?\n/)
  .map(line => grid.push(line.split('').map(Number)));

const key = (r, c) => `${r},${c}`;

const nearby = (grid, r, c) =>
  [
    [r, c - 1],
    [r, c + 1],
    [r - 1, c],
    [r + 1, c],
  ].filter(([r2, c2]) => r2 >= 0 && r2 < grid.length && c2 >= 0 && c2 < grid[0].length);

const p1 = (grid, r, c) => {
  const queue = [{ pos: [r, c], cost: 0 }];
  const visited = new Set();

  while (queue.length > 0) {
    const {
      pos: [r2, c2],
      cost,
    } = queue.shift(); // dfs not bfs

    if (r2 === grid.length - 1 && c2 === grid[r2].length - 1) {
      return cost;
    }

    nearby(grid, r2, c2)
      .filter(([rr, cc]) => !visited.has(key(rr, cc)))
      .forEach(([rr, cc]) => {
        visited.add(key(rr, cc));
        queue.push({ pos: [rr, cc], cost: cost + grid[rr][cc] });
      });
    queue.sort((a, b) => a.cost - b.cost);
  }
};

const expandedGrid = [...new Array(grid.length * 5)].map((_, r) =>
  [...new Array(grid[0].length * 5)].map((_, c) =>
    1 + (
      (grid[r % grid.length][c % grid[0].length] - 1 +
        Math.trunc(c / grid[0].length) +
        Math.trunc(r / grid.length)
      ) % 9
    )
  )
);

console.log('Part one:', p1(grid, 0, 0));
console.log('Part two:', p1(expandedGrid, 0, 0));