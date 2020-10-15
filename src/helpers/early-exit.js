// earlyExit(duration, t)
// > Calculates the number of frames required
// > to undo an easing function linearly.
// > There's probably a simpler way to do this.
export default function earlyExit(duration, t) {
	let normspeed = 1 / duration
	let newduration = t / normspeed
	return newduration
}
