import srcmap from "../../dist/tmp/sprites.json"
import extract from "../../lib/img-extract"
import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import * as pixels from "../../lib/pixels"
import disasmPalette from "./palette"
import stroke from "./stroke"
import fonts from "../fonts"
import Font from "./font"

export default function normalize(spritesheet) {
	let images = disasm(spritesheet, srcmap)
	let palette = disasmPalette(images.palette)
	let icons = disasmIcons(images)
	return {
		icons, palette,
		badges: disasmBadges(palette, icons),
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

function disasmIcons(images) {
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

function disasmBadges(palette, icons) {
	let badges = {}
	for (let faction in palette.factions) {
		let subpal = palette.factions[faction]
		let badge = Canvas.create(5, 5)
		badge.fillStyle = rgb(...palette.jet)
		badge.fillRect(1, 0, 3, 5)
		badge.fillRect(0, 1, 5, 3)
		badge.fillStyle = rgb(...subpal.normal)
		badge.fillRect(1, 1, 3, 3)
		badge.fillStyle = rgb(...subpal.light)
		badge.fillRect(2, 1, 2, 2)
		badges[faction] = badge.canvas
	}

	let base = Canvas.create(10, 10)
	base.fillStyle = rgb(...palette.jet)
	base.fillRect(1, 0, 8, 10)
	base.fillRect(0, 1, 10, 8)
	base.fillStyle = rgb(...palette.gray)
	base.fillRect(1, 1, 8, 8)
	badges.base = base.canvas

	for (let iconname in icons.types) {
		let unittype = icons.types[iconname]
		let icon = stroke(icons[iconname], palette.jet)
		let badge = Canvas.copy(base.canvas)
		badge.drawImage(icon, 0, 0)
		badges[unittype] = badge.canvas
	}

	return badges
}

function disasmSelect(image, palette) {
	let select = {}
	for (let faction in palette.factions) {
		let subpal = palette.factions[faction]
		let sprite = image
			.getContext("2d")
			.getImageData(0, 0, image.width, image.height)
		pixels.replace(sprite, palette.white, subpal.light)

		let ring = Canvas.create(image.width, image.height + 1)
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
		for (let iconname in icons.types) {
			let unittype = icons.types[iconname]
			let icon = icons.small[iconname]
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

		let piece = Canvas.create(base.width, base.height)
		piece.putImageData(sprite, 0, 0)

		let tmp = Canvas.create(8, 8)
		let template = icon.getContext("2d")
			.getImageData(0, 0, icon.width, icon.height)

		pixels.replace(template, palette.white, colors.light)
		tmp.putImageData(template, 0, 0)
		piece.drawImage(tmp.canvas, 5, 5)

		tmp = Canvas.create(8, 8)
		template = icon.getContext("2d")
			.getImageData(0, 0, icon.width, icon.height)

		pixels.replace(template, palette.white, colors.dark)
		tmp.putImageData(template, 0, 0)
		piece.drawImage(tmp.canvas, 5, 4)

		return piece.canvas
	}
}