module.exports = {
	id: "standard-bold",
	cellsize: { width: 10, height: 9 },
	charsize: { width:  6, height: 7 },
	exceptions: {
		1: { width: 4 },
		I: { width: 4 },
		J: { width: 5 },
		M: { width: 7 },
		W: { width: 7 },
		f: { width: 5 },
		g: { height: 9 },
		i: { width: 2 },
		j: { width: 5 },
		l: { width: 2, x: 0 },
		m: { width: 10 },
		p: { height: 9 },
		q: { height: 9 },
		w: { width: 10 },
		y: { height: 9 },
		",": { width: 2, height: 8 },
		".": { width: 2 },
		"!": { width: 2 },
		"?": { width: 6 },
		"'": { width: 2 },
		"(": { width: 4 },
		")": { width: 4 },
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
