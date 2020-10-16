import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import * as RenderStats from "../view/render-forecast"
import * as Config from "./config"
import * as Unit from "./unit"
import earlyExit from "../helpers/early-exit"
import lerp from "lerp"

const enterDuration = 15
const exitDuration = 7
const offsetDelay = 5
const offsetY = 13

export function create(type, attacker, defender, sprites, data) {
	let image = null
	if (type === "wpn") {
		image = RenderStats.renderWpn(attacker, defender, sprites)
	} else if (type === "dmg") {
		image = RenderStats.renderDmg(attacker, defender, sprites)
	} else if (type === "hit") {
		image = RenderStats.renderHit(attacker, defender, sprites)
	} else {
		throw new Error(`Failed to render statpanel component: type ${type} is not defined`)
	}
	data = Object.assign({ offset: 0 }, data)
	let double = null
	if (type === "dmg" && Unit.willDouble(attacker, defender)) {
		double = "attacker"
	} else if (type === "dmg" && Unit.willDouble(defender, attacker)) {
		double = "defender"
	}
	return {
		id: "StatPanel",
		anim: EaseOut.create(enterDuration, { delay: data.offset * offsetDelay }),
		image: image,
		data: data,
		double: double,
		exit: false
	}
}

export function exit(panel) {
	let src = panel.anim ? panel.anim.x : 1
	let duration = panel.anim
		? earlyExit(exitDuration, panel.anim.x)
		: exitDuration
	let opts = { src, dest: 0, delay: panel.data.offset * offsetDelay }
	panel.anim = EaseLinear.create(duration, opts)
	panel.exit = true
}

export function render(panel, screen) {
	let nodes = []
	let anim = panel.anim
	let image = panel.image
	let x = screen.camera.width / 2
	let y = screen.camera.height - Config.forecastOffset + 28 + panel.data.offset * offsetY
	let height = anim ? image.height * anim.x : image.height
	let parent = {
		layer: "ui",
		origin: "center",
		image, x, y, height
	}
	nodes.push(parent)
	if (panel.double) {
		let direction = panel.double === "attacker" ? -1 : 1
		let image = screen.view.sprites.x2
		let width = anim ? image.width * anim.x : image.width
		let height = anim ? image.height * anim.x : image.height
		let x = parent.x + (panel.image.width / 2 + 4) * direction
		let y = parent.y - panel.image.height / 2
		let d = screen.time % 60 / 60
		x += Math.cos(2 * Math.PI * d) * 2
		y += Math.sin(2 * Math.PI * d) * 2
		nodes.push({
			layer: "ui",
			origin: "center",
			image, x, y, width, height
		})
	}
	return nodes
}
