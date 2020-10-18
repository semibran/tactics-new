export default function contains(point, bbox) {
	return point.x >= bbox.left
	    && point.y >= bbox.top
	    && point.x < bbox.right
	    && point.y < bbox.bottom
}
