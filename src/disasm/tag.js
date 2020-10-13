import extract from "../../lib/img-extract"
import replaceColors from "../../lib/canvas-replace"
import * as Canvas from "../../lib/canvas"

export default function disasmTag(image, palette) {
	let tags = {}
	let oldColors = [
		[ 255, 255, 255, 255 ],
		[ 204, 204, 204, 255 ],
		[ 153, 153, 153, 255 ],
		[ 102, 102, 102, 255 ],
		[  51,  51,  51, 255 ],
		[   0,   0,   0, 255 ],
	]
	let yellows = [
		palette.yellow,
		palette.gold,
		palette.brass
	]
	let playerColors = [
		palette.opal,
		palette.coal,
		palette.jet
	]
	let enemyColors = [
		palette.pink,
		palette.maroon,
		palette.jet
	]
	let newColors = yellows.concat(playerColors)
	replaceColors(image, oldColors, newColors)
	tags.player = {
		start: extract(image, 0, 0, 2, 12),
		end: extract(image, 2, 0, 3, 12),
		palette: playerColors
	}
	oldColors = newColors
	newColors = yellows.concat(enemyColors)
	image = Canvas.copy(image).canvas
	replaceColors(image, oldColors, newColors)
	tags.enemy = {
		start: extract(image, 0, 0, 2, 12),
		end: extract(image, 2, 0, 3, 12),
		palette: enemyColors
	}
	return tags
}
