export default function renderArrow(sprites, path) {
	var arrow = []
	var stubdir = null
	for (var i = 0; i < path.length; i++) {
		var cell = path[i]
		var x = cell.x
		var y = cell.y
		var l = false
		var r = false
		var u = false
		var d = false

		var prev = path[i - 1]
		if (prev) {
			var dx = cell.x - prev.x
			var dy = cell.y - prev.y
			if (dx === 1) {
				l = true
			} else if (dx === -1) {
				r = true
			}

			if (dy === 1) {
				u = true
			} else if (dy === -1) {
				d = true
			}
		}

		var next = path[i + 1]
		if (next) {
			var dx = next.x - cell.x
			var dy = next.y - cell.y
			if (dx === -1) {
				l = true
			} else if (dx === 1) {
				r = true
			}

			if (dy === -1) {
				u = true
			} else if (dy === 1) {
				d = true
			}
		}

		if (l || r || u || d) {
			var direction = null
			if (!i && l) {
				stubdir = "left"
			} else if (!i && r) {
				stubdir = "right"
			} else if (!i && u) {
				stubdir = "up"
			} else if (!i && d) {
				stubdir = "down"
			} else if (u && l) {
				direction = "upleft"
			} else if (u && r) {
				direction = "upright"
			} else if (d && l) {
				direction = "downleft"
			} else if (d && r) {
				direction = "downright"
			} else if (i === 1 && stubdir === "left") {
				direction = "leftStub"
			} else if (i === 1 && stubdir === "right") {
				direction = "rightStub"
			} else if (i === 1 && stubdir === "up") {
				direction = "upStub"
			} else if (i === 1 && stubdir === "down") {
				direction = "downStub"
			} else if (l && r) {
				direction = "leftright"
			} else if (u && d) {
				direction = "updown"
			} else if (l) {
				direction = "left"
			} else if (r) {
				direction = "right"
			} else if (u) {
				direction = "up"
			} else if (d) {
				direction = "down"
			}
			if (direction) {
				let sprite = sprites[direction]
				arrow.push({
					image: sprite,
					x: cell.x * sprite.width,
					y: cell.y * sprite.height
				})
			}
		}
	}
	return arrow
}
