import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import earlyExit from "../helpers/early-exit"
import renderBox from "../view/render-box"
import renderText from "../view/render-text"
import lerp from "lerp"

const enterDuration = 15
const exitDuration = 7
const margin = 2
const padx = 7
const pady = 9

export function create(content, sprites) {
	return {
		id: "Log",
		content: content,
		anim: EaseOut.create(enterDuration),
		pos: {
			page: 0, row: 0, col: 0,
			x: 0, y: 0,
			done: false
		},
		box: null,
		image: null,
		exit: false
	}
}

export function exit(log) {
	let src = log.anim ? log.anim.x : 1
	let duration = log.anim
		? earlyExit(exitDuration, log.anim.x)
		: exitDuration
	log.anim = EaseLinear.create(duration, src, 0)
	log.exit = true
}

export function onupdate() {

}

export function render(log, screen) {
	let viewport = screen.view.viewport
	let sprites = screen.view.sprites
	let palette = sprites.palette
	let fonts = sprites.fonts
	let font = fonts.standard
	if (!log.box) {
		let width = viewport.width - margin * 2
		let height = 40
		log.box = renderBox(width, height, sprites)
	}

	let box = log.box.getContext("2d")
	let page = log.content[log.pos.page]
	let line = page[log.pos.row]
	let char = line[log.pos.col]
	if (!log.pos.done) {
		if (log.pos.col === line.length) {
			if (log.pos.row + 1 === page.length) {
				log.pos.done = true
			} else {
				log.pos.row++
				log.pos.col = 0
				log.pos.y += font.data.charsize.height + font.data.spacing.line
				log.pos.x = 0
			}
		} else {
			log.pos.col++
		}
	}

	if (!log.pos.done && char) {
		let glyph = renderText(char, {
			font: font,
			color: palette.jet,
			shadow: palette.taupe
		})
		box.drawImage(glyph, log.pos.x + padx, log.pos.y + pady)
		log.pos.x += glyph.width + font.data.spacing.char - 1
	}

	let anim = log.anim
	let image = log.box
	const start = viewport.height + image.height
	const goal = viewport.height - margin + 1

	let x = margin - 1
	let y = anim ? lerp(start, goal, anim.x) : goal
	return [ {
		layer: "ui",
		origin: "bottomleft",
		image, x, y
	} ]
}
