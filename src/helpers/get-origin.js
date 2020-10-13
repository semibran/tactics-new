// getOrigin(map, camera) -> pos
// > finds the top left corner of the map
// > relative to the given camera
export default function getOrigin(map, camera) {
	return {
		x: camera.width / 2 - map.width * map.tilesize / 2 + camera.pos.x,
		y: camera.height / 2 - map.height * map.tilesize / 2 + camera.pos.y
	}
}
