import { mat4, vec3 } from 'gl-matrix'
import { type Frustum, intersectsFrustum } from './frustum'

export class Aabb {
	center: vec3
	min: vec3
	max: vec3

	constructor(min: vec3, max: vec3) {
		this.min = min
		this.max = max
		this.center = vec3.scale([] as any, vec3.add([] as any, this.min, this.max), 0.5)
	}

	/**
	 * 从一组点构建AABB
	 * @param {Array<vec3>} points
	 * @returns {Aabb}
	 */
	static fromPoints(points: Array<vec3>): Aabb {
		const min: vec3 = [Infinity, Infinity, Infinity]
		const max: vec3 = [-Infinity, -Infinity, -Infinity]

		for (const p of points) {
			vec3.min(min, min, p)
			vec3.max(max, max, p)
		}

		return new Aabb(min, max)
	}

	/**
	 * 对Aabb应用变换变换 （🤨某些场景需要把Aabb从世界坐标系转换到其他坐标系，感觉顶多到CameraSpace ？）
	 * @param {Aabb} aabb
	 * @param {mat4} transform
	 * @returns {Aabb}
	 */
	static applyTransform(aabb: Aabb, transform: mat4): Aabb {
		const corners = aabb.getCorners()

		for (let i = 0; i < corners.length; ++i) {
			vec3.transformMat4(corners[i], corners[i], transform)
		}
		return Aabb.fromPoints(corners)
	}

	/**
	 * applyTransform的快速版本， 不适用于非均匀缩放和复杂的投影矩阵。
	 * @param {Aabb} aabb
	 * @param {mat4} transform
	 * @returns {Aabb}
	 */
	static applyTransformFast(aabb: Aabb, transform: mat4): Aabb {
		const min: vec3 = [transform[12], transform[13], transform[14]]
		const max: vec3 = [...min]

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				const value = transform[j * 4 + i]
				const a = value * aabb.min[j]
				const b = value * aabb.max[j]
				min[i] += Math.min(a, b)
				max[i] += Math.max(a, b)
			}
		}

		return new Aabb(min, max)
	}

	/**
	 * 将Aabb的角点投影到其他坐标系
	 * @param {Aabb} aabb
	 * @param {mat4} transform
	 * @returns {Array<vec3>}
	 */
	static projectAabbCorners(aabb: Aabb, transform: mat4): Array<vec3> {
		const corners = aabb.getCorners()

		for (let i = 0; i < corners.length; ++i) {
			vec3.transformMat4(corners[i], corners[i], transform)
		}
		return corners
	}

	/**
	 * 将Aabb划分4象限
	 *   ————————————
	 *  |  0  |  1  |
	 *  ————————————
	 *  |  2  |  3  |
	 *  ————————————
	 * @param {number} index 0, 1, 2, 3
	 * @returns {Aabb}
	 */
	quadrant(index: number): Aabb {
		const split = [index % 2 === 0, index < 2]
		const qMin = vec3.clone(this.min)
		const qMax = vec3.clone(this.max)
		for (let axis = 0; axis < split.length; axis++) {
			qMin[axis] = split[axis] ? this.min[axis] : this.center[axis]
			qMax[axis] = split[axis] ? this.center[axis] : this.max[axis]
		}

		qMax[2] = this.max[2]
		return new Aabb(qMin, qMax)
	}

	/**
	 * 输入点和Aabb的X轴距离:【0 --> 在Aabb内， 正数 --> 小于min， 负数 --> 大于min】
	 * @param {Array<number>} point
	 * @returns {number}
	 */
	distanceX(point: Array<number>): number {
		const pointOnAabb = Math.max(Math.min(this.max[0], point[0]), this.min[0])
		return pointOnAabb - point[0]
	}

	distanceY(point: Array<number>): number {
		const pointOnAabb = Math.max(Math.min(this.max[1], point[1]), this.min[1])
		return pointOnAabb - point[1]
	}

	distanceZ(point: Array<number>): number {
		const pointOnAabb = Math.max(Math.min(this.max[2], point[2]), this.min[2])
		return pointOnAabb - point[2]
	}

	/**
	 * 获取Aabb的8个角点
	 * @returns {Array<vec3>}
	 */
	getCorners(): Array<vec3> {
		const mn = this.min
		const mx = this.max
		return [
			[mn[0], mn[1], mn[2]],
			[mx[0], mn[1], mn[2]],
			[mx[0], mx[1], mn[2]],
			[mn[0], mx[1], mn[2]],
			[mn[0], mn[1], mx[2]],
			[mx[0], mn[1], mx[2]],
			[mx[0], mx[1], mx[2]],
			[mn[0], mx[1], mx[2]],
		]
	}

	/**
	 * 判断是否相交于传入的Aabb， 考虑XYZ三个轴
	 * @param {Aabb} aabb
	 * @returns {boolean}
	 */
	intersectsAabb(aabb: Aabb): boolean {
		for (let axis = 0; axis < 3; ++axis) {
			if (this.min[axis] > aabb.max[axis] || this.max[axis] < aabb.min[axis]) {
				return false
			}
		}
		return true
	}

	/**
	 * 判断是否相交于传入的Aabb， 仅考虑XY平面
	 * @param {Aabb} aabb
	 * @returns {boolean}
	 */
	intersectAabbXY(aabb: Aabb): boolean {
		if (this.min[0] > aabb.max[0] || aabb.min[0] > this.max[0]) {
			return false
		}
		if (this.min[1] > aabb.max[1] || aabb.min[1] > this.max[1]) {
			return false
		}
		return true
	}

	/**
	 * 判断是否相交于传入的Frustum， 先用判断是否相交于Frustum的Aabb，再判断是部分相交or完全相交
	 * @param {Frustum} frustum
	 * @returns {number} **0** 不相交, **1** 部分相交, **2** aabb完全包含于Frustum内部
	 */
	intersects(frustum: Frustum): number {
		if (!this.intersectsAabb(frustum.bounds)) return 0

		return intersectsFrustum(frustum, this.getCorners())
	}

	/**
	 * 判断是否相交于传入的Frustum， 仅考虑XY平面
	 * @param frustum
	 * @returns {number} **0** 不相交, **1** 部分相交, **2** aabb完全包含于Frustum内部
	 */
	intersectsFlat(frustum: Frustum): number {
		if (!this.intersectsAabb(frustum.bounds)) {
			return 0
		}
		const aabbPoints: vec3[] = [
			[this.min[0], this.min[1], 0.0],
			[this.max[0], this.min[1], 0.0],
			[this.max[0], this.max[1], 0.0],
			[this.min[0], this.max[1], 0.0],
		]
		return intersectsFrustum(frustum, aabbPoints)
	}

	// Note: function *intersectsFrustumPrecise* is not implemented

	/**
	 * 扩展当前Aabb以包含传入的Aabb
	 * @param {Aabb} aabb - 要包含的Aabb
	 */
	encapsulate(aabb: Aabb) {
		for (let i = 0; i < 3; i++) {
			this.min[i] = Math.min(this.min[i], aabb.min[i])
			this.max[i] = Math.max(this.max[i], aabb.max[i])
		}
	}

	/**
	 * 扩展当前Aabb以包含传入的点
	 * @param {vec3} point - 要包含的点
	 */
	encapsulatePoint(point: vec3) {
		for (let i = 0; i < 3; i++) {
			this.min[i] = Math.min(this.min[i], point[i])
			this.max[i] = Math.max(this.max[i], point[i])
		}
	}

	/**
	 * 计算Aabb上距离给定点最近的点(在Aabb角点或内部)
	 * @param {vec3} point
	 * @returns {vec3}
	 */
	closestPoint(point: vec3): vec3 {
		return [
			Math.max(Math.min(this.max[0], point[0]), this.min[0]),
			Math.max(Math.min(this.max[1], point[1]), this.min[1]),
			Math.max(Math.min(this.max[2], point[2]), this.min[2]),
		]
	}
}

type TileCoord = {
	x: number
	y: number
	z: number
}
function tileAABB({
	tileXYZ,
	minh,
	maxh,
	worldSize_wd,
}: {
	tileXYZ: TileCoord
	minh: number
	maxh: number
	worldSize_wd: number
}): Aabb {
	const { x, y, z } = tileXYZ
	const s = 1.0 / Math.pow(2, z)

	const [minx, miny, maxx, maxy] = [x * s, y * s, (x + 1) * s, (y + 1) * s]

	// NT-Space AABB
	return new Aabb([minx * worldSize_wd, miny * worldSize_wd, minh], [maxx * worldSize_wd, maxy * worldSize_wd, maxh])
}
