const chorizo = [ "Chorizo", "soldier", { faction: "player" },
	{ hp: 11, atk: 7, hit: 8, def: 3, spd: 4, res: 8, element: "fire" } ]

const gemma = [ "Gemma", "mage", { faction: "player" },
	{ hp: 7, atk: 6, hit: 7, def: 2, spd: 3, res: 4, element: "ice" } ]

const orc1 = [ "Orc", "fighter", { faction: "enemy", ai: "attack" },
	{ hp: 10, atk: 7, hit: 5, def: 1, spd: 4, res: 2, element: "dark" } ]

const goblin = [ "Goblin", "thief", { faction: "enemy", ai: "wait" },
	{ hp: 6, atk: 5, hit: 5, def: 2, spd: 6, res: 3, element: "dark" } ]

const irving = [ "Irving", "fighter", { faction: "ally", ai: "wait", convert: goblin },
	{ hp: 14, atk: 8, hit: 5, def: 2, spd: 4, res: 4, element: "fire" } ]

const troll1 = [ "Troll", "knight", { faction: "enemy", ai: "attack" },
	{ hp: 12, atk: 7, hit: 6, def: 5, spd: 1, res: 1, element: "dark" } ]

const kobold = [ "Kobold", "archer", { faction: "enemy", ai: "attack" },
	{ hp: 9, atk: 6, hit: 6, def: 2, spd: 4, res: 1, element: "dark" } ]

const troll2 = [ "Troll", "knight", { faction: "enemy", ai: "wait" },
{ hp: 13, atk: 7, hit: 7, def: 6, spd: 1, res: 1, element: "dark" } ]

const eileen = [ "Eileen", "thief", { faction: "ally", ai: "wait", convert: troll2 },
	{ hp: 8, atk: 5, hit: 8, def: 1, spd: 7, res: 5, element: "volt" } ]

const lagan = [ "Lagan", "fighter", { faction: "enemy", ai: "guard" },
	{ hp: 15, atk: 9, hit: 5, def: 2, spd: 4, res: 1, element: "dark" } ]

const shiva = [ "Shiva", "mage", { faction: "enemy", ai: "wait" },
	{ hp: 13, atk: 8, hit: 8, def: 3, spd: 2, res: 5, element: "dark" } ]

const orc2 = [ "Orc", "fighter", { faction: "enemy", ai: "attack" },
	{ hp: 11, atk: 8, hit: 4, def: 1, spd: 4, res: 2, element: "dark" } ]

const skeleton = [ "Skeleton", "soldier", { faction: "enemy", ai: "guard" },
	{ hp: 12, atk: 7, hit: 5, def: 3, spd: 4, res: 1, element: "dark" } ]

export default {
	id: "test",
	width: 16,
	height: 24,
	layout: [
		"###        #####",
		"###        #####",
		"##        ######",
		"##        ######",
		"####     #######",
		"#####    ###   #",
		"#####    ##    #",
		"#####    ##   ##",
		"#####     # ####",
		"######      ####",
		"#######       ##",
		"##########     #",
		"###  ######     ",
		"##   ######     ",
		"##      ##     #",
		"##  ##         #",
		"######        ##",
		"#####       ####",
		"####        ####",
		"####       #####",
		"####       #####",
		"###       ######",
		"###       ######",
		"##        ######",
	].join(""),
	units: [
		[ ...chorizo,  { x:  5, y: 21 } ],
		[ ...gemma,    { x:  7, y: 22 } ],
		[ ...orc1,     { x:  8, y: 18 } ],
		[ ...troll1,   { x: 12, y: 11 } ],
		[ ...goblin,   { x:  5, y: 14 } ],
		[ ...irving,   { x:  3, y: 13 } ],
		[ ...kobold,   { x:  7, y:  8 } ],
		[ ...troll2,   { x: 11, y:  8 } ],
		[ ...eileen,   { x: 12, y:  7 } ],
		[ ...orc2,     { x:  3, y:  1 } ],
		[ ...skeleton, { x:  5, y:  6 } ],
		[ ...lagan,    { x:  7, y:  3 } ],
		[ ...shiva,    { x:  6, y:  1 } ],
	]
}
