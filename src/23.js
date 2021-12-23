import fs from 'fs';

const LETTERS_TO_IDX = { A: 0, B: 1, C: 2, D: 3 };

// globals since im doing recursion - suxxx
const stateCosts = new Map();
let minimumCost = Infinity;

const parse = (input) => {
  // get a list of the indexes (A:0, B:1, etc) from left to right
  const pods = input.split("\n")
    .slice(2, 4) // jump straight to the columns at the bottom
    .map((s) =>
      s.trim()
        .replace(/#/g, "")
        .split("")
        .map((l) => LETTERS_TO_IDX[l]),
    );

  // We know its 11 dots wide, null is above a column (they are columns 2,4,6,8 - nice);
  const hallway = new Array(11).fill(false).map((f, i) => i > 0 && i < 10 && i % 2 === 0 ? null : f);

  // zip em up
  const [top, bottom] = pods;
  const rooms = [];
  for (let i = 0; i < top.length; i++) {
    rooms.push([ top[i], bottom[i] ]);
  }

  return { hallway, rooms };
};

const getStateKey = ({ hallway, rooms }) => `${hallway}|${rooms}`;

const play = (state, init = false) => {
  if (init) {
    stateCosts.clear();
    minimumCost = Infinity;
  }

  if (state.cost > minimumCost) {
    return;
  }

  const { cost, hallway, rooms } = state;
  const stateKey = getStateKey({ hallway, rooms });

  // We've won if every room is filled with pods whose value corresponds to
  // the index of the room.
  const won = rooms.every((room, i) => room.every((pod) => pod === i));
  if (won) {
    if (cost < minimumCost) {
      minimumCost = cost;
    }
    return;
  }

  if ((stateCosts.get(stateKey) ?? Infinity) <= cost) {
    return;
  }
  stateCosts.set(stateKey, cost);

  // Now figure out all the possible moves from this point.

  // See if any pods can go home.
  for (let hallSpot = 0; hallSpot < hallway.length; hallSpot++) {
    if (hallway[hallSpot] === null || hallway[hallSpot] === false) {
      // This is not a stoppable spot, or nobody's in it.
      continue;
    }

    const pod = hallway[hallSpot];

    // If its home room is empty or only occupied by the same kind of pod,
    // we're good to go.
    if (rooms[pod].every((t) => t === pod || t === false)) {
      // This is the hallway column the pod needs to get to in order to
      // reach its room.
      const homeSpot = pod * 2 + 2;

      let allClear = false;
      if (homeSpot > hallSpot) {
        const ahead = hallway.slice(hallSpot + 1, homeSpot);
        if (ahead.every((spot) => spot === false || spot === null)) {
          // The way forward is clear. This pod can go home.
          allClear = true;
        }
      } else {
        const behind = hallway.slice(homeSpot, hallSpot);
        if (behind.every((spot) => spot === false || spot === null)) {
          // The way back is clear. This pod can go home.
          allClear = true;
        }
      }

      if (allClear) {
        // Where in the room the pod will end up
        const roomIndex =
          rooms[pod].filter((spot) => spot === false).length - 1;

        const newHallway = [...hallway];
        const newRooms = JSON.parse(JSON.stringify(rooms));

        newHallway[hallSpot] = false;
        newRooms[pod][roomIndex] = pod;

        const newCost =
          (Math.abs(hallSpot - homeSpot) +
            rooms[pod].filter((t) => t === false).length) *
          10 ** pod;

        play({
          cost: cost + newCost,
          hallway: newHallway,
          rooms: newRooms,
        });
      }
    }
  }

  // Otherwise, all the pods at the tops of their rooms can try all of the
  // available hall spots that they can get to.
  for (let room = 0; room < rooms.length; room++) {
    // If all of the creatures in this room live here, we can skip this room
    if (rooms[room].every((t) => t === room || t === false)) {
      continue;
    }

    const depth = rooms[room].filter((t) => t === false).length;
    const podIdx = room * 2 + 2;

    if (depth === rooms[0].length) {
      // This room is empty, so no pods can move out of it.
      continue;
    }

    const tryHallSpot = (hallSpot) => {
      const newHallway = [...hallway];
      const newRooms = JSON.parse(JSON.stringify(rooms));

      newHallway[hallSpot] = rooms[room][depth];
      newRooms[room][depth] = false;

      const newCost =
        (depth + 1 + Math.abs(podIdx - hallSpot)) * 10 ** rooms[room][depth];

      play({ cost: cost + newCost, hallway: newHallway, rooms: newRooms });
    };

    for (let hallSpot = podIdx - 1; hallSpot >= 0; hallSpot -= 1) {
      if (hallway[hallSpot] === null) {
        // Unoccupiable
        continue;
      }
      if (hallway[hallSpot] !== false) {
        // Occupied. The pod can't go here, and it can't go beyond this
        // spot, either.
        break;
      }

      tryHallSpot(hallSpot);
    }

    for (
      let hallSpot = podIdx + 1;
      hallSpot < hallway.length;
      hallSpot += 1
    ) {
      if (hallway[hallSpot] === null) {
        // Unoccupiable
        continue;
      }
      if (hallway[hallSpot] !== false) {
        // Occupied. The pod can't go here, and it can't go beyond this spot, either.
        break;
      }

      tryHallSpot(hallSpot);
    }
  }
};

const input = fs.readFileSync('./src/inputs/23.txt', 'UTF-8');

const p1 = () => {
  const state = { cost: 0, ...parse(input) };
  play(state, true);

  return minimumCost;
};

const p2 = () => {
  const state = { cost: 0, ...parse(input) };

  state.rooms[0] = [state.rooms[0][0], 3, 3, state.rooms[0][1]];
  state.rooms[1] = [state.rooms[1][0], 2, 1, state.rooms[1][1]];
  state.rooms[2] = [state.rooms[2][0], 1, 0, state.rooms[2][1]];
  state.rooms[3] = [state.rooms[3][0], 0, 2, state.rooms[3][1]];

  play(state, true);

  return minimumCost;
};

console.log('Part one:', p1());
console.log('Part two:', p2());