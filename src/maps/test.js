export default {
	id: "test",
	width: 10,
	height: 10,
	units: [
		[ "Arthur", "soldier", "player", { x: 1, y: 3 },
		  { hp: 11, atk: 7, hit: 7, def: 3, spd: 5, res: 2, element: "holy" } ],
		[ "Lance",  "knight",  "player", { x: 2, y: 6 },
		  { hp: 13, atk: 7, hit: 8, def: 6, spd: 2, res: 1, element: "dark" } ],
		[ "Merlin", "mage",    "player", { x: 3, y: 4 },
		  { hp:  7, atk: 8, hit: 7, def: 2, spd: 3, res: 4, element: "ice" } ],
		[ "Percy",  "fighter", "player", { x: 5, y: 5 },
		  { hp: 14, atk: 8, hit: 7, def: 2, spd: 5, res: 2, element: "volt" } ],
		[ "Gilda",  "fighter", "enemy",  { x: 5, y: 7 },
		  { hp: 15, atk: 9, hit: 6, def: 3, spd: 4, res: 0, element: "fire" } ],
		[ "Kidd",   "thief",   "enemy",  { x: 6, y: 2 },
		  { hp:  8, atk: 5, hit: 8, def: 2, spd: 6, res: 6, element: "dark" } ],
		[ "Isa",    "archer",  "enemy",  { x: 8, y: 8 },
		  { hp:  9, atk: 8, hit: 9, def: 3, spd: 5, res: 1, element: "volt" } ],
		[ "Napi",   "mage",    "enemy",  { x: 7, y: 1 },
		  { hp:  9, atk: 7, hit: 7, def: 5, spd: 3, res: 6, element: "plant" } ],
	]
}
