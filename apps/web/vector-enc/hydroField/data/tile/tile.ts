import { OverscaledTileID } from './tile_id'
import Actor from '../worker/message/actor'
import { Cancelable } from '../worker/types'
import { mat4 } from 'gl-matrix'
import type { ENCFeature, TemporalScalarData, TemporalVectorData } from './tile_util'

type TileStatus = 'ready' | 'loading' | 'loaded' | 'error' | 'aborted'
type FloatDEMData = Float32Array
const EXTENT = 8192

export class Tile {
	status: TileStatus

	overscaledTileID: OverscaledTileID
	type: 'raster' | 'vector' | 'temporal_scalar' | 'temporal_vector' | 'terrain' = 'vector'

	// if vector
	features: ENCFeature[] | null = null

	// if raster
	bitmap: ImageBitmap | null = null

	// if temporal scalar
	temporalScalarData: TemporalScalarData | null = null

	// if temporal vector
	temporalVectorData: TemporalVectorData | null = null

	// if terrain
	floatDEMData: FloatDEMData | null = null

	_cancel: Cancelable | null = null
	_actor: Actor | null = null

	constructor(overscaledTileID: OverscaledTileID) {
		this.overscaledTileID = overscaledTileID

		this.status = 'ready'
	}

	hasData(): boolean {
		if (this.status !== 'loaded') {
			return false
		}
		// 对于矢量瓦片，检查是否有 features
		if (this.type === 'vector' && this.features !== null) {
			return this.features.length > 0
		}
		// 对于栅格瓦片，检查是否有 bitmap
		if (this.type === 'raster' && this.bitmap !== null) {
			return true
		}
		// 对于时序标量场，检查是否有 temporalScalarData
		if (this.type === 'temporal_scalar' && this.temporalScalarData !== null) {
			return true
			// return this.temporalScalarData.steps > 0  // !!
		}
		// 对于时序矢量场
		if (this.type === 'temporal_vector' && this.temporalVectorData !== null) {
			return true
			// return this.temporalScalarData.steps > 0  // !!
		}
		// 对于地形
		if (this.type === 'terrain' && this.floatDEMData !== null) {
			return true
		}

		return false
	}

	get id() {
		return this.overscaledTileID.key.toString()
	}

	get actor(): Actor {
		if (!this._actor) throw new Error('Actor is null')
		return this._actor
	}

	set actor(actor: Actor) {
		this._actor = actor
	}

	get cancel() {
		if (!this._cancel) throw new Error('cancle is not found')
		return this._cancel
	}

	set cancel(cancel: Cancelable) {
		this._cancel = cancel
	}

	load(tileUrl: string, type: 'raster' | 'vector' | 'temporal_scalar' | 'temporal_vector' | 'terrain' = 'raster', cb?: (...args: any[]) => void) {
		this.type = type
		if (this.status === 'loaded') return
		if (this.status === 'loading') return
		if (this.status === 'aborted') return

		this.status = 'loading'
		const url = this.overscaledTileID.canonical.url(tileUrl)
		const canonical = this.overscaledTileID.canonical

		if (type === 'vector') {
			// Load vector tile (MVT)
			this.cancel = this.actor.send(
				'loadTile',
				{
					uid: this.overscaledTileID.key,
					url: url,
					type: 'vector',
					tileZ: canonical.z,
					tileX: canonical.x,
					tileY: canonical.y,
				},
				(err?: Error | null, features?: ENCFeature[]) => {
					if (err) {
						console.error('Error loading vector tile:', err)
						this.status = 'error'
						return
					}
					this.features = features || []
					this.status = 'loaded'

					cb && cb()
				},
			)
		} else if (type === 'raster') {
			// Load raster tile (image)
			this.cancel = this.actor.send(
				'loadTile',
				{
					uid: this.overscaledTileID.key,
					url: url,
					type: 'raster',
					tileZ: canonical.z,
					tileX: canonical.x,
					tileY: canonical.y,
				},
				(err?: Error | null, bitmap?: ImageBitmap) => {
					if (err) {
						console.error('Error loading vector tile:', err)
						this.status = 'error'
						return
					}
					this.bitmap = bitmap!
					this.status = 'loaded'

					cb && cb()
				},
			)
		} else if (type === 'temporal_scalar') {
			// Load raster tile (image)
			this.cancel = this.actor.send(
				'loadTile',
				{
					uid: this.overscaledTileID.key,
					url: url,
					type: 'temporal_scalar',
					tileZ: canonical.z,
					tileX: canonical.x,
					tileY: canonical.y,
				},
				(err?: Error | null, temporalScalarData?: TemporalScalarData) => {
					if (err) {
						console.error('Error loading temporal_scalar tile:', err)
						this.status = 'error'
						return
					}
					this.temporalScalarData = temporalScalarData!
					this.status = 'loaded'

					cb && cb()
				},
			)
		} else if (type === 'temporal_vector') {
			// Load raster tile (image)
			this.cancel = this.actor.send(
				'loadTile',
				{
					uid: this.overscaledTileID.key,
					url: url,
					type: 'temporal_vector',
					tileZ: canonical.z,
					tileX: canonical.x,
					tileY: canonical.y,
				},
				(err?: Error | null, temporalVectorData?: TemporalVectorData) => {
					if (err) {
						console.error('Error loading temporal_vector tile:', err)
						this.status = 'error'
						return
					}
					this.temporalVectorData = temporalVectorData!
					this.status = 'loaded'

					cb && cb()
				},
			)
		} else if (type === 'terrain') {
			// Load terrain tile (image)
			this.cancel = this.actor.send(
				'loadTile',
				{
					uid: this.overscaledTileID.key,
					url: url,
					type: 'terrain',
					tileZ: canonical.z,
					tileX: canonical.x,
					tileY: canonical.y,
				},
				(err?: Error | null, terrainData?: FloatDEMData) => {
					if (err) {
						console.error('Error loading terrain tile:', err)
						this.status = 'error'
						return
					}
					this.floatDEMData = terrainData!

					const array = Array.from(this.floatDEMData)
					console.log(Math.max(...array), Math.min(...array))
					this.status = 'loaded'

					cb && cb()
				},
			)
		}
	}

	unload() {
		if (this.status === 'loading') {
			this.cancel.cancel()
		} else if (this.status === 'loaded') {
			// Clear vector features
			this.features = null
		}

		this.status = 'aborted'

		// this._actor = null
		// this._cancel = null
	}

	abort() {
		if (this.status === 'loading') {
			this.cancel.cancel()
		}
	}

	tilePosMatrix(mapWorldSize: number): mat4 {
		const canonical = this.overscaledTileID.canonical
		const posMatrix = mat4.identity(new Float64Array(16) as unknown as mat4)

		const scale = mapWorldSize / Math.pow(2, canonical.z)
		const unwrappedX = canonical.x + Math.pow(2, canonical.z) * this.overscaledTileID.wrap
		const scaledX = unwrappedX * scale
		const scaledY = canonical.y * scale

		mat4.translate(posMatrix, posMatrix, [scaledX, scaledY, 0])
		mat4.scale(posMatrix, posMatrix, [scale / EXTENT, scale / EXTENT, 1])

		return posMatrix
	}
}
