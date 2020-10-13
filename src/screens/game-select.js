export const id = "Select"

export function init() {
	return {
		pointer: {
			selecting: false
		}
	}
}

export function render(mode, view) {
	// queue unit preview
	if (cache.playerview) {
		const margin = 2
		let preview = cache.playerview
		let x = lerp(-preview.image.width, margin, preview.anim.x)
		let y = view.height - preview.image.height - margin + 1
		layers.ui.push({ image: preview.image, x, y })
	}

	if (cache.enemyview) {
		const margin = 2
		let preview = cache.enemyview
		let width = preview.image.width - 1
		let x = view.width + lerp(width, -margin - width, preview.anim.x)
		let y = view.height - preview.image.height - margin + 1
		layers.ui.push({ image: preview.image, x, y })
	}

	// queue unit mirage
	if (pointer.select
	// && select.cursor
	// && !Cell.equals(select.cursor.target, select.unit.cell)
	) {
		let unit = select.unit
		let image = sprites.pieces[unit.faction][unit.type]
		let x = pointer.pos.x / view.scale - image.width / 2
		let y = pointer.pos.y / view.scale - image.height - 8
		let opacity = 0.75
		if (!select.valid) {
			opacity = 0.25
		}
		if (opacity) {
			layers.mirage.push({ image, x, y, opacity })
		}
	}

	// queue arrow
	if (select && select.path
	&& (select.anim && (select.anim.type !== "PieceMove" || state.time % 2))) {
		for (let node of select.arrow) {
			let image = node.image
			let x = origin.x + node.x
			let y = origin.y + node.y
			layers.arrows.push({ image, x, y })
		}
	}
}
