import fs from 'fs';

const input = fs.readFileSync('./src/inputs/18.txt').toString().trim();

const parse = (input) => input.split('\n').map(parseNum);

const parseNum = (s) => {
  let depth = 0;
  let r = [];

  for (const c of s) {
    if (c === '[') {
      depth += 1;
    } else if (c === ']') {
      depth -= 1;
    } else if (c !== ',') {
      r.push([Number(c, 10), depth]);
    }
  }

  return r;
};

const explode = (xs) => {
  for (let i = 0; i < xs.length; i++) {
    let [_, depth] = xs[i];

    if (depth === 5) {
      const xl = xs[i][0];
      const xr = xs[i + 1][0];
      xs[i] = [0, 4];
      xs.splice(i + 1, 1);
      if (i > 0) xs[i - 1][0] += xl;
      if (i + 1 < xs.length) xs[i + 1][0] += xr;
      return true;
    }
  }
  return false
}

const split = (xs) => {
  for (let i = 0; i < xs.length; i++) {
    let [v, depth] = xs[i];

    if (v >= 10) {
      const xl = Math.floor(v / 2);
      const xr = Math.ceil(v / 2);
      xs[i] = [xl, depth + 1];
      xs.splice(i + 1, 0, [xr, depth + 1]);
      return true;
    }
  }

  return false;
}

const reduce = (xs) => {
  while (explode(xs) || split(xs)) {}
  return xs;
};

const join = (xs, ys) => {
  const deepen = (xs) => xs.map((e) => [e[0], e[1] + 1]);
  return [...deepen(xs), ...deepen(ys)];
};

const add = (xs, ys) => reduce(join(xs, ys));

const magnitude = (xs) => {
  xs = [...xs];
  let i = 0;

  while (true) {
    let [v, depth] = xs[i];
    if (i + 1 < xs.length) {
      let [nv, nd] = xs[i + 1];
      if (nd === depth) {
        xs[i] = [3 * v + 2 * nv, depth - 1];
        xs.splice(i + 1, 1);
        i = 0;
      } else {
        i++;
      }
    } else {
      return v;
    }
  }
}

const sum = (xss) => xss.slice(1, xss.length).reduce(add, xss[0]);

const p1 = (xss) => magnitude(sum(xss));

const p2 = (xss) => {
  let max = 0;

  for (let i = 0; i < xss.length; i++) {
    for (let j = 0; j < xss.length; j++) {
      if (i === j) continue;
      const m = magnitude(add(xss[i], xss[j]));
      if (m > max) max = m;
    }
  }

  return max;
}

const xss = parse(input);
console.log('Part one:', p1(xss));
console.log('Part two:', p2(xss));