// getCell(pos, map, camera) -> cell
// > gets the grid cell indicated by
// > a given real onscreen coord
export default function getCell(pos, map, camera) {
	// undo scaling
	let realpos = {
		x: pos.x / camera.zoom - camera.width / 2,
		y: pos.y / camera.zoom - camera.height / 2,
	}
	// relative to top left corner of map
	let cornerpos = {
		x: realpos.x + map.width * map.tilesize / 2 - camera.pos.x,
		y: realpos.y + map.height * map.tilesize / 2 - camera.pos.y,
	}
	// fix to tiles
	return {
		x: Math.floor(cornerpos.x / map.tilesize),
		y: Math.floor(cornerpos.y / map.tilesize)
	}
}
