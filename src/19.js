import fs from 'fs';

const TRANSFORMATIONS = [
	p => [ p[0], p[1], p[2] ],
	p => [ p[0], p[2], p[1] ],
	p => [ p[1], p[0], p[2] ],
	p => [ p[1], p[2], p[0] ],
	p => [ p[2], p[0], p[1] ],
	p => [ p[2], p[1], p[0] ],

	p => [ -p[0], p[1], p[2] ],
	p => [ -p[0], p[2], p[1] ],
	p => [ -p[1], p[0], p[2] ],
	p => [ -p[1], p[2], p[0] ],
	p => [ -p[2], p[0], p[1] ],
	p => [ -p[2], p[1], p[0] ],

	p => [ p[0], -p[1], p[2] ],
	p => [ p[0], -p[2], p[1] ],
	p => [ p[1], -p[0], p[2] ],
	p => [ p[1], -p[2], p[0] ],
	p => [ p[2], -p[0], p[1] ],
	p => [ p[2], -p[1], p[0] ],

	p => [ p[0], p[1], -p[2] ],
	p => [ p[0], p[2], -p[1] ],
	p => [ p[1], p[0], -p[2] ],
	p => [ p[1], p[2], -p[0] ],
	p => [ p[2], p[0], -p[1] ],
	p => [ p[2], p[1], -p[0] ],

	p => [ -p[0], -p[1], p[2] ],
	p => [ -p[0], -p[2], p[1] ],
	p => [ -p[1], -p[0], p[2] ],
	p => [ -p[1], -p[2], p[0] ],
	p => [ -p[2], -p[0], p[1] ],
	p => [ -p[2], -p[1], p[0] ],

	p => [ p[0], -p[1], -p[2] ],
	p => [ p[0], -p[2], -p[1] ],
	p => [ p[1], -p[0], -p[2] ],
	p => [ p[1], -p[2], -p[0] ],
	p => [ p[2], -p[0], -p[1] ],
	p => [ p[2], -p[1], -p[0] ],

	p => [ -p[0], p[1], -p[2] ],
	p => [ -p[0], p[2], -p[1] ],
	p => [ -p[1], p[0], -p[2] ],
	p => [ -p[1], p[2], -p[0] ],
	p => [ -p[2], p[0], -p[1] ],
	p => [ -p[2], p[1], -p[0] ],

	p => [ -p[0], -p[1], -p[2] ],
	p => [ -p[0], -p[2], -p[1] ],
	p => [ -p[1], -p[0], -p[2] ],
	p => [ -p[1], -p[2], -p[0] ],
	p => [ -p[2], -p[0], -p[1] ],
	p => [ -p[2], -p[1], -p[0] ]
];

const pyt = (p1, p2) => {
	let d = 0;

	for (let i = 0; i < p1.length; i++) {
		d += Math.pow(p2[i] - p1[i], 2);
	}

	return d;
};

const fnOverlap = (indexPos, indexMap, i, j) =>
	indexMap[i].map((absDistances, absIndex) => {
		let relIndex;

		indexMap[j].forEach((e, i) => {
			if (absDistances.filter(v => e.find(w => v.d === w.d)).length >= 11) {
				relIndex = i;
			}
		});

		if (relIndex === undefined) return undefined;

		return ({
			absolutePoint: indexPos[i][absIndex],
			relativePoint: indexPos[j][relIndex],
		});
	}).filter(m => m);

const offsetPoint = (p, o) => [ p[0] + o[0], p[1] + o[1], p[2] + o[2] ];

const arrayEquals = (arr1, arr2) => {
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}
	return true;
}

export function execute(input) {
	const points = input.split('\n\n').map(i => i.split('\n').slice(1).map(v => v.split(',').map(v => parseInt(v))));
	const dist = [];

	points.forEach((i, s) => i.forEach((from, indexFrom) => i.filter(to => to !== from).forEach((to, indexTo) => {
		if (!dist[s]) dist[s] = [];
		if (!dist[s][indexFrom]) dist[s][indexFrom] = [];
		dist[s][indexFrom].push({ d: pyt(from, to), to: indexTo });
	})));

	const trans = [ 0 ];
	const offsets = [ [0,0,0] ];
	const beacons = {};

	while (trans.length < points.length) {
		trans.push(trans.shift());
		const m = trans[0];

		for (let n = 0; n < points.length; n++) {
			if (n !== m && !trans.includes(n)) {
				const overlap = fnOverlap(points, dist, m, n);
				if (overlap.length > 0) {
					overlap.forEach(p => {
						TRANSFORMATIONS.forEach((t) => {
							if (trans.includes(n)) return;

							const offset = offsetPoint(p.absolutePoint, t(p.relativePoint).map(c => -c));
							if (overlap.filter(o => arrayEquals(offsetPoint(t(o.relativePoint), offset), o.absolutePoint)).length === overlap.length) {
								trans.push(n);
								points[n] = points[n].map(i => offsetPoint(t(i), offset));
								offsets.push(offset);
							}
						});
					});
				}
			}
		}
	}

	points.forEach((s, d) => s.forEach(p => beacons[p] = true));
	console.log('Part one:', Object.keys(beacons).length);
	console.log('Part two:', Math.max(...offsets.flatMap((o, i) => offsets.slice(i + 1).map(u => Math.abs(u[0] - o[0]) + Math.abs(u[1] - o[1]) + Math.abs(u[2] - o[2])))));
}

const input = fs.readFileSync('./src/inputs/19.txt').toString().trim();
execute(input);