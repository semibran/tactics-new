const vienna = [ "Vienna", "soldier", { faction: "player" },
	{ hp: 11, atk: 7, hit: 8, def: 8, spd: 4, res: 8, element: "fire" } ]

const chorizo = [ "Chorizo", "mage", { faction: "player" },
	{ hp: 9, atk: 6, hit: 6, def: 4, spd: 3, res: 4, element: "dark" } ]

const goblin = [ "Goblin", "thief", { faction: "enemy", ai: "wait" },
	{ hp: 8, atk: 4, hit: 4, def: 1, spd: 5, res: 3, element: "dark" } ]

const irving = [ "Irving", "fighter", { faction: "ally", ai: "wait", convert: goblin },
	{ hp: 14, atk: 8, hit: 5, def: 4, spd: 4, res: 4, element: "fire" } ]

export default {
	id: "test",
	width: 10,
	height: 10,
	layout: [
		"##  ######",
		"##   ## ##",
		"#    #   #",
		"#       ##",
		"     #####",
		"        ##",
		"         #",
		"#         ",
		"#         ",
		"##       #",
	].join(""),
	units: [
		[ ...vienna,  { x: 2, y: 2 } ],
		[ ...chorizo, { x: 3, y: 1 } ],
		[ ...goblin,  { x: 5, y: 3 } ],
		[ ...irving,  { x: 7, y: 2 } ],
	]
}
