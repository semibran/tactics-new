import renderRange from "../view/render-range"
import * as RangeExpand from "../anims/range-expand"
import * as RangeShrink from "../anims/range-shrink"

export function create(data) {
	return {
		id: "Range",
		data: data,
		anims: [],
		image: null,
		sprites: null,
		exit: false
	}
}

export function enter(range, screen) {
	range.sprites = screen.view.sprites
	range.image = renderRange(range.data, range.sprites)
	range.anims.push(RangeExpand.create(range.data))
}

export function exit(range, screen) {
	range.exit = true
	range.anims.push(RangeShrink.create(range.data))
}

export function render(range, origin) {
	let image = range.image
	let anim = range.anims[0]
	if (anim) {
		image = renderRange(anim.range, range.sprites)
	} else if (range.exit) {
		return []
	}
	return [ {
		image: image,
		layer: "range",
		x: origin.x,
		y: origin.y
	} ]
}
