module.exports = {
	id: "smallcaps",
	cellsize: { width: 5, height: 5 },
	charsize: { width: 5, height: 5 },
	exceptions: {
		",": { width: 1 },
		".": { width: 1 },
		"!": { width: 1 }
	},
	spacing: {
		char: 1,
		word: 3,
		line: 2
	},
	layout: [
		"0123456789",
		"ABCDEFGHIJ",
		"KLMNOPQRST",
		"UVWXYZ,.!?"
	]
}
