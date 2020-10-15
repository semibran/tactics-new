import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import * as RenderStats from "../view/render-forecast"
import * as Config from "./config"
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
	return {
		id: "StatPanel",
		anim: EaseOut.create(enterDuration, { delay: data.offset * offsetDelay }),
		image: image,
		data: data,
		exit: false
	}
}

export function exit(panel) {
	let src = panel.anim ? panel.anim.x : 1
	let duration = panel.anim
		? earlyExit(exitDuration, panel.anim.x)
		: exitDuration
	let opts = { delay: panel.data.offset * offsetDelay }
	panel.anim = EaseLinear.create(duration, src, 0, opts)
	panel.exit = true
}

export function render(panel, screen) {
	let anim = panel.anim
	let image = panel.image
	let x = screen.camera.width / 2
	let y = screen.camera.height - Config.forecastOffset + 28 + panel.data.offset * offsetY
	let height = anim ? image.height * anim.x : image.height
	return [ {
		layer: "ui",
		origin: "center",
		image, x, y, height
	} ]
}
