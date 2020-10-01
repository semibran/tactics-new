import srcmap from "../dist/tmp/sprites.json"
import extract from "../lib/img-extract"
import Canvas from "../lib/canvas"
import * as pixels from "../lib/pixels"
import * as iconnames from "./icons"
import matchPalette from "./palette"

export default function normalize(spritesheet) {
	let sprites = disasm(spritesheet, srcmap)
	let palette = matchPalette(sprites.palette)
	let icons = disasmIcons(sprites)
	let pieces = disasmPieces(sprites.piece, icons, palette)
	return { pieces }
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

function disasmPieces(base, icons, palette) {
	let pieces = {}
	for (let faction in palette.pieces) {
		pieces[faction] = {}
		let subpal = palette.pieces[faction]
		for (let unittype in iconnames.units) {
			let iconname = iconnames.units[unittype]
			let icon = icons[iconname]
			let piece = Piece(base, icon, subpal)
			pieces[faction][unittype] = piece
		}
	}

	return pieces

	function Piece(base, icon, colors) {
		let sprite = base
			.getContext("2d")
			.getImageData(0, 0, base.width, base.height)
		pixels.replace(sprite, palette.white, colors.normal)
		pixels.replace(sprite, palette.black, colors.dark)

		let piece = Canvas(base.width, base.height)
		piece.putImageData(sprite, 0, 0)

		let tmp = Canvas(8, 8)
		let template = icon.getContext("2d")
			.getImageData(0, 0, icon.width, icon.height)

		pixels.replace(template, palette.white, colors.light)
		tmp.putImageData(template, 0, 0)
		piece.drawImage(tmp.canvas, 5, 5)

		pixels.replace(template, colors.light, colors.dark)
		tmp.putImageData(template, 0, 0)
		piece.drawImage(tmp.canvas, 5, 4)

		return piece.canvas
	}
}

function disasmIcons(sprites) {
	return {
		axe: sprites["icon-axe"],
		bow: sprites["icon-bow"],
		dagger: sprites["icon-dagger"],
		hat: sprites["icon-hat"],
		shield: sprites["icon-shield"],
		sword: sprites["icon-sword"],
	}
}
