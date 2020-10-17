import * as pixels from "../../lib/pixels"

const matrix = [
	[ "white",  "opal",   "pink",   "lime",  "opalhp", "redhp"    ],
	[ "black",  "blue",   "red",    "green", null,     "orangehp" ],
	[ "silver", "navy",   "purple", "teal",  "beige",  "yellowhp" ],
	[ "gray",   null,     "maroon", "moss",  "taupe",  "greenhp"  ],
	[ "coal",   null,     "yellow", "gold",  "brass",  "bluehp"   ],
	[ "jet",    null,      "cream",  "sage",  "brown",  "indigohp" ]
]

const mappings = {
	hp: {
		opal: "opal",
		red: "red",
		orange: "orangehp",
		yellow: "yellowhp",
		green: "greenhp",
		blue: "bluehp",
		indigo: "indigohp"
	},
	factions: {
		player: {
			light: "opal",
			normal: "blue",
			dark: "navy"
		},
		enemy: {
			light: "pink",
			normal: "red",
			dark: "purple"
		},
		ally: {
			light: "lime",
			normal: "green",
			dark: "teal"
		}
	}
}

export default function match(image) {
	let palette = {}
	let data = pixels.fromImage(image)
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			let colorname = matrix[y][x]
			if (!colorname) continue
			palette[colorname] = pixels.get(data, x, y)
		}
	}
	assign(palette, mappings)
	return palette

	function assign(obj, mappings) {
		for (let n in mappings) {
			if (typeof mappings[n] === "object") {
				obj[n] = {}
				assign(obj[n], mappings[n])
			} else {
				obj[n] = palette[mappings[n]]
			}
		}
	}
}
