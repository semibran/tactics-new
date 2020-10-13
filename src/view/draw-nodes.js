const order = [ "map", "shadows", "pieces" ]

export default function drawNodes(nodes, context, camera) {
	nodes.sort((a, b) => zindex(a) - zindex(b))
	for (let node of nodes) {
		let image = node.image
		let x = Math.round(node.x)
		let y = Math.round(node.y - (node.z || 0))
		let width = Math.round(node.width)
		let height = Math.round(node.height)
		if (width === 0 || height === 0) {
			continue
		}
		if (!width) width = image.width
		if (!height) height = image.height
		if (node.opacity !== undefined) {
			context.globalAlpha = node.opacity
			context.drawImage(image, x, y, width, height)
			context.globalAlpha = 1
		} else {
			context.drawImage(image, x, y, width, height)
		}
	}

	function zindex(node) {
		let z = order.indexOf(node.layer)
		let h = node.height || node.image.height
		let y = node.y + h / 2
		if (node.layer === "ui") {
			y = 0
		}
		return z * camera.height + y
	}
}
