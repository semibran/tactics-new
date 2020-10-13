export default function getDevice(event) {
	let device = "desktop"
	if (event.touches) {
		device = "mobile"
		window.removeEventListener("mousedown", events.press)
		window.removeEventListener("mousemove", events.move)
		window.removeEventListener("mouseup", events.release)
	} else {
		window.removeEventListener("touchstart", events.press)
		window.removeEventListener("touchmove", events.move)
		window.removeEventListener("touchend", events.release)
	}
	return device
}
