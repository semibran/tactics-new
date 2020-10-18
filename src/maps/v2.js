const chorizo = [ "Chorizo", "soldier", { faction: "player" },
	{ hp: 11, atk: 6, hit: 9, def: 3, spd: 5, res: 4, element: "plant" } ]

const gemma = [ "Gemma", "mage", { faction: "player" },
	{ hp: 7, atk: 7, hit: 8, def: 2, spd: 4, res: 6, element: "fire" } ]

const orc1 = [ "Orc", "fighter", { faction: "enemy", ai: "attack" },
	{ hp: 10, atk: 7, hit: 6, def: 1, spd: 4, res: 2, element: "volt" } ]

const goblin1 = [ "Goblin", "thief", { faction: "enemy", ai: "wait" },
	{ hp: 6, atk: 5, hit: 6, def: 2, spd: 7, res: 5, element: "dark" } ]

const irving = [ "Irving", "fighter", { faction: "ally", ai: "wait", convert: goblin1 },
	{ hp: 14, atk: 7, hit: 6, def: 2, spd: 3, res: 0, element: "volt" } ]

const troll1 = [ "Troll", "knight", { faction: "enemy", ai: "attack" },
	{ hp: 11, atk: 7, hit: 6, def: 5, spd: 2, res: 3, element: "fire" } ]

const kobold = [ "Kobold", "archer", { faction: "enemy", ai: "attack" },
	{ hp: 9, atk: 6, hit: 6, def: 2, spd: 4, res: 1, element: "dark" } ]

const troll2 = [ "Troll", "knight", { faction: "enemy", ai: "wait" },
{ hp: 14, atk: 7, hit: 8, def: 6, spd: 0, res: 3, element: "dark" } ]

const eileen = [ "Eileen", "thief", { faction: "ally", ai: "wait", convert: troll2 },
	{ hp: 9, atk: 5, hit: 8, def: 1, spd: 7, res: 6, element: "ice" } ]

const orc2 = [ "Orc", "fighter", { faction: "enemy", ai: "guard" },
	{ hp: 12, atk: 7, hit: 5, def: 1, spd: 4, res: 2, element: "dark" } ]

const orc3 = [ "Orc", "fighter", { faction: "enemy", ai: "attack" },
	{ hp: 11, atk: 8, hit: 4, def: 0, spd: 5, res: 1, element: "dark" } ]

const skeleton = [ "Skeleton", "soldier", { faction: "enemy", ai: "guard" },
	{ hp: 13, atk: 7, hit: 6, def: 2, spd: 4, res: 1, element: "dark" } ]

const goblin2 = [ "Goblin", "thief", { faction: "enemy", ai: "guard" },
	{ hp: 9, atk: 3, hit: 8, def: 2, spd: 7, res: 3, element: "dark" } ]

const golem = [ "Golem", "knight", { faction: "enemy", ai: "guard" },
	{ hp: 15, atk: 8, hit: 8, def: 8, spd: 1, res: 5, element: "dark" } ]

const lagan = [ "Lagan", "fighter", { faction: "enemy", ai: "guard" },
	{ hp: 15, atk: 9, hit: 5, def: 3, spd: 4, res: 4, element: "dark" } ]

const shiva = [ "Shiva", "mage", { faction: "enemy", ai: "wait" },
	{ hp: 15, atk: 9, hit: 9, def: 4, spd: 4, res: 6, element: "dark" } ]

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
		"####     ###   #",
		"####     ##    #",
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
		[ ...goblin1,  { x:  5, y: 14 } ],
		[ ...irving,   { x:  3, y: 13 } ],
		[ ...kobold,   { x:  7, y:  8 } ],
		[ ...troll2,   { x: 11, y:  8 } ],
		[ ...eileen,   { x: 12, y:  7 } ],
		[ ...orc2,     { x: 13, y: 13 } ],
		[ ...orc3,     { x:  3, y:  1 } ],
		[ ...skeleton, { x:  6, y:  5 } ],
		[ ...goblin2,  { x:  4, y:  6 } ],
		[ ...golem,    { x:  8, y:  0 } ],
		[ ...lagan,    { x:  7, y:  2 } ],
		[ ...shiva,    { x:  6, y:  1 } ],
	]
}
