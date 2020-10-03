module.exports = {
	id: "smallcaps-bold",
	cellsize: { width: 7, height: 5 },
	charsize: { width: 6, height: 5 },
	exceptions: {
		1: { width: 4 },
		M: { width: 7 },
		W: { width: 7 },
		",": { width: 2 },
		".": { width: 2 },
		"!": { width: 2 },
		"/": { width: 3 }
	},
	spacing: {
		char: 1,
		word: 4,
		line: 2
	},
	layout: [
		"0123456789",
		"ABCDEFGHIJ",
		"KLMNOPQRST",
		"UVWXYZ,.!/"
	]
}
