import srcmap from "../../dist/tmp/sprites.json"
import fontdata from "../fonts"
import disasm from "./sheet"
import disasmPalette from "./palette"
import disasmIcons from "./icons"
import disasmSelect from "./select"
import disasmSquares from "./squares"
import disasmButtons from "./buttons"
import disasmVs from "./vs"
import disasmBars from "./bars"
import disasmTag from "./tag"
import disasmLabels from "./labels"
import disasmBadges from "./badges"
import disasmPieces from "./pieces"
import disasmFonts from "./fonts"
import renderArrow from "../view/render-arrow"

export default function normalize(spritesheet) {
	let images = disasm(spritesheet, srcmap)
	let palette = disasmPalette(images.palette)
	let icons = disasmIcons(images)
	let select = disasmSelect(images, palette)
	let fonts = disasmFonts(images, fontdata, palette)
	return {
		icons, palette, select, fonts,
		Arrow: (path, faction) =>
			renderArrow(path, select.arrows[faction]),
		squares: disasmSquares(palette),
		buttons: disasmButtons(images.buttons, fonts, palette),
		vs: disasmVs(images.vs, palette),
		tag: disasmTag(images.tag, palette),
		bars: disasmBars(images.bars, palette),
		labels: disasmLabels(images.labels, palette),
		badges: disasmBadges(images.badges, palette),
		pieces: disasmPieces(images.piece, icons, palette)
	}
}
