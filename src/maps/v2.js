const vienna = [ "Vienna", "thief", { faction: "player" },
	{ hp: 8, atk: 6, hit: 8, def: 0, spd: 7, res: 6, element: "volt" } ]

const chorizo = [ "Chorizo", "knight", { faction: "player" },
	{ hp: 13, atk: 6, hit: 8, def: 7, spd: 2, res: 1, element: "ice" } ]

const pepper = [ "Pepper", "archer", { faction: "player" },
	{ hp: 9, atk: 5, hit: 8, def: 1, spd: 8, res: 2, element: "plant" } ]

const frankie = [ "Frankie", "soldier", { faction: "player" },
	{ hp: 12, atk: 8, hit: 6, def: 1, spd: 4, res: 4, element: "fire" } ]

const flotsam = [ "Flotsam", "mage", { faction: "enemy" },
	{ hp: 7, atk: 7, hit: 8, def: 2, spd: 4, res: 5, element: "volt" } ]

const jetsam = [ "Jetsam", "thief", { faction: "enemy" },
	{ hp: 9, atk: 6, hit: 8, def: 1, spd: 7, res: 3, element: "dark" } ]

const lagan = [ "Lagan", "fighter", { faction: "enemy" },
	{ hp: 15, atk: 9, hit: 4, def: 1, spd: 5, res: 0, element: "fire" } ]

const derelict = [ "Derelict", "archer", { faction: "enemy" },
	{ hp: 10, atk: 7, hit: 8, def: 3, spd: 4, res: 1, element: "ice" } ]

export default {
	id: "test",
	width: 10,
	height: 10,
	layout: [
		"##     ###",
		"#       ##",
		"         #",
		"      ####",
		"        ##",
		"         #",
		"          ",
		"#         ",
		"#         ",
		"##       #",
	].join(""),
	units: [
		[ ...vienna,   { x: 7, y: 5 } ],
		[ ...chorizo,  { x: 5, y: 6 } ],
		[ ...pepper,   { x: 7, y: 7 } ],
		[ ...frankie,  { x: 4, y: 8 } ],
		[ ...flotsam,  { x: 4, y: 3 } ],
		[ ...jetsam,   { x: 2, y: 5 } ],
		[ ...lagan,    { x: 2, y: 2 } ],
		[ ...derelict, { x: 1, y: 4 } ]
	]
}
