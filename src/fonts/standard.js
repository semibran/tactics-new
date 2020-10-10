module.exports = {
	id: "standard",
	cellsize: { width: 7, height: 9 },
	charsize: { width: 5, height: 7 },
	exceptions: {
		1: { width: 3 },
		I: { width: 3 },
		f: { width: 5 },
		g: { height: 9 },
		i: { width: 1 },
		j: { width: 2, height: 8 },
		l: { width: 1, x: 0 },
		m: { width: 7 },
		p: { height: 9 },
		q: { height: 9 },
		r: { width: 4 },
		t: { width: 4 },
		w: { width: 9 },
		y: { height: 9 },
		",": { width: 1, height: 8 },
		".": { width: 1 },
		"!": { width: 1 },
		"'": { width: 1 },
		"(": { width: 3 },
		")": { width: 3 },
	},
	spacing: {
		char: 1,
		word: 4,
		line: 5
	},
	layout: [
		"0123456789",
		"ABCDEFGHIJ",
		"KLMNOPQRST",
		"UVWXYZ,.!?",
		"abcdefghij",
		"klmnopqrst",
		"uvwxyz'()"
	]
}
