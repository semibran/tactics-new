// TODO: Fix serif spacing issues

module.exports = {
	id: "serif",
	cellsize: { width: 12, height: 11 },
	charsize: { width:  8, height: 9 },
	exceptions: {
		A: { width: 9 },
		D: { width: 9 },
		H: { width: 9 },
		I: { width: 4 },
		J: { width: 5 },
		K: { width: 9 },
		M: { width: 10 },
		N: { width: 9 },
		Q: { width: 9, height: 11 },
		S: { width: 7 },
		U: { width: 9 },
		a: { width: 7 },
		b: { width: 7 },
		c: { width: 6 },
		d: { width: 7 },
		e: { width: 6 },
		f: { width: 5 },
		g: { width: 7, height: 11 },
		h: { width: 8 },
		i: { width: 4 },
		j: { width: 4, height: 11 },
		k: { width: 8 },
		l: { width: 4 },
		m: { width: 12 },
		n: { width: 8 },
		o: { width: 6 },
		p: { width: 7, height: 11 },
		q: { width: 7, height: 11 },
		r: { width: 7 },
		s: { width: 6 },
		t: { width: 5 },
		w: { width: 12 },
		x: { width: 7 },
		y: { width: 8, height: 11 },
		z: { width: 7 }
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
		"UVWXYZ    ",
		"abcdefghij",
		"klmnopqrst",
		"uvwxyz"
	]
}
