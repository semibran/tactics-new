const period = 120
export const height = 4

// PieceLift.create() -> y
// > Simulates a repeating hover effect.
// > Consists of two states:
// > - raise (floating -> false)
// > - float (floating -> true)
export function create() {
	return {
		type: "PieceLift",
		y: 0,
		time: 0,
		floating: false
	}
}

export function update(anim) {
	if (anim.done) return
	anim.time++
	if (!anim.floating) {
		if (++anim.y === height) {
			anim.floating = true
		}
	} else {
		let t = anim.time % period / period
		anim.y = height + Math.sin(2 * Math.PI * t)
	}
}
