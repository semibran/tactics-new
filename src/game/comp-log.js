import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import * as Canvas from "../../lib/canvas"
import earlyExit from "../helpers/early-exit"
import renderBox from "../view/render-box"
import renderText from "../view/render-text"
import lerp from "lerp"

const enterDuration = 15
const exitDuration = 7
const hangDuration = 180
const margin = 2
const padx = 8
const pady = 10

export function create() {
	return {
		id: "Log",
		messages: [],
		anim: EaseOut.create(enterDuration, { delay: 10 }),
		pos: {
			col: 0,
			row: 0,
			offset: 0
		},
		updated: false,
		box: null,
		surface: null,
		persist: true,
		blocking: false,
		exit: false,
		cache: [],
	}
}

export function exit(log) {
	let src = log.anim ? log.anim.x : 1
	let duration = log.anim
		? earlyExit(exitDuration, log.anim.x)
		: exitDuration
	log.anim = EaseLinear.create(duration, { src, dest: 0 })
	log.exit = true
}

export function append(log, message) {
	console.log(message)
	log.messages.push(message)
	if (log.updated) {
		log.pos.row++
		log.pos.col = 0
		log.updated = false
	}
}

export function onresize() {

}

export function onupdate(log, screen) {
	if (screen.time - log.time >= hangDuration && !log.exit) {
		exit(log)
	}
}

export function render(log, screen) {
	let nodes = []

	let viewport = screen.view.viewport
	let sprites = screen.view.sprites
	let palette = sprites.palette
	let fonts = sprites.fonts
	let font = fonts.standard
	let style = {
		font: font,
		color: palette.jet,
		shadow: palette.taupe
	}

	if (!log.box) {
		let width = viewport.width - margin * 2
		let height = 40
		log.box = renderBox(width, height, sprites)
	}

	if (!log.surface) {
		let width = viewport.width - margin * 2 - padx * 2
		let height = log.box.height - pady * 2 + 4
		log.surface = Canvas.create(width, height)
	}

	let surface = log.surface
	surface.clearRect(0, 0, surface.canvas.width, surface.canvas.height)

	let pos = log.pos
	let message = log.messages[pos.row]
	let cached = log.cache[pos.row]
	if (message && !log.updated && (!cached || !cached.done)) {
		if (!cached) {
			let width = surface.canvas.width
			let height = font.data.cellsize.height
			let line = Canvas.create(width, height)
			log.cache[pos.row] = cached = {
				canvas: line.canvas,
				x: 0,
				done: false
			}
		}
		let line = cached.canvas.getContext("2d")
		let content = message[pos.col]
		let text = renderText(content, style)
		line.drawImage(text, cached.x, 0)
		cached.x += text.width
		if (pos.col < message.length - 1) {
			pos.col++
		} else if (pos.row < log.messages.length - 1) {
			pos.row++
			pos.col = 0
			cached.done = true
		} else {
			log.updated = true
		}
		log.time = screen.time
		screen.dirty = true
	}

	if (pos.row >= 2) {
		pos.offset += ((pos.row - 1) - pos.offset) / 8
	}

	for (let i = 0; i < log.cache.length; i++) {
		let line = log.cache[i]
		let lineheight = font.data.cellsize.height + font.data.spacing.line
		if (!line) {
			console.log(log.cache)
		}
		let y = Math.round((i - pos.offset) * lineheight)
		surface.drawImage(line.canvas, 0, y)
	}

	let anim = log.anim
	let image = log.box
	const start = viewport.height + image.height
	const goal = viewport.height - margin + 1

	let x = margin - 1
	let y = anim ? lerp(start, goal, anim.x) : goal
	nodes.push({
		layer: "ui",
		origin: "bottomleft",
		image, x, y
	})

	nodes.push({
		layer: "ui",
		origin: "bottomleft",
		image: surface.canvas,
		x: x + padx,
		y: y - 7
	})

	return nodes
}
