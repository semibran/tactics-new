const origins = [
	"topleft", "top", "topright",
	"left", "center", "right",
	"bottomleft", "bottom", "bottomright"
]


export default function bbox(node) {
	let width = node.width
	let height = node.height
	if (width === 0 || height === 0) {
		return null
	}
	if (!width) width = node.image.width
	if (!height) height = node.image.height
	if (width === 0 || height === 0) {
		return null
	}
	let origin = node.origin || "topleft"
	if (origin === "top") {
		origin = "topcenter"
	} else if (origin === "right") {
		origin = "centerright"
	} else if (origin === "bottom") {
		origin = "bottomcenter"
	} else if (origin === "left") {
		origin = "centerleft"
	}

	let x = node.x || 0
	let y = node.y - (node.z || 0) || 0

	if (origin.startsWith("center")) {
		y -= height / 2
	} else if (origin.startsWith("bottom")) {
		y -= height
	}

	if (origin.endsWith("center")) {
		x -= width / 2
	} else if (origin.endsWith("right")) {
		x -= width
	}
	return {
		left: x,
		top: y,
		right: x + width,
		bottom: y + height,
		width: width,
		height: height
	}
}
