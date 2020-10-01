import srcmap from "../dist/tmp/sprites.json"
import extract from "../lib/img-extract"
import * as pixels from "../lib/pixels"
import matchPalette from "./palette"

export default function normalize(spritesheet) {
	let sprites = disasm(spritesheet, srcmap)
	let palette = matchPalette(sprites.palette)
	console.log(palette)
	return {
		piece: pieces(sprites.piece, palette)
	}
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

function pieces(sprite, palette) {
	let pieces = {}
	for (let faction in palette.pieces) {
		let subpal = palette.pieces[faction]
		let data = pixels.fromImage(sprite)
		pixels.replace(data, palette.white, subpal.normal)
		pixels.replace(data, palette.black, subpal.dark)
		pieces[faction] = pixels.toImage(data)
	}
	return pieces
}
