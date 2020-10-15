export default {
	id: "test",
	width: 9,
	height: 9,
	units: [
		[ "Arthur", "soldier", "player", { x: 1, y: 4 },
		  { hp: 12, atk: 8, hit: 7, def: 3, spd: 5, element: "holy" } ],
		[ "Percy",  "knight",  "player", { x: 3, y: 3 },
		  { hp: 14, atk: 7, hit: 8, def: 6, spd: 2, element: "plant" } ],
		[ "Merlin", "mage",    "player", { x: 2, y: 6 },
		  { hp:  7, atk: 8, hit: 7, def: 2, spd: 3, element: "ice" } ],
		[ "Gilda",  "fighter", "enemy",  { x: 5, y: 5 },
		  { hp: 15, atk: 9, hit: 6, def: 3, spd: 4, element: "fire" } ],
		[ "Kidd",   "thief",   "enemy",  { x: 6, y: 2 },
		  { hp:  8, atk: 5, hit: 8, def: 2, spd: 6, element: "dark" } ],
		[ "Napi",   "archer",  "enemy",  { x: 4, y: 1 },
		  { hp:  9, atk: 8, hit: 9, def: 3, spd: 5, element: "volt" } ],
	]
}
