const origins = [
	"topleft", "top", "topright",
	"left", "center", "right",
	"bottomleft", "bottom", "bottomright"
]

// drawNodes(nodes, layerseq context) -> n/a
// > draws all nodes on the given context
// > layerseq determines order using node.layer
// > TODO: only draw nodes within camera bounds
export default function drawNodes(nodes, layerseq, context) {
	nodes.sort((a, b) => zindex(a) - zindex(b))
	for (let node of nodes) {
		let image = node.image
		let x = Math.round(node.x) || 0
		let y = Math.round(node.y - (node.z || 0)) || 0
		let width = Math.round(node.width)
		let height = Math.round(node.height)
		if (width === 0 || height === 0) {
			continue
		}
		if (!width) width = image.width
		if (!height) height = image.height
		if (width === 0 || height === 0) {
			continue
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

		if (node.opacity !== undefined) {
			context.globalAlpha = node.opacity
			context.drawImage(image, x, y, width, height)
			context.globalAlpha = 1
		} else {
			context.drawImage(image, x, y, width, height)
		}
	}

	function zindex(node) {
		let z = layerseq.indexOf(node.layer)
		let h = node.height || node.image.height
		let y = node.y + h / 2
		if (node.layer === "ui") {
			y = 0
		}
		return z * context.canvas.height + y
	}
}
