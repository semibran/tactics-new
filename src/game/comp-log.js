import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import earlyExit from "../helpers/early-exit"
import renderBox from "../view/render-box"
import renderText from "../view/render-text"
import lerp from "lerp"

const enterDuration = 15
const exitDuration = 7
const margin = 2

export function create(sprites) {
	return {
		id: "Log",
		anim: EaseOut.create(enterDuration),
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

export function render(log, screen) {
	let viewport = screen.view.viewport
	if (!log.image) {
		log.image = renderLog(viewport, screen.view.sprites)
	}

	let anim = log.anim
	let image = log.image
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

function renderLog(viewport, sprites) {
	const { fonts, palette } = sprites
	let width = viewport.width - margin * 2
	let height = 40
	let box = renderBox(width, height, sprites).getContext("2d")
	let text = renderText("Hello world!", {
		font: fonts.standard,
		color: palette.jet,
		shadow: palette.taupe
	})
	box.drawImage(text, 10, 9)
	return box.canvas
}
