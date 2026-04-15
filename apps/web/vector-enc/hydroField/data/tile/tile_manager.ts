import { Map } from 'mapbox-gl'

import type { Tile } from './tile'
import TilePicker from './tile_picker'
import TileSource, { type TileSourceType } from './tile_source'
import { TileEvent } from './tile_util'
import { Evented } from '../../util/Evented'

export default class TileManager extends Evented {
	private static instance: TileManager | null = null
	// Core-Properties
	private _map: Map
	private _picker: TilePicker

	tileSourceMap = new window.Map<string, TileSource>()

	// ????????????????? tile_source ????????????
	private _forwarders = new window.Map<string, (e: TileEvent) => void>()
	private _tileLoadListeners = new window.Map<string, globalThis.Map<(...args: any[]) => void, (...args: any[]) => void>>()

	private onMapMove: any = () => {}

	// --------------- Constructor --------------------
	static getInstance(map: Map): TileManager {
		if (!TileManager.instance) {
			TileManager.instance = new TileManager(map)
		}
		return TileManager.instance
	}

	static removeInstance(): void {
		const instance = TileManager.instance
		if (instance) {
			instance.remove()
			TileManager.instance = null
		}
	}

	private constructor(map: Map) {
		super()
		this._map = map
		this._picker = new TilePicker(map)

		this.onMapMove = this._onMapMove.bind(this)

		this._map.on('move', this.onMapMove as any)

		Promise.resolve().then(this.onMapMove) // trigger immediately
	}

	// --------------- Public Methods --------------------
	public addSource(sourceDesc: TileSourceType) {
		const tileSource = new TileSource(sourceDesc)
		tileSource.tilePicker = this._picker

		// ????????? tileSource ??????????TM ???????? tileload ??
		const forward = (e: TileEvent) => this.emit('tileload', e)
		tileSource.on('tileload', forward)
		this._forwarders.set(tileSource.id, forward)

		this.tileSourceMap.set(tileSource.id, tileSource)
	}

	public removeSource(sourceId: string) {
		const tileSource = this.tileSourceMap.get(sourceId)
		if (!tileSource) return

		const forward = this._forwarders.get(sourceId)
		if (forward) tileSource.off('tileload', forward)

		this._forwarders.delete(sourceId)

		tileSource.remove()
		this.tileSourceMap.delete(sourceId)
	}

	public onTileLoad(sourceId: string, callback: (...args: any[]) => void) {
		const tileSource = this.tileSourceMap.get(sourceId)
		if (tileSource === undefined) {
			console.error(`TileSource ${sourceId} not found`)
			return
		}

		const wrapper = (e: TileEvent) => {
			if (e.sourceId === sourceId) callback(e)
		}

		const sourceListeners = this._tileLoadListeners.get(sourceId) ?? new window.Map()
		sourceListeners.set(callback, wrapper)
		this._tileLoadListeners.set(sourceId, sourceListeners)
		this.on('tileload', wrapper)
	}

	public offTileLoad(sourceId: string, callback: (...args: any[]) => void) {
		const sourceListeners = this._tileLoadListeners.get(sourceId)
		if (!sourceListeners) return
		const wrapper = sourceListeners.get(callback)
		if (!wrapper) return
		this.off('tileload', wrapper)
		sourceListeners.delete(callback)
		if (sourceListeners.size === 0) {
			this._tileLoadListeners.delete(sourceId)
		}
	}

	public getReadyTiles(sourceId: string): Tile[] {
		const tileSource = this.tileSourceMap.get(sourceId)
		if (tileSource === undefined) {
			console.error(`TileSource ${sourceId} not found`)
			return []
		}

		return tileSource.readyTiles()
	}

	public getSource(sourceId: string): TileSource | undefined {
		return this.tileSourceMap.get(sourceId)
	}

	remove(): void {
		// Clean tile sources
		this.tileSourceMap.forEach((source) => source.remove())
		this.tileSourceMap.clear()

		// Clean map event handler
		this._map.off('move', this.onMapMove as any)
		this._tileLoadListeners.clear()
	}

	cleanCache() {
		this.tileSourceMap.forEach((source) => source.cleanCache())
	}

	private _onMapMove() {
		for (const tileSource of this.tileSourceMap.values()) {
			tileSource.update()
		}
	}
}

