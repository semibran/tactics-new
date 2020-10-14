import renderRange from "../view/render-range"

export function create(data) {
	return {
		id: "Range",
		data: data,
		image: null,
		anim: null
	}
}

export function add(range, screen) {
	range.image = renderRange(range.data, screen.view.sprites)
	screen.comps.push(range)
}

export function remove() {

}

export function render(range, origin) {
	let node = {
		image: range.image,
		layer: "range",
		x: origin.x,
		y: origin.y
	}
	return [ node ]
}
