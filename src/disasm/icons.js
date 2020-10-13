export default function disasmIcons(images) {
	let icons = {
		small: {},
		types: {
			axe: "fighter",
			bow: "archer",
			dagger: "thief",
			hat: "mage",
			shield: "knight",
			sword: "soldier"
		},
		fire: images["icon-fire"],
		ice: images["icon-ice"],
		volt: images["icon-volt"],
		plant: images["icon-plant"],
		holy: images["icon-holy"],
		dark: images["icon-dark"]
	}
	for (let name in icons.types) {
		let type = icons.types[name]
		icons.small[name] = images["icon6-" + name]
		icons.small[type] = images["icon6-" + name]
		icons[name] = images["icon8-" + name]
		icons[type] = images["icon8-" + name]
	}
	return icons
}
