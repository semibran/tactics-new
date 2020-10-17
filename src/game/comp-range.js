import renderRange from "../view/render-range"
import * as RangeExpand from "../anims/range-expand"
import * as RangeShrink from "../anims/range-shrink"

export function create(range, sprites) {
	return {
		id: "Range",
		data: range,
		anim: RangeExpand.create(range),
		image: renderRange(range, sprites),
		sprites: sprites,
		exit: false,
		blocking: true,
	}
}

export function exit(range) {
	range.exit = true
	if (range.anim) {
		range.anim.done = true
	}
	range.anim = RangeShrink.create(range.data)
}

export function render(range, screen) {
	let image = range.image
	let anim = range.anim
	if (anim) {
		image = renderRange(anim.range, range.sprites)
	} else if (range.exit) {
		return []
	}
	return [ {
		image: image,
		layer: "range",
		x: screen.camera.origin.x,
		y: screen.camera.origin.y
	} ]
}
