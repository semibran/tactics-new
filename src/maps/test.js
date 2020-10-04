export default {
	id: "test",
	width: 9,
	height: 9,
	units: [
		{ type: "soldier", name: "Arthur", faction: "enemy",  pos: [ 1, 4 ],
			stats: { hp: 11, atk: 13, def: 10, element: "holy" } },
		{ type: "knight",  name: "Percy",  faction: "enemy",  pos: [ 3, 3 ],
		  stats: { hp: 12, atk:  9, def: 11, element: "plant" } },
		{ type: "mage",    name: "Merlin", faction: "enemy",  pos: [ 2, 6 ],
		  stats: { hp:  7, atk: 11, def:  3, element: "ice" } },
		{ type: "fighter", name: "Gilda",  faction: "player", pos: [ 5, 5 ],
		  stats: { hp: 13, atk: 14, def:  7, element: "fire" } },
		{ type: "thief",   name: "Kid",    faction: "player", pos: [ 6, 2 ],
		  stats: { hp:  8, atk:  7, def:  5, element: "dark" } },
		{ type: "archer",  name: "Napi",   faction: "player", pos: [ 4, 1 ],
		  stats: { hp:  9, atk: 12, def:  9, element: "volt" } },
	]
}
