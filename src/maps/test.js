export default {
	id: "test",
	width: 9,
	height: 9,
	units: [
		[ "Arthur", "soldier", "enemy",  { x: 1, y: 4 },
		  { hp: 12, atk: 8, hit: 7, def: 3, spd: 5, element: "holy" } ],
		[ "Percy",  "knight",  "enemy",  { x: 3, y: 3 },
		  { hp: 14, atk: 7, hit: 8, def: 6, spd: 2, element: "plant" } ],
		[ "Merlin", "mage",    "enemy",  { x: 2, y: 6 },
		  { hp:  7, atk: 8, hit: 7, def: 2, spd: 3, element: "ice" } ],
		[ "Gilda",  "fighter", "player", { x: 5, y: 5 },
		  { hp: 15, atk: 9, hit: 6, def: 3, spd: 4, element: "fire" } ],
		[ "Kidd",   "thief",   "player", { x: 6, y: 2 },
		  { hp:  8, atk: 5, hit: 8, def: 2, spd: 7, element: "dark" } ],
		[ "Napi",   "archer",  "player", { x: 4, y: 1 },
		  { hp:  9, atk: 8, hit: 9, def: 3, spd: 5, element: "volt" } ],
	]
}
