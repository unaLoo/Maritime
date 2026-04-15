export class BoundingBox {
	public minX: number
	public minY: number
	public maxX: number
	public maxY: number

	constructor(
		minX: number,
		minY: number,
		maxX: number,
		maxY: number,
	) {
		this.minX = minX
		this.minY = minY
		this.maxX = maxX
		this.maxY = maxY
	}

	get width() {
		return this.maxX - this.minX
	}

	get height() {
		return this.maxY - this.minY
	}

	get area() {
		return this.width * this.height
	}

	get centerX() {
		return (this.minX + this.maxX) / 2
	}

	get centerY() {
		return (this.minY + this.maxY) / 2
	}

	get center() {
		return { x: this.centerX, y: this.centerY }
	}

	update(x: number, y: number) {
		this.minX = Math.min(this.minX, x)
		this.minY = Math.min(this.minY, y)
		this.maxX = Math.max(this.maxX, x)
		this.maxY = Math.max(this.maxY, y)
	}

	updateBox(box: BoundingBox) {
		this.minX = Math.min(this.minX, box.minX)
		this.minY = Math.min(this.minY, box.minY)
		this.maxX = Math.max(this.maxX, box.maxX)
		this.maxY = Math.max(this.maxY, box.maxY)
	}

	overlaps(other: BoundingBox) {
		return this.minX < other.maxX && this.maxX > other.minX && this.minY < other.maxY && this.maxY > other.minY
	}

	contains(x: number, y: number) {
		return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY
	}

	containsBox(box: BoundingBox) {
		return this.contains(box.minX, box.minY) && this.contains(box.maxX, box.maxY)
	}
}
