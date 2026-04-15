import { Aabb } from './geometry/aabb'
import MercatorCoordinate from './mercator_coordinate'

const MAX_ZOOM = 28

const DEG_TO_RAD = Math.PI / 180.0
const RAD_TO_DEG = 180.0 / Math.PI

function tile2lon(x: number, z: number): number {
	return (x / Math.pow(2.0, z)) * 360.0 - 180.0
}

function tile2lat(y: number, z: number): number {
	const n = Math.PI - (2.0 * Math.PI * y) / Math.pow(2.0, z)
	return RAD_TO_DEG * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
}

function tileToCenterLngLat(tile: Array<number>): Array<number> {
	const [x, y, z] = tile
	const centerLng = tile2lon(x + 0.5, z)
	const centerLat = tile2lat(y + 0.5, z)
	return [centerLng, centerLat]
}

function tileToBBox(tile: Array<number>): Array<number> {
	const w = tile2lon(tile[0], tile[2])
	const e = tile2lon(tile[0] + 1.0, tile[2])
	const n = tile2lat(tile[1], tile[2])
	const s = tile2lat(tile[1] + 1.0, tile[2])

	return [w, s, e, n]
}

function pointToTileFraction(lon: number, lat: number, z: number) {
	const sin = Math.sin(lat * DEG_TO_RAD)
	const z2 = Math.pow(2.0, z)

	let x = z2 * (lon / 360.0 + 0.5)
	const y = z2 * (0.5 - (0.25 * Math.log((1.0 + sin) / (1.0 - sin))) / Math.PI)

	x = x % z2
	if (x < 0) x = x + z2
	return [x, y, z]
}

function getBboxZoom(bbox: Array<number>): number {
	for (let z = 0; z < MAX_ZOOM; z++) {
		const mask = 1 << (32 - (z + 1))
		if ((bbox[0] & mask) !== (bbox[2] & mask) || (bbox[1] & mask) !== (bbox[3] & mask)) {
			return z
		}
	}

	return MAX_ZOOM
}

function tileToPolygonFeature(tile: Array<number>): GeoJSON.Polygon {
	const bbox = tileToBBox(tile)
	const poly: GeoJSON.Polygon = {
		type: 'Polygon',
		coordinates: [
			[
				[bbox[0], bbox[3]],
				[bbox[0], bbox[1]],
				[bbox[2], bbox[1]],
				[bbox[2], bbox[3]],
			],
		],
	}

	return poly
}

function pointToTile(lon: number, lat: number, z: number) {
	const tile = pointToTileFraction(lon, lat, z)
	tile[0] = Math.floor(tile[0])
	tile[1] = Math.floor(tile[1])
	return tile
}

function getChildren(tile: Array<number>) {
	return [
		[tile[0] * 2, tile[1] * 2, tile[2] + 1],
		[tile[0] * 2 + 1, tile[1] * 2, tile[2] + 1],
		[tile[0] * 2 + 1, tile[1] * 2 + 1, tile[2] + 1],
		[tile[0] * 2, tile[1] * 2 + 1, tile[2] + 1],
	]
}

function getParent(tile: Array<number>) {
	return [tile[0] >> 1, tile[1] >> 1, tile[2] - 1]
}

function getSiblings(tile: Array<number>) {
	return getChildren(getParent(tile))
}

function tilesEqual(tile1: Array<number>, tile2: Array<number>) {
	return tile1[0] === tile2[0] && tile1[1] === tile2[1] && tile1[2] === tile2[2]
}

function hasTile(tiles: Array<Array<number>>, tile: Array<number>) {
	for (let i = 0; i < tiles.length; i++) {
		if (tilesEqual(tiles[i], tile)) return true
	}
	return false
}

function hasSiblings(tile: Array<number>, tiles: Array<Array<number>>) {
	const siblings = getSiblings(tile)
	for (let i = 0; i < siblings.length; i++) {
		if (!hasTile(tiles, siblings[i])) return false
	}
	return true
}

function tileToQuadkey(tile: Array<number>) {
	let index = ''
	for (let z = tile[2]; z > 0; z--) {
		let b = 0
		const mask = 1 << (z - 1)
		if ((tile[0] & mask) !== 0) b++
		if ((tile[1] & mask) !== 0) b += 2
		index += b.toString()
	}
	return index
}

function quadkeyToTile(quadkey: string) {
	let x = 0
	let y = 0
	const z = 0

	for (let i = z; i > 0; i--) {
		const mask = 1 << (i - 1)
		const q = +quadkey[z - i]
		if (q === 1) x |= mask
		if (q === 2) y |= mask
		if (q === 3) {
			x |= mask
			y |= mask
		}
	}
	return [x, y, z]
}

function bboxToTile(bboxCoords: Array<number>) {
	const min = pointToTile(bboxCoords[0], bboxCoords[1], 32)
	const max = pointToTile(bboxCoords[2], bboxCoords[3], 32)
	const bbox = [min[0], min[1], max[0], max[1]]

	const z = getBboxZoom(bbox)
	if (z === 0) return [0, 0, 0]
	const x = bbox[0] >>> (32 - z)
	const y = bbox[1] >>> (32 - z)
	return [x, y, z]
}

function getBounds(
	cameraX: number,
	cameraY: number,
	cameraZoom: number,
	canvasWidth: number,
	canvasHeight: number,
	tileSize: number,
) {
	const zoomScale = Math.pow(2.0, cameraZoom)

	const px = (1.0 + cameraX) / 2.0
	const py = (1.0 - cameraY) / 2.0

	const wx = px * tileSize
	const wy = py * tileSize

	const zx = wx * zoomScale
	const zy = wy * zoomScale

	let x1 = zx - canvasWidth / 2.0
	let y1 = zy + canvasHeight / 2.0
	let x2 = zx + canvasWidth / 2.0
	let y2 = zy - canvasHeight / 2.0

	x1 = x1 / zoomScale / tileSize
	y1 = y1 / zoomScale / tileSize
	x2 = x2 / zoomScale / tileSize
	y2 = y2 / zoomScale / tileSize

	const bbox = [
		Math.max(MercatorCoordinate.lngFromMercatorX(x1), -180.0),
		Math.max(MercatorCoordinate.latFromMercatorY(y1), -85.05),
		Math.min(MercatorCoordinate.lngFromMercatorX(x2), 179.99999),
		Math.min(MercatorCoordinate.latFromMercatorY(y2), 85.05),
	]

	return bbox
}

function getTilesInView(
	camera_x: number,
	camera_y: number,
	camera_zoom: number,
	canvas_width: number,
	canvas_height: number,
	tile_size: number,
	max_tile_zoom: number,
) {
	const bbox = getBounds(camera_x, camera_y, camera_zoom, canvas_width, canvas_height, tile_size)

	const z = Math.min(Math.trunc(camera_zoom), max_tile_zoom)
	const minTile = pointToTile(bbox[0], bbox[3], z) // top-left
	const maxTile = pointToTile(bbox[2], bbox[1], z) // bottom-right

	const tilesInView: Array<Array<number>> = []
	const [minX, maxX] = [Math.max(minTile[0], 0.0), maxTile[0]]
	const [minY, maxY] = [Math.max(minTile[1], 0.0), maxTile[1]]
	for (let x = minX; x <= maxX; x++) {
		for (let y = minY; y <= maxY; y++) {
			tilesInView.push([x, y, z])
		}
	}

	return tilesInView
}

export type TileTransform = {
	scale: number
	x: number
	y: number
	x2: number
	y2: number
}

export function tileTransform(id: any): TileTransform {
	return {
		scale: 1 << id.z,
		x: id.x,
		y: id.y,
		x2: id.x + 1,
		y2: id.y + 1,
	}
}

export function tileAABB(
	numTiles: number,
	z: number,
	x: number,
	y: number,
	wrap: number,
	min: number,
	max: number,
): Aabb {
	const tt = tileTransform({ z, x, y })
	const tx = tt.x / tt.scale
	const ty = tt.y / tt.scale
	const tx2 = tt.x2 / tt.scale
	const ty2 = tt.y2 / tt.scale

	if (isNaN(tx) || isNaN(ty) || isNaN(tx2) || isNaN(ty2)) {
		throw new Error('tileAABB: NaN')
	}

	return new Aabb([(wrap + tx) * numTiles, numTiles * ty, min], [(wrap + tx2) * numTiles, numTiles * ty2, max])
}

export {
	tile2lon,
	tile2lat,
	tileToCenterLngLat,
	tileToPolygonFeature,
	tileToBBox,
	getChildren,
	getParent,
	getSiblings,
	hasTile,
	hasSiblings,
	tilesEqual,
	tileToQuadkey,
	quadkeyToTile,
	pointToTile,
	bboxToTile,
	pointToTileFraction,
	getBounds,
	getTilesInView,
}
