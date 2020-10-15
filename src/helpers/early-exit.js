// earlyExit(src, dest, duration, t)
// > Calculates the duration and src/dest required
// > to undo an easing function linearly.
// > There's probably a simpler way to do this.
export default function earlyExit(src, dest, duration, t) {
	let normdist = dest - src
	let truedist = t * normdist
	let normspeed = normdist / duration
	let newduration = truedist / normspeed
	let newsrc = src + truedist
	return { src: newsrc, dest: src, duration: newduration }
}
