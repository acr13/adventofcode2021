import fs from 'fs';

const input = fs.readFileSync('./src/inputs/12.txt', 'utf-8').split(/\r?\n/).map(c => c.split('-'));
const PATHS = {};

for (let i = 0; i < input.length; i++) {
  const [left, right] = input[i];
  if (!PATHS[left]) { PATHS[left] = []; }
  if (!PATHS[right]) { PATHS[right] = []; }
  PATHS[left].push(right);
  PATHS[right].push(left);
}

const getPath = (cave, path, paths, minor) => { 
  let newPath = [...path, cave];

  if (cave === 'end') { paths.push(newPath); return; }

  PATHS[cave].forEach(c => { 
    if(c === c.toUpperCase() || !newPath.includes(c)){ 
      getPath(c, newPath, paths, minor);
    } else if (minor && c !== 'start' && c !== 'end') {
      getPath(c, newPath, paths, false);
    }
  });
}

const p1 = []; 
getPath('start', [], p1, false); 
console.log('Part one:', p1.length);

const p2 = []; 
getPath('start', [], p2, true); 
console.log('Part two:', p2.length);