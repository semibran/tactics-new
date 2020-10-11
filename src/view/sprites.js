import srcmap from "../../dist/tmp/sprites.json"
import extract from "../../lib/img-extract"
import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import * as pixels from "../../lib/pixels"
import disasmPalette from "./palette"
import stroke from "./stroke"
import fonts from "../fonts"
import Font from "./font"
import renderArrow from "./arrow"

export default function normalize(spritesheet) {
	let images = disasm(spritesheet, srcmap)
	let palette = disasmPalette(images.palette)
	let icons = disasmIcons(images)
	let select = disasmSelect(images, palette)
	return {
		icons, palette, select,
		Arrow: (path, faction) =>
			renderArrow(select.arrows[faction], path),
		squares: disasmSquares(),
		badges: disasmBadges(palette, icons),
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

function disasmSquares() {
	const opacity = 0.25
	const tilesize = 16

	let move = Canvas.create(tilesize, tilesize)
	move.globalAlpha = opacity
	move.fillStyle = "blue"
	move.fillRect(0, 0, tilesize - 1, tilesize - 1)

	let attack = Canvas.create(tilesize, tilesize)
	attack.globalAlpha = opacity
	attack.fillStyle = "red"
	attack.fillRect(0, 0, tilesize - 1, tilesize - 1)

	return { move: move.canvas, attack: attack.canvas }
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
		let badge = Canvas.create(4, 4)
		badge.fillStyle = rgb(...palette.jet)
		badge.fillRect(1, 0, 2, 4)
		badge.fillRect(0, 1, 4, 2)
		badge.fillStyle = rgb(...subpal.normal)
		badge.fillRect(1, 1, 2, 2)
		badge.fillStyle = rgb(...subpal.light)
		badge.fillRect(2, 1, 1, 1)
		badges[faction] = badge.canvas
	}

	let base = Canvas.create(8, 8)
	base.fillStyle = rgb(...palette.jet)
	base.fillRect(1, 0, 6, 8)
	base.fillRect(0, 1, 8, 6)
	base.fillStyle = rgb(...palette.gray)
	base.fillRect(1, 1, 6, 6)
	badges.base = base.canvas

	for (let iconname in icons.types) {
		let unittype = icons.types[iconname]
		let icon = stroke(icons.small[iconname], palette.jet)
		let badge = Canvas.copy(base.canvas)
		badge.drawImage(icon, 0, 0)
		badges[unittype] = badge.canvas
	}

	return badges
}

function disasmSelect(images, palette) {
	let select = { glow: {}, ring: {}, cursor: {}, arrows: {} }
	for (let faction in palette.factions) {
		let subpal = palette.factions[faction]

		select.glow[faction] = images["select-glow"]

		let ringbase = images["select-ring"]
		let ringshadow = Canvas.replace(ringbase, palette.white, subpal.light)
		let ring = Canvas.create(ringbase.width, ringbase.height + 1)
		ring.drawImage(ringshadow, 0, 1)
		ring.drawImage(ringbase, 0, 0)
		select.ring[faction] = ring.canvas

		let cursorbase = images["select-cursor"]
		let cursorshadow = Canvas.replace(cursorbase, palette.white, subpal.light)
		let cursor = Canvas.create(cursorbase.width + 1, cursorbase.height + 1)
		cursor.drawImage(cursorshadow, 1, 1)
		cursor.drawImage(cursorbase, 0, 0)
		select.cursor[faction] = cursor.canvas

		select.arrows[faction] = disasmArrows(images, palette, faction)
	}
	return select
}

function disasmArrows(images, palette, faction) {
	let subpal = palette.factions[faction]
	let base = images["select-arrows"]
	let sheet = Canvas.replace(base, palette.black, subpal.light)
	return {
		left:      extract(sheet,  0,  0, 16, 16),
		right:     extract(sheet, 16,  0, 16, 16),
		up:        extract(sheet, 32,  0, 16, 16),
		down:      extract(sheet, 48,  0, 16, 16),
		leftStub:  extract(sheet,  0, 16, 16, 16),
		rightStub: extract(sheet, 16, 16, 16, 16),
		upStub:    extract(sheet, 32, 16, 16, 16),
		downStub:  extract(sheet, 48, 16, 16, 16),
		upleft:    extract(sheet,  0, 32, 16, 16),
		upright:   extract(sheet, 16, 32, 16, 16),
		downleft:  extract(sheet, 32, 32, 16, 16),
		downright: extract(sheet, 48, 32, 16, 16),
		leftright: extract(sheet,  0, 48, 16, 16),
		updown:    extract(sheet, 16, 48, 16, 16)
	}
}

function disasmPieces(base, icons, palette) {
	let pieces = {
		done: {},
		shadow: Canvas.recolor(base, [ 0, 0, 0, 191 ])
	}
	for (let faction in palette.factions) {
		pieces[faction] = {}
		pieces.done[faction] = {}
		let subpal = palette.factions[faction]
		for (let iconname in icons.types) {
			let unittype = icons.types[iconname]
			let icon = icons.small[iconname]
			let piece = Piece(base, icon, subpal)
			let done = Piece(base, icon, {
				light: subpal.normal,
				normal: subpal.dark,
				dark: palette.black
			})
			pieces[faction][unittype] = piece
			pieces.done[faction][unittype] = done
		}
	}

	return pieces

	function Piece(base, icon, colors) {
		let top = Canvas.recolor(base, colors.normal)
		let bottom = colors.dark !== palette.black
		 	? Canvas.recolor(base, colors.dark)
			: base

		let piece = Canvas.create(base.width, base.height + 2)
		piece.drawImage(bottom, 0, 2)
		piece.drawImage(top, 0, 0)

		let tmp = Canvas.create(8, 8)
		let template = icon.getContext("2d")
			.getImageData(0, 0, icon.width, icon.height)

		pixels.replace(template, palette.white, colors.light)
		tmp.putImageData(template, 0, 0)
		piece.drawImage(tmp.canvas, 4, 5)

		tmp = Canvas.create(8, 8)
		template = icon.getContext("2d")
			.getImageData(0, 0, icon.width, icon.height)

		pixels.replace(template, palette.white, colors.dark)
		tmp.putImageData(template, 0, 0)
		piece.drawImage(tmp.canvas, 4, 4)

		return piece.canvas
	}
}