import { mat4 } from 'gl-matrix'

// function encodeFloatToDouble(value: number) {
// 	const result = new Float32Array(2)
// 	result[0] = value

// 	const delta = value - result[0]
// 	result[1] = delta
// 	return result
// }

function getMatrices(t: any, minElevation: number = -100.0) {
	// if (!t.height) return

	t._updateCameraState()

	const offset = t.centerOffset

	// Z-axis uses pixel coordinates when globe mode is enabled
	const pixelsPerMeter = t.pixelsPerMeter

	const _farZ = farthestPixelDistanceOnPlane(t, minElevation, pixelsPerMeter)

	// The larger the value of nearZ is
	// - the more depth precision is available for features (good)
	// - clipping starts appearing sooner when the camera is close to 3d features (bad)
	//
	// Smaller values worked well for mapbox-gl-js but deckgl was encountering precision issues
	// when rendering it's layers using custom layers. This value was experimentally chosen and
	// seems to solve z-fighting issues in deckgl while not clipping buildings too close to the camera.
	t._nearZ = t.height / 50

	const zUnit = t.projection.zAxisUnit === 'meters' ? pixelsPerMeter : 1.0
	const worldToCamera = t._camera.getWorldToCamera(t.worldSize, zUnit)

	let cameraToClip

	// Projection matrix
	const cameraToClipPerspective = t._camera.getCameraToClipPerspective(t._fov, t.width / t.height, t._nearZ, _farZ)
	// Apply offset/padding
	cameraToClipPerspective[8] = (-offset.x * 2) / t.width
	cameraToClipPerspective[9] = (offset.y * 2) / t.height

	if (t.isOrthographic) {
		const cameraToCenterDistance = ((0.5 * t.height) / Math.tan(t._fov / 2.0)) * 1.0

		// Calculate bounds for orthographic view
		let top = cameraToCenterDistance * Math.tan(t._fov * 0.5)
		let right = top * t.aspect
		let left = -right
		let bottom = -top
		// Apply offset/padding
		right -= offset.x
		left -= offset.x
		top += offset.y
		bottom += offset.y

		cameraToClip = t._camera.getCameraToClipOrthographic(left, right, bottom, top, t._nearZ, _farZ)
	} else {
		cameraToClip = cameraToClipPerspective
	}

	const m = mat4.multiply([] as any, cameraToClip, worldToCamera)

	// The mercatorMatrix can be used to transform points from mercator coordinates
	// ([0, 0] nw, [1, 1] se) to GL coordinates. / zUnit compensates for scaling done in worldToCamera.
	const mercatorMatrix = mat4.scale([] as any, m, [t.worldSize, t.worldSize, t.worldSize / zUnit])
	const projMatrix: mat4 = mat4.copy([] as any, m)
	const invProjMatrix = mat4.invert(new Float64Array(16) as unknown as mat4, projMatrix)

	return {
		mercatorMatrix: mercatorMatrix,
		projMatrix: projMatrix,
		invProjMatrix: invProjMatrix,
	}
}

// function clamp(x: number, min: number, max: number): number {
// 	return Math.min(Math.max(x, min), max)
// }

// function smoothstep(e0: number, e1: number, x: number) {
// 	x = clamp((x - e0) / (e1 - e0), 0, 1)
// 	return x * x * (3 - 2 * x)
// }

function farthestPixelDistanceOnPlane(tr: any, minElevation: number, pixelsPerMeter: number) {
	// Find the distance from the center point [width/2 + offset.x, height/2 + offset.y] to the
	// center top point [width/2 + offset.x, 0] in Z units, using the law of sines.
	// 1 Z unit is equivalent to 1 horizontal px at the center of the map
	// (the distance between[width/2, height/2] and [width/2 + 1, height/2])
	const fovAboveCenter = tr.fovAboveCenter

	// Adjust distance to MSL by the minimum possible elevation visible on screen,
	// this way the far plane is pushed further in the case of negative elevation.
	const minElevationInPixels = minElevation * pixelsPerMeter
	const cameraToSeaLevelDistance =
		(tr._camera.position[2] * tr.worldSize - minElevationInPixels) / Math.cos(tr._pitch)
	const topHalfSurfaceDistance =
		(Math.sin(fovAboveCenter) * cameraToSeaLevelDistance) /
		Math.sin(Math.max(Math.PI / 2.0 - tr._pitch - fovAboveCenter, 0.01))

	// Calculate z distance of the farthest fragment that should be rendered.
	const furthestDistance = Math.sin(tr._pitch) * topHalfSurfaceDistance + cameraToSeaLevelDistance
	const horizonDistance = cameraToSeaLevelDistance * (1 / tr._horizonShift)

	// Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
	return Math.min(furthestDistance * 1.01, horizonDistance)
}

// function getProjectionInterpolationT(projection: any, zoom: number, width: number, height: number, maxSize = Infinity) {
// 	const range = projection.range
// 	if (!range) return 0

// 	const size = Math.min(maxSize, Math.max(width, height))
// 	// The interpolation ranges are manually defined based on what makes
// 	// sense in a 1024px wide map. Adjust the ranges to the current size
// 	// of the map. The smaller the map, the earlier you can start unskewing.
// 	const rangeAdjustment = Math.log(size / 1024) / Math.LN2
// 	const zoomA = range[0] + rangeAdjustment
// 	const zoomB = range[1] + rangeAdjustment
// 	const t = smoothstep(zoomA, zoomB, zoom)
// 	return t
// }

// function makePerspectiveMatrix(fovy: number, aspect: number, near: number, far: number) {
// 	const f = 1.0 / Math.tan(fovy / 2)
// 	const nf = 1 / (near - far)

// 	return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]
// }

// function updateWorldCamera(transform: any, mercatorWorldSize: number, minElevation = -30.0) {
// 	const fov = transform._fov
// 	const halfFov = transform._fov / 2

// 	const angle = transform.angle
// 	const pitch = transform._pitch

// 	const aspect = transform.width / transform.height

// 	const cameraToCenterDistance =
// 		((((0.5 / Math.tan(halfFov)) * mercatorWorldSize) / transform.scale) * transform.height) / 512.0
// 	const cameraToSeaLevelDistance =
// 		(transform._camera.position[2] * mercatorWorldSize - minElevation) / Math.cos(pitch)
// 	const topHalfSurfaceDistance =
// 		(Math.sin(halfFov) * cameraToSeaLevelDistance) / Math.sin(Math.max(Math.PI / 2.0 - pitch - halfFov, 0.01))
// 	const furthestDistance = Math.sin(pitch) * topHalfSurfaceDistance + cameraToSeaLevelDistance
// 	const horizonDistance = cameraToSeaLevelDistance / transform._horizonShift
// 	const farZ = Math.min(furthestDistance * 1.01, horizonDistance)
// 	// const farZ = farthestPixelDistanceOnPlane(transform, -80.06899999999999 * 30.0, transform.pixelsPerMeter)
// 	const nearZ = transform.height / 50.0

// 	const pitchMatrix = mat4.rotateX([] as any, mat4.create(), pitch)
// 	const angleMatrix = mat4.rotateZ([] as any, mat4.create(), angle)
// 	const worldToCamera = mat4.multiply([] as any, angleMatrix, pitchMatrix)

// 	const x = transform.pointMerc.x
// 	const y = transform.pointMerc.y
// 	const centerX = (x - 0.5) * mercatorWorldSize
// 	const centerY = (0.5 - y) * mercatorWorldSize
// 	const center: vec3 = [centerX, centerY, 0]

// 	const up = vec3.transformMat4([] as any, [0, 1, 0], angleMatrix)
// 	const position = vec3.add(
// 		[] as any,
// 		vec3.scale([] as any, vec3.transformMat4([] as any, [0, 0, 1], worldToCamera), cameraToCenterDistance),
// 		center,
// 	)

// 	const view = mat4.invert(
// 		[] as any,
// 		mat4.multiply([] as any, mat4.translate([] as any, mat4.create(), position), worldToCamera),
// 	)

// 	return {
// 		position,
// 		center,
// 		up,
// 		fov,
// 		aspect,
// 		view,
// 		farZ,
// 		nearZ,
// 		// nearZ: cameraToCenterDistance / 200,
// 	}
// }

// function scaleZoom(scale: number): number {
// 	return Math.log(scale) / Math.LN2
// }

// const earthRadius = 6371008.8
// const earthCircumference = 2 * Math.PI * earthRadius
// function circumferenceAtLatitude(latitude: number): number {
// 	return earthCircumference * Math.cos((latitude * Math.PI) / 180)
// }
// function mercatorZfromAltitude(altitude: number, lat: number): number {
// 	return altitude / circumferenceAtLatitude(lat)
// }

export { getMatrices }
