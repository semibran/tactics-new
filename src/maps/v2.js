const vienna = [ "Vienna", "soldier", { faction: "player" },
	{ hp: 11, atk: 7, hit: 8, def: 3, spd: 4, res: 8, element: "fire" } ]

const chorizo = [ "Chorizo", "mage", { faction: "player" },
	{ hp: 8, atk: 6, hit: 7, def: 2, spd: 3, res: 4, element: "dark" } ]

const orc = [ "Orc", "fighter", { faction: "enemy", ai: "attack" },
	{ hp: 10, atk: 7, hit: 5, def: 1, spd: 4, res: 2, element: "dark" } ]

const goblin = [ "Goblin", "thief", { faction: "enemy", ai: "wait" },
	{ hp: 7, atk: 5, hit: 5, def: 1, spd: 6, res: 3, element: "dark" } ]

const irving = [ "Irving", "fighter", { faction: "ally", ai: "wait", convert: goblin },
	{ hp: 14, atk: 8, hit: 5, def: 2, spd: 4, res: 4, element: "fire" } ]

const troll = [ "Troll", "knight", { faction: "enemy", ai: "attack" },
	{ hp: 13, atk: 7, hit: 6, def: 5, spd: 1, res: 2, element: "dark" } ]

export default {
	id: "test",
	width: 16,
	height: 24,
	layout: [
		"##  ############",
		"##   ## ########",
		"#    #   #######",
		"#       ########",
		"     #####      ",
		"                ",
		"                ",
		"#               ",
		"#####           ",
		"#######         ",
		"########        ",
		"##########      ",
		"###  ######     ",
		"##   ######    #",
		"##      ##     #",
		"##  ##        ##",
		"######       ###",
		"#####       ####",
		"####        ####",
		"####       #####",
		"####       #####",
		"###       ######",
		"###       ######",
		"##        ######",
	].join(""),
	units: [
		[ ...vienna,  { x:  5, y: 21 } ],
		[ ...chorizo, { x:  7, y: 22 } ],
		[ ...orc,     { x:  8, y: 18 } ],
		[ ...goblin,  { x:  5, y: 14 } ],
		[ ...irving,  { x:  3, y: 13 } ],
		[ ...troll,   { x: 11, y: 10 } ],
	]
}
