export default {
	id: "test",
	width: 9,
	height: 9,
	units: [
		[ "Arthur", "soldier", "enemy",  { x: 1, y: 4 },
		  { hp: 11, atk: 13, def: 10, element: "holy" } ],
		[ "Percy",  "knight",  "enemy",  { x: 3, y: 3 },
		  { hp: 12, atk:  9, def: 11, element: "plant" } ],
		[ "Merlin", "mage",    "enemy",  { x: 2, y: 6 },
		  { hp:  7, atk: 11, def:  3, element: "ice" } ],
		[ "Gilda",  "fighter", "player", { x: 5, y: 5 },
		  { hp: 13, atk: 14, def:  7, element: "fire" } ],
		[ "Kidd",   "thief",   "player", { x: 6, y: 2 },
		  { hp:  8, atk:  7, def:  5, element: "dark" } ],
		[ "Napi",   "archer",  "player", { x: 4, y: 1 },
		  { hp:  9, atk: 12, def:  9, element: "volt" } ],
	]
}
