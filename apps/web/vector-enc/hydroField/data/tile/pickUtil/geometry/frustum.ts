import { mat4, vec3, vec4 } from 'gl-matrix'
import { Aabb } from './aabb'

type FrustumPoints = [vec3, vec3, vec3, vec3, vec3, vec3, vec3, vec3]
type FrustumPlanes = [vec4, vec4, vec4, vec4, vec4, vec4]

// Frustum corner indices
const NEAR_TL = 0
const NEAR_TR = 1
const NEAR_BR = 2
const NEAR_BL = 3
const FAR_TL = 4
const FAR_TR = 5
const FAR_BR = 6
const FAR_BL = 7

const frustumPlanePointIndices: vec3[] = [
	[NEAR_TL, NEAR_TR, NEAR_BR], // near
	[FAR_BR, FAR_TR, FAR_TL], // far
	[NEAR_TL, NEAR_BL, FAR_BL], // left
	[NEAR_BR, NEAR_TR, FAR_TR], // right
	[NEAR_BL, NEAR_BR, FAR_BR], // bottom
	[NEAR_TL, FAR_TL, FAR_TR], // top
]

export class Frustum {
	points: FrustumPoints
	planes: FrustumPlanes
	frustumEdges: Array<vec3>
	bounds: Aabb

	constructor() {
		this.points = new Array(8).fill([0, 0, 0]) as FrustumPoints
		this.planes = new Array(6).fill([0, 0, 0, 0]) as FrustumPlanes
		this.bounds = new Aabb([0, 0, 0], [0, 0, 0])
		this.frustumEdges = []

		// 简化了初始化内容，默认视锥体创建入口是fromViewProjection函数！
	}

	/**
	 * 基于逆VP矩阵，WorldSize，HighestTileZoom 构建一个在 WD-Space 的视锥体
	 * @param invProjMatrix 这里是 vp-matrix 的逆矩阵，直接从NDC还原到世界坐标
	 * @param worldSize 当前mapbox世界坐标大小 --> 2^mapZoom * tileSize
	 * @param tileHighestZoom 瓦片最大zoom --> floor(mapZoom)
	 */
	static fromInvViewProjection(invProjMatrix: mat4, worldSize: number, tileHighestZoom: number): Frustum {
		const WDSize = Math.pow(2, tileHighestZoom)
		const scaledTileSize = worldSize / WDSize
		const frustum = new Frustum()
		frustum.calculateFrustumPoints(invProjMatrix, scaledTileSize)
		frustum.extractPlanes()
		frustum.calculateFrustumEdges()
		return frustum
	}

	/**
	 * 基于逆VP矩阵，以及地图世界坐标和 计算视锥体的8个角点坐标
	 * @param {mat4} invViewProj 逆视图投影矩阵（NDC到世界坐标的变换）
	 * @param {number} scaledTileSize 缩放后的瓦片尺寸（worldSize / 2^tileHighestZoom）
	 */
	private calculateFrustumPoints(invViewProj: mat4, scaledTileSize: number): void {
		const clipSpaceCorners = [
			[-1, 1, -1, 1], // Near top left
			[1, 1, -1, 1], // Near top right
			[1, -1, -1, 1], // Near bottom right
			[-1, -1, -1, 1], // Near bottom left
			[-1, 1, 1, 1], // Far top left
			[1, 1, 1, 1], // Far top right
			[1, -1, 1, 1], // Far bottom right
			[-1, -1, 1, 1], // Far bottom left
		] as vec4[]

		for (let i = 0; i < 8; i++) {
			const point = vec4.transformMat4([] as any, clipSpaceCorners[i], invViewProj)
			// 乘以逆VP之后 [x, y, z, w] --> [x/w, y/w, z/w，1.0] ，还原至世界坐标
			// 再除以scaledTileSize到 WD-Space
			// Z值没有除以tileSize，z值单位为meter，不必再变换
			const w = point[3]
			const k = 1.0 / w / scaledTileSize
			this.points[i] = [point[0] * k, point[1] * k, point[2] / w]
		}
		this.bounds = Aabb.fromPoints(this.points)
	}

	/**
	 * 基于视锥体的8个角点，计算6个面的法线和距离
	 * Note: mapbox的VP矩阵 --> mat4.mul([] as unknown as mat4, cameraToClip, worldToCamera);
	 * cameraToClip 就是一个纯投影矩阵
	 * worldToCamera: flip * cam^-1 * zScale , 注意有个通过flipY实现的从左手到右手
	 * So, 逆VP矩阵会把右手系的NDC的坐标还原到左手系世界坐标
	 * 带入一个点，比如[NEAR_TL, NEAR_TR, NEAR_BR]，最终视锥体的planes的法线是指向视锥体**内部**的！
	 * @returns {Array<vec4>}
	 */
	private extractPlanes(): void {
		this.planes = frustumPlanePointIndices.map((p: vec3) => {
			const a = vec3.sub(
				[] as unknown as vec3,
				this.points[p[0]] as unknown as vec3,
				this.points[p[1]] as unknown as vec3,
			)
			const b = vec3.sub(
				[] as unknown as vec3,
				this.points[p[2]] as unknown as vec3,
				this.points[p[1]] as unknown as vec3,
			)
			const n = vec3.normalize([] as unknown as vec3, vec3.cross([] as unknown as vec3, a, b)) as [
				number,
				number,
				number,
			]
			const d = -vec3.dot(n, this.points[p[1]] as unknown as vec3)
			return n.concat(d) as vec4
		}) as FrustumPlanes

		// Normalize planes
		for (const plane of this.planes) {
			const len = Math.sqrt(plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2])
			vec4.scale(plane, plane, 1.0 / len)
		}
	}

	/**
	 * 计算视锥体的6个面的边， 不过边好像没有啥应用场景
	 * @returns {Array<vec3>}
	 */
	private calculateFrustumEdges(): void {
		this.frustumEdges = [
			vec3.sub([] as any, this.points[NEAR_BR], this.points[NEAR_BL]),
			vec3.sub([] as any, this.points[NEAR_TL], this.points[NEAR_BL]),
			vec3.sub([] as any, this.points[FAR_TL], this.points[NEAR_TL]),
			vec3.sub([] as any, this.points[FAR_TR], this.points[NEAR_TR]),
			vec3.sub([] as any, this.points[FAR_BR], this.points[NEAR_BR]),
			vec3.sub([] as any, this.points[FAR_BL], this.points[NEAR_BL]),
		]
	}

	/**
	 * 检测点是否在视锥体内
	 * 前文提及： 视锥体的planes的法线是指向视锥体**内部**的！
	 * 所以！！ 点在视锥体内，需要满足：点到所有平面的距离都大于0
	 * @param point
	 * @returns {Boolean} true if point is inside frustum
	 */
	containsPoint(point: vec3): boolean {
		for (const plane of this.planes) {
			const normal: vec3 = [plane[0], plane[1], plane[2]]
			const distance = plane[3]
			// ax + by + cz + d < 0, 在法线的负向方向， 在视锥体外
			if (vec3.dot(normal, point) + distance < 0) {
				return false
			}
		}
		return true
	}
}

/**
 * 判断视锥体与Aabb的相交情况
 * @param {Frustum} frustum - 视锥体，fustum.planes的法线方向指向视锥体内
 * @param {Array<vec3>} aabbPoints
 * @returns {number} -0: 不相交， 1: Aabb部分在视锥体内， 2: Aabb完全在视锥体内
 */
export function intersectsFrustum(frustum: Frustum, aabbPoints: Array<vec3>): number {
	let fullyInside = true

	for (let p = 0; p < frustum.planes.length; p++) {
		const plane = frustum.planes[p]
		let pointsInside = 0

		for (let i = 0; i < aabbPoints.length; i++) {
			// Ax + By + Cz + D >= 0 <---> 点在法线方向的同一侧， 在视锥体内， pointsInside++
			// @ts-expect-error - TS2365 - Operator '+=' cannot be applied to types 'number' and 'boolean'. | TS2345 - Argument of type 'vec4' is not assignable to parameter of type 'ReadonlyVec3'.
			pointsInside += vec3.dot(plane, aabbPoints[i]) + plane[3] >= 0
		}

		if (pointsInside === 0) return 0

		if (pointsInside !== aabbPoints.length) fullyInside = false
	}

	return fullyInside ? 2 : 1
}
