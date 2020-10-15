import renderPreview from "../view/render-preview"
import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import earlyExit from "../helpers/early-exit"
import lerp from "lerp"

const margin = 2
const enterDuration = 15
const exitDuration = 5
const corners = [ "bottomleft", "bottomright", "topleft", "topright" ]

export function create(unit, corner, sprites) {
	if (!corners.includes(corner)) {
		throw new Error(`Failed to create preview component: ${corner} is not a valid corner identifier`)
	}
	let image = renderPreview(unit, sprites)
	let endpts = { src: -image.width, dest: margin }
	let anim = EaseOut.create(enterDuration, endpts)
	return {
		id: "Preview",
		anim: anim,
		unit: unit,
		corner: corner,
		image: image,
		exit: false,
		renders: 0
	}
}

export function exit(preview) {
	let src = preview.anim ? preview.anim.x : 1
	let duration = preview.anim
		? earlyExit(exitDuration, preview.anim.x)
		: exitDuration
	preview.anim = EaseLinear.create(duration, src, 0)
	preview.exit = true
}

export function onresize(preview, viewport) {
	if (viewport.width >= 160) {
		if (preview.corner === "topright") {
			preview.corner = "bottomright"
		}
	} else {
		if (preview.corner === "bottomright") {
			preview.corner = "topright"
		}
	}
} 

export function render(preview, screen) {
	let anim = preview.anim
	let image = preview.image

	// first resize
	if (!preview.renders) {
		onresize(preview, screen.camera)
	}
	preview.renders++

	// determine endpoints
	let start, end
	if (preview.corner.endsWith("left")) {
		start = -image.width
		end = margin
	} else if (preview.corner.endsWith("right")) {
		start = screen.camera.width + preview.image.width
		end = screen.camera.width - preview.image.width - margin + 1
	}

	let x = anim ? lerp(start, end, anim.x) : end
	let y = margin
	if (preview.corner.startsWith("bottom")) {
		y = screen.camera.height - image.height - margin + 1
	}
	return [ {
		layer: "ui",
		image: image,
		x: x,
		y: y
	} ]
}
