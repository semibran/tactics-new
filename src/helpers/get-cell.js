// getCell(pos, map, camera) -> cell
// > gets the grid cell indicated by
// > a given real onscreen coord
export default function getCell(pos, map, camera) {
	// undo scaling
	let realpos = {
		x: (pos.x - camera.width / 2) / camera.zoom,
		y: (pos.y - camera.height / 2) / camera.zoom,
	}
	// relative to top left corner of map
	let gridpos = {
		x: realpos.x + map.width * map.tilesize / 2 - camera.pos.x,
		y: realpos.y + map.height * map.tilesize / 2 - camera.pos.y,
	}
	// fix to tiles
	return {
		x: Math.floor(gridpos.x / map.tilesize),
		y: Math.floor(gridpos.y / map.tilesize)
	}
}
