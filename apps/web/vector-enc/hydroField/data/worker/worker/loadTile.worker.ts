import { Callback, WorkerSelf } from '../types'
import { http } from '../request/http'
import { parseMVT, type ENCFeature, type TemporalScalarData, type TemporalVectorData } from '../../tile/tile_util'

type TileRequestParams = {
	uid: number
	url: string
	type?: 'raster' | 'vector'
	tileZ?: number
	tileX?: number
	tileY?: number
}

type FloatDEMData = Float32Array
type TileLoadResult = ImageBitmap | ENCFeature[] | TemporalScalarData | TemporalVectorData | FloatDEMData

/**
 * Load tile data (raster or vector)
 * For raster tiles: returns ImageBitmap
 * For vector tiles: returns ENCFeature[]
 */
export function loadTile(this: WorkerSelf, params: TileRequestParams, callback: Callback<TileLoadResult>) {
	const { url, type = 'raster', tileZ, tileX, tileY } = params

	try {
		if (type === 'vector') {
			// Load vector tile (MVT)
			if (tileZ === undefined || tileX === undefined || tileY === undefined) {
				callback(new Error('tileZ, tileX, tileY are required for vector tiles'), null)
				return
			}

			http.get<ArrayBuffer>(url, { timeout: 2000, responseType: 'arrayBuffer' })
				.then((res) => {
					// 204 No Content ??????????????????????????
					if (res.status === 204) {
						callback(null, [])
						return
					}

					if (res.status !== 200) {
						callback(new Error(`${url} load failed with status ${res.status}`), null)
						return
					}

					try {
						// Parse MVT to ENCFeature[]
						const features = parseMVT(res.data, tileZ, tileX, tileY)

						callback(null, features)
					} catch (parseError) {
						callback(parseError as Error, null)
					}
				})
				.catch((err) => {
					callback(err, null)
				})

			// })
		} else if (type === 'raster') {
			// Load raster tile (image)

			http.get<Blob>(url, { timeout: 2000, responseType: 'blob' })
				.then((res) => {
					// 204 No Content ??????????????????????????
					// ???? 1x1 ??? ImageBitmap ?????
					if (res.status === 204) {
						const canvas = new OffscreenCanvas(1, 1)
						const ctx = canvas.getContext('2d')
						if (ctx) {
							ctx.clearRect(0, 0, 1, 1)
							createImageBitmap(canvas)
								.then((bitmap: ImageBitmap) => {
									callback(null, bitmap)
								})
								.catch((err) => {
									callback(err, null)
								})
						} else {
							callback(new Error('Failed to create canvas context for 204 response'), null)
						}
						return
					}

					if (res.status !== 200) {
						callback(new Error(`${url} load failed with status ${res.status}`), null)
						return
					}

					createImageBitmap(res.data, {
						// 'imageOrientation': 'flipY'
					})
						.then((bitmap: ImageBitmap) => {
							callback(null, bitmap)
						})
						.catch((err) => {
							callback(err, null)
						})
				})
				.catch((err) => {
					callback(err, null)
				})
		} else if (type === 'temporal_scalar') {
			http.get<ArrayBuffer>(url, { timeout: 2000, responseType: 'arrayBuffer' })
				.then((res) => {
					// 204 No Content ??????????????????????????
					if (res.status === 204) {
						const empty: TemporalScalarData = {
							steps: 0,
							localMax: 0,
							localMin: 0,
							body: new Float32Array(),
						}
						callback(null, empty)
						return
					}

					if (res.status !== 200) {
						callback(new Error(`${url} load failed with status ${res.status}`), null)
						return
					}

					const headerView = new DataView(res.data, 0, 16)
					const data: TemporalScalarData = {
						steps: headerView.getUint16(6, true),
						localMin: headerView.getFloat32(8, true),
						localMax: headerView.getFloat32(12, true),
						body: new Float32Array(res.data, 16),
					}
					callback(null, data)
				})
				.catch((err) => {
					callback(err, null)
				})
		} else if (type === 'temporal_vector') {
			http.get<ArrayBuffer>(url, { timeout: 2000, responseType: 'arrayBuffer' })
				.then((res) => {
					// 204 No Content ??????????????????????????
					if (res.status === 204) {
						const empty: TemporalVectorData = {
							steps: 0,
							body: new Float32Array(),
						}
						callback(null, empty)
						return
					}

					if (res.status !== 200) {
						callback(new Error(`${url} load failed with status ${res.status}`), null)
						return
					}

					const data = parseTVEC(res.data) as TemporalVectorData

					callback(null, data)
				})
				.catch((err) => {
					callback(err, null)
				})
		} else if (type === 'terrain') {
			http.get<Blob>(url, { timeout: 2000, responseType: 'blob' })
				.then(async (res) => {
					// 204 No Content ??????????????????????????
					// ???? 1x1 ??? ImageBitmap ?????
					if (res.status === 204) {
						throw new Error('Failed to create canvas context for 204 response')
					}
					if (res.status != 200) {
						throw new Error(`${url} load failed with status ${res.status}`)
					}

					// blob to imagedata
					const imageBitmap = await createImageBitmap(res.data)
					const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height)
					const ctx = canvas.getContext('2d')
					if (ctx == null) {
						callback(new Error('Failed to create canvas 2d context'), null)
						return
					}
					ctx.drawImage(imageBitmap, 0, 0)
					const imageData = ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height)
					imageBitmap.close()

					const pixels = new Uint8Array(imageData.data.buffer)
					const floatView = new Float32Array(imageData.data.buffer)
					const values = new Uint32Array(imageData.data.buffer)

					for (let i = 0; i < values.length; ++i) {
						const byteIdx = i * 4
						floatView[i] = unpack(pixels[byteIdx], pixels[byteIdx + 1], pixels[byteIdx + 2])
					}

					callback(null, floatView)
				})
				.catch((err) => {
					callback(err, null)
				})
		}
	} catch (e: unknown) {
		callback(e instanceof Error ? e : new Error(String(e)), null)
	}
}

function parseTVEC(buffer: ArrayBuffer): TemporalVectorData {
	const TILE_SIZE = 256
	const HEADER_SIZE = 26

	const view = new DataView(buffer)
	const magic = String.fromCharCode(...new Uint8Array(buffer, 0, 4))
	if (magic !== 'TVEC') throw new Error('? TVEC ??: ' + magic)

	// const version = view.getUint16(4, true);
	const timeSteps = view.getUint16(6, true)
	// const channels = view.getUint16(8, true);
	// const minU = view.getFloat32(10, true);
	// const maxU = view.getFloat32(14, true);
	// const minV = view.getFloat32(18, true);
	// const maxV = view.getFloat32(22, true);

	const bodyByteLength = buffer.byteLength - HEADER_SIZE
	const expectedBodyBytes = timeSteps * 2 * TILE_SIZE * TILE_SIZE * 4 // 2 channels * float32
	if (bodyByteLength !== expectedBodyBytes) throw new Error('Body ????')

	// ???????????? buffer ????
	const bodyCopy = new Uint8Array(buffer, HEADER_SIZE, bodyByteLength)
	const alignedBuffer = new ArrayBuffer(bodyByteLength)
	new Uint8Array(alignedBuffer).set(bodyCopy)
	const bodyData = new Float32Array(alignedBuffer)

	return {
		steps: timeSteps,
		body: bodyData,
	}
}
function unpack(r: number, g: number, b: number): number {
	return (r * 256 * 256 + g * 256.0 + b) / 10.0 - 10000.0
}
