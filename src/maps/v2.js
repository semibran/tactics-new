export default {
	id: "test",
	width: 10,
	height: 10,
	units: [
		[ "Vienna",   "thief",   "player", { x: 7, y: 5 },
			{ hp: 8,  atk: 5, hit: 7, def: 0, spd: 6, res: 6, element: "dark" } ],
		[ "Chorizo",  "knight",  "player", { x: 5, y: 6 },
			{ hp: 13, atk: 6, hit: 7, def: 7, spd: 1, res: 1, element: "ice" } ],
		[ "Pepper",   "archer",  "player", { x: 7, y: 7 },
			{ hp: 9,  atk: 7, hit: 8, def: 1, spd: 5, res: 2, element: "plant" } ],
		[ "Frankie",  "soldier", "player", { x: 4, y: 8 },
			{ hp: 13, atk: 8, hit: 6, def: 1, spd: 5, res: 4, element: "volt" } ],
		[ "Flotsam",  "mage",    "enemy",  { x: 4, y: 3 },
			{ hp: 7,  atk: 7, hit: 8, def: 1, spd: 4, res: 5, element: "holy" } ],
		[ "Jetsam",   "thief",   "enemy",  { x: 2, y: 5 },
			{ hp: 9,  atk: 6, hit: 7, def: 1, spd: 6, res: 3, element: "volt" } ],
		[ "Lagan",    "fighter", "enemy",  { x: 2, y: 2 },
			{ hp: 15, atk: 9, hit: 5, def: 1, spd: 3, res: 0, element: "fire" } ],
		[ "Derelict", "archer",  "enemy",  { x: 1, y: 4 },
			{ hp: 10, atk: 6, hit: 7, def: 3, spd: 4, res: 1, element: "ice" } ],
	]
}
