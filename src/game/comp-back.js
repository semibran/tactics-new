import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import * as Config from "./config"
import earlyExit from "../helpers/early-exit"
import bbox from "../view/node-bbox"
import lerp from "lerp"

// comp-back.js
// > back button component
// > enters from and exits to bottom-left corner
// > on click, sends an event

const margin = 4
const enterDuration = 15
const exitDuration = 7

export function create(sprites, opts) {
	return {
		id: "Back",
		anim: EaseOut.create(enterDuration),
		image: sprites.buttons.back,
		events: [],
		bbox: null,
		blocking: true,
		exit: false
	}
}

export function exit(button) {
	let src = button.anim ? button.anim.x : 1
	let duration = button.anim
		? earlyExit(exitDuration, button.anim.x)
		: exitDuration
	button.anim = EaseLinear.create(duration, { src, dest: 0 })
	button.exit = true
}

export function onclick(button, screen) {
	// add event (unused)
	button.events.push([ "cancel", screen.mode.unit ])

	// cancel
	screen.commands.push({ type: "cancel", unit: screen.mode.unit })
	console.log(button.id)
}

export function render(button, screen) {
	let anim = button.anim
	let image = button.image

	let origin = "bottomleft"
	let start = -image.width
	let goal = margin

	let x = anim ? lerp(start, goal, anim.x) : goal
	let y = screen.camera.height - margin

	let node = {
		layer: "ui",
		image, x, y, origin
	}

	if (!anim) {
		button.bbox = bbox(node)
	}

	return [ node ]
}
