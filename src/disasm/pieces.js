import * as Canvas from "../../lib/canvas"
import * as pixels from "../../lib/pixels"

export default function disasmPieces(base, icons, palette) {
	let pieces = {
		done: {},
		shadow: Canvas.recolor(base, [ 0, 0, 0, 191 ])
	}
	for (let faction in palette.factions) {
		pieces[faction] = {}
		pieces.done[faction] = {}
		let subpal = palette.factions[faction]
		for (let iconname in icons.types) {
			let unittype = icons.types[iconname]
			let icon = icons.small[iconname]
			let piece = Piece(base, icon, subpal)
			let done = Piece(base, icon, {
				light: subpal.normal,
				normal: subpal.dark,
				dark: palette.black
			})
			pieces[faction][unittype] = piece
			pieces.done[faction][unittype] = done
		}
	}

	return pieces

	function Piece(base, icon, colors) {
		let top = Canvas.recolor(base, colors.normal)
		let bottom = colors.dark !== palette.black
		 	? Canvas.recolor(base, colors.dark)
			: base

		let piece = Canvas.create(base.width, base.height + 2)
		piece.drawImage(bottom, 0, 2)
		piece.drawImage(top, 0, 0)

		let tmp = Canvas.create(8, 8)
		let template = icon.getContext("2d")
			.getImageData(0, 0, icon.width, icon.height)

		pixels.replace(template, palette.white, colors.light)
		tmp.putImageData(template, 0, 0)
		piece.drawImage(tmp.canvas, 4, 5)

		tmp = Canvas.create(8, 8)
		template = icon.getContext("2d")
			.getImageData(0, 0, icon.width, icon.height)

		pixels.replace(template, palette.white, colors.dark)
		tmp.putImageData(template, 0, 0)
		piece.drawImage(tmp.canvas, 4, 4)

		return piece.canvas
	}
}
