import srcmap from "../../dist/tmp/sprites.json"
import fonts from "../fonts"
import renderArrow from "./arrow"
import disasm from "./disasm"
import disasmPalette from "./palette"
import disasmIcons from "./disasm-icons"
import disasmSelect from "./disasm-select"
import disasmSquares from "./disasm-squares"
import disasmLabels from "./disasm-labels"
import disasmBadges from "./disasm-badges"
import disasmPieces from "./disasm-pieces"
import disasmFonts from "./disasm-fonts"

export default function normalize(spritesheet) {
	let images = disasm(spritesheet, srcmap)
	let palette = disasmPalette(images.palette)
	let icons = disasmIcons(images)
	let select = disasmSelect(images, palette)
	return {
		icons, palette, select,
		Arrow: (path, faction) =>
			renderArrow(select.arrows[faction], path),
		squares: disasmSquares(),
		labels: disasmLabels(images.labels, palette),
		badges: disasmBadges(palette, icons),
		pieces: disasmPieces(images.piece, icons, palette),
		fonts: disasmFonts(images, fonts, palette)
	}
}
