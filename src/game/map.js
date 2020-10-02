export function init(data) {
	let map = {
		width: data.width,
		height: data.height,
		units: []
	}
	for (let unit of data.units) {
		map.units.push({
			type: unit.type,
			name: unit.name,
			faction: unit.faction,
			x: unit.position[0],
			y: unit.position[1]
		})
	}
	return map
}

export function contains(map, cell) {
	return cell.x >= 0 && cell.y >= 0
	    && cell.x < map.width
	    && cell.y < map.height
}

export function unitAt(map, cell) {
	if (!contains(map, cell)) return
	for (let unit of map.units) {
		if (unit.x === cell.x && unit.y === cell.y) {
			return unit
		}
	}
}
