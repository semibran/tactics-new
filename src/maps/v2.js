const vienna = [ "thief" ]

export default {
	id: "test",
	width: 10,
	height: 10,
	units: [
		[ "Vienna", "thief", "player",
			{ hp: 8,  atk: 5, hit: 8, def: 0, spd: 7, res: 6, element: "volt" },
			{ x: 7, y: 5 } ],
		[ "Chorizo", "knight", "player",
			{ hp: 13, atk: 6, hit: 7, def: 7, spd: 2, res: 1, element: "ice" },
			{ x: 5, y: 6 } ],
		[ "Pepper", "archer", "player",
			{ hp: 9,  atk: 5, hit: 8, def: 1, spd: 7, res: 2, element: "plant" },
			{ x: 7, y: 7 } ],
		[ "Frankie", "soldier", "player",
			{ hp: 12, atk: 8, hit: 6, def: 1, spd: 4, res: 4, element: "fire" },
			{ x: 4, y: 8 } ],
		[ "Flotsam", "mage", "enemy",
			{ hp: 7,  atk: 7, hit: 8, def: 2, spd: 4, res: 5, element: "volt" },
			{ x: 4, y: 3 } ],
		[ "Jetsam", "thief", "enemy",
			{ hp: 9,  atk: 6, hit: 8, def: 1, spd: 7, res: 3, element: "dark" },
			{ x: 2, y: 5 } ],
		[ "Lagan", "fighter", "enemy",
			{ hp: 15, atk: 9, hit: 4, def: 1, spd: 5, res: 0, element: "fire" },
			{ x: 2, y: 2 } ],
		[ "Derelict", "archer", "enemy",
			{ hp: 10, atk: 7, hit: 8, def: 3, spd: 4, res: 1, element: "ice" },
			{ x: 1, y: 4 } ],
	]
}
