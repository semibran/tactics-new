export default {
	id: "test",
	width: 8,
	height: 8,
	units: [
		{ type: "soldier", name: "Arthur", faction: "enemy",  pos: [ 1, 4 ],
		  hp: 11, atk: 13, def: 10, element: "holy" },
		{ type: "knight",  name: "Percy",  faction: "enemy",  pos: [ 3, 3 ],
		  hp: 12, atk:  9, def: 11, element: "fire" },
		{ type: "mage",    name: "Morgan", faction: "enemy",  pos: [ 2, 6 ],
		  hp:  7, atk: 11, def:  3, element: "dark" },
		{ type: "fighter", name: "Gilda",  faction: "player", pos: [ 5, 5 ],
		  hp: 13, atk: 14, def:  7, element: "volt" },
		{ type: "thief",   name: "Kid",    faction: "player", pos: [ 6, 2 ],
		  hp:  8, atk:  7, def:  5, element: "plant" },
		{ type: "archer",  name: "Napi",   faction: "player", pos: [ 4, 1 ],
		  hp:  9, atk: 12, def:  9, element: "ice" }
	]
}
