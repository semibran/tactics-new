import srcmap from "../../dist/tmp/sprites.json"
import extract from "../../lib/img-extract"
import Canvas from "../../lib/canvas"
import * as pixels from "../../lib/pixels"
import * as iconnames from "./icons"
import disasmPalette from "./palette"
import fonts from "../fonts"
import Font from "./font"

export default function normalize(spritesheet) {
	let images = disasm(spritesheet, srcmap)
	let palette = disasmPalette(images.palette)
	let icons = disasmIcons(images)
	return {
		icons,
		select: disasmSelect(images.select, palette),
		pieces: disasmPieces(images.piece, icons, palette),
		fonts: disasmFonts(images, fonts, palette)
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

function disasmFonts(images, fonts, palette) {
	let result = {}
	for (let fontname in fonts) {
		let font = fonts[fontname]
		let image = images["font-" + font.id]
		result[fontname] = Font(image, font, palette)
	}
	return result
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

function disasmSelect(image, palette) {
	let select = {}
	for (let faction in palette.factions) {
		let subpal = palette.factions[faction]
		let sprite = image
			.getContext("2d")
			.getImageData(0, 0, image.width, image.height)
		pixels.replace(sprite, palette.white, subpal.light)

		let ring = Canvas(image.width, image.height + 1)
		ring.putImageData(sprite, 0, 1)
		ring.drawImage(image, 0, 0)

		select[faction] = ring.canvas
	}
	return select
}

function disasmPieces(base, icons, palette) {
	let pieces = {}
	for (let faction in palette.factions) {
		pieces[faction] = {}
		let subpal = palette.factions[faction]
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

		tmp = Canvas(8, 8)
		template = icon.getContext("2d")
			.getImageData(0, 0, icon.width, icon.height)

		pixels.replace(template, palette.white, colors.dark)
		tmp.putImageData(template, 0, 0)
		piece.drawImage(tmp.canvas, 5, 4)

		return piece.canvas
	}
}
