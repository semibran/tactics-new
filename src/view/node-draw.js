import bbox from "./node-bbox"

// drawNodes(nodes, layerseq context) -> n/a
// > draws all nodes on the given context
// > layerseq determines order using node.layer
// > TODO: only draw nodes within camera bounds
export default function drawNodes(nodes, layerseq, context) {
	nodes.sort((a, b) => zindex(a) - zindex(b))
	for (let node of nodes) {
		let bounds = bbox(node)
		if (!bounds) continue
		let x = Math.round(bounds.left)
		let y = Math.round(bounds.top)
		let width = Math.round(bounds.width)
		let height = Math.round(bounds.height)
		let image = node.image
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
