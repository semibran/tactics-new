// getQuadrance(point, point) -> float
// > Gets the quadrance (dist ** 2) between
// > two { x, y } pairs.
export default function getQuadrance(p1, p2) {
	return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
}
