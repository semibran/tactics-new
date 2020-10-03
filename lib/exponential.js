export function easeIn(t) {
	return t * t
}

export function easeOut(t) {
	return -t * (t - 2)
}

export function easeInOut(t) {
	return t < 0.5
		? easeIn(t * 2) / 2
		: (easeOut(t * 2 - 1) + 1) / 2
}
