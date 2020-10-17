export default function getWeapon(type) {
	return weapons[typeWeapons[type]]
}

const sword = { type: "sword", stat: "str", atk: 2, hit: 0,
	rng: { start: 1, end: 1 }, pierce: true }

const lance = { type: "lance", stat: "str", atk: 1, hit: 1,
	rng: { start: 1, end: 1 }, pierce:  true }

const axe = { type: "axe", stat: "str", atk: 2, hit: -2,
	rng: { start: 1, end: 1 }, pierce:  true }

const dagger = { type: "dagger", stat: "str", atk: 1, hit: 0,
	rng: { start: 1, end: 1 }, pierce: false }

const bow = { type: "bow", stat: "str", atk: 1, hit: 2,
	rng: { start: 2, end: 2 }, pierce: false }

const tome = { type: "tome", stat: "mag", atk: 1, hit: 0,
	rng: { start: 1, end: 2 }, pierce: false }

const weapons = { sword, axe, lance, dagger, bow, tome }

const typeWeapons = {
	soldier: "sword",
	fighter: "axe",
	knight: "lance",
	thief: "dagger",
	archer: "bow",
	mage: "tome"
}
