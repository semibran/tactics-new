export default {
	id: "test",
	width: 9,
	height: 9,
	units: [
		[ "Arthur", "soldier", "enemy",  { x: 1, y: 4 },
		  { hp: 13, atk: 11, hit: 10, def:  6, spd:  7, element: "holy" } ],
		[ "Percy",  "knight",  "enemy",  { x: 3, y: 3 },
		  { hp: 12, atk: 10, hit: 12, def: 10, spd:  4, element: "plant" } ],
		[ "Merlin", "mage",    "enemy",  { x: 2, y: 6 },
		  { hp:  7, atk: 12, hit: 10, def:  4, spd:  6, element: "ice" } ],
		[ "Gilda",  "fighter", "player", { x: 5, y: 5 },
		  { hp: 15, atk: 14, hit:  7, def:  6, spd:  8, element: "fire" } ],
		[ "Kidd",   "thief",   "player", { x: 6, y: 2 },
		  { hp:  8, atk:  9, hit: 11, def:  5, spd: 11, element: "dark" } ],
		[ "Napi",   "archer",  "player", { x: 4, y: 1 },
		  { hp:  9, atk: 11, hit: 13, def:  6, spd:  8, element: "volt" } ],
	]
}
