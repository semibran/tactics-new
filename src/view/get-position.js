// getPosition(event) -> pos
// > determines the pointer position from a given event.
// > detects both clicks and taps
export default function getPosition(event) {
	let x = event.pageX || event.touches && event.touches[0].pageX
	let y = event.pageY || event.touches && event.touches[0].pageY
	if (x === undefined || y === undefined) return null
	return { x, y }
}
