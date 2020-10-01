import srcmap from "../dist/tmp/sprites.json"
import extract from "../lib/img-extract"

export default function normalize(spritesheet) {
	let sprites = disasm(spritesheet, srcmap)
	return sprites
}

function disasm(sheet, srcmap) {
	let sprites = {}
	for (let id in srcmap) {
		if (Array.isArray(srcmap[id])) {
			let [ x, y, w, h ] = srcmap[id]
			sprites[id] = extract(sheet, x, y, w, h)
		} else {
			sprites[id] = disasm(sheet, srcmap[id])
		}
	}
	return sprites
}
