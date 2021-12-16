import fs from 'fs';

function hex2bin(hex) { return (parseInt(hex, 16).toString(2)).padStart(4, '0'); }

// const input = '9C0141080250320F1802104A08'.split('').map(hex2bin).join('');
const input = fs.readFileSync('./src/inputs/16.txt', 'UTF-8').split('').map(hex2bin).join('');

const parseLiteral = (literal) => {
  let binaryNumber = '';
  let done = false;
  let i = 0;
  let length = 0;

  while (!done) {
    const n = literal.substring(i, i + 5);

    if (n.charAt(0) === '1') {
      i += 5;
    } else {
      done = true;
    }
    binaryNumber += n.substring(1);
    length += 5;
  }

  return { binaryNumber, length };
};

const parsePacket = (binary) => {
  // console.log('parsing', binary);
  
  const parsed = {};
  parsed.version = parseInt(binary.substring(0, 3), 2);
  parsed.type = parseInt(binary.substring(3, 6), 2);
  parsed.length = 6;

  if (parsed.type === 4) { // literal packet
    const binaryLiteral = binary.substring(6);
    const { binaryNumber: literal, length } = parseLiteral(binaryLiteral);

    parsed.length += length;
    parsed.value = parseInt(literal, 2);
  } else {
    parsed.internal = [];
    const typeId = parseInt(binary.substring(6, 7));
    parsed.length += 1;
    
    if (typeId === 0) { // next 15 bits are the total length of the packets
      let remainingBits = parseInt(binary.substring(7, 7 + 15), 2);
      parsed.length += 15;
      let remainder = binary.substring(7 + 15);

      while (remainingBits > 0) {
        const packet = parsePacket(remainder);
        if (packet == false) {
          return;
        }
        remainingBits -= packet.length;
        parsed.internal.push(packet);
        remainder = remainder.substring(packet.length);
      }

      parsed.length += parsed.internal.reduce((sum, p) => sum + p.length, 0);
    } else { // 1
      const numberOfRemainingBits = parseInt(binary.substring(7, 7 + 11), 2);
      parsed.length += 11;
      let remainder = binary.substring(7 + 11);

      let n = 0;
      while (n < numberOfRemainingBits) {
        const packet = parsePacket(remainder);
        parsed.internal.push(packet);
        remainder = remainder.substring(packet.length);
        n++;
      }

      parsed.length += parsed.internal.reduce((sum, p) => sum + p.length, 0);
      // console.log(parsed.internal);
    }
  }

  return parsed;
};

const sumVersions = (packet) => {
  if (!packet.internal) {
    return packet.version;
  }

  const sumOfInternal = packet.internal.reduce((sum, acc) => sum + sumVersions(acc), 0);
  return packet.version + sumOfInternal;
};

const evaluate = (packet) => {
  if (!packet.internal) {
    return packet.value;
  }

  if (packet.type === 0) {
    return packet.internal.reduce((sum, acc) => sum + evaluate(acc), 0);
  } else if (packet.type === 1) {
    return packet.internal.reduce((produc, acc) => produc * evaluate(acc), 1);
  } else if (packet.type === 2) {
    return Math.min(...packet.internal.map(p => evaluate(p)));
  } else if (packet.type === 3) {
    return Math.max(...packet.internal.map(p => evaluate(p)));
  } else if (packet.type === 5) {
    const [first, second] = packet.internal.map(p => evaluate(p));
    return first > second ? 1 : 0;
  } else if (packet.type === 6) {
    const [first, second] = packet.internal.map(p => evaluate(p));
    return first < second ? 1 : 0;
  } else if (packet.type === 7) {
    const [first, second] = packet.internal.map(p => evaluate(p));
    return first === second ? 1 : 0;
  }
};


const parsed = parsePacket(input);
console.log(parsed);
console.log('Part one:', sumVersions(parsed));
console.log('Part two:', evaluate(parsed));