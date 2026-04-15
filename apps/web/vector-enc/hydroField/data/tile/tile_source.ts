import { Tile } from './tile'
import Dispatcher from '../worker/message/dispatcher'
import { OverscaledTileID } from './tile_id'
import { TileCache } from './tile_util'

import { Evented } from '../../util/Evented'
import type { TileEvent } from './tile_util'
import TilePicker from './tile_picker'

export type TileSourceType = {
    id: string
    type: 'raster' | 'vector' | 'temporal_scalar' | 'temporal_vector' | 'terrain'
    url: string
    minzoom: number
    maxzoom: number
}

export default class TileSource extends Evented {
    id!: string
    type!: 'raster' | 'vector' | 'temporal_scalar' | 'temporal_vector' | 'terrain'
    url!: string
    minzoom!: number
    maxzoom!: number
    tilePicker!: TilePicker | null

    dispatcher: Dispatcher
    tileCache: TileCache = new TileCache()

    coveringTileIDs: OverscaledTileID[] = []

    constructor(desc: TileSourceType) {
        super()
        Object.assign(this, desc)
        this.dispatcher = new Dispatcher(this)
    }

    loadTile(tile: OverscaledTileID) {
        const tileKey = tile.key.toString()
        // cache hit
        if (this.tileCache.has(tileKey)) return

        // load tile
        const data_tile = new Tile(tile)
        data_tile.actor = this.dispatcher.actor

        this.tileCache.put(data_tile.id, data_tile) // ??data_tile???

        data_tile.load(this.url, this.type, (err) => {
            if (err) {
                console.log(`tile ${tileKey} loaded, error:`, err)
                return
            }
            // ??????????????????data_tile??
            this.emit('tileload', {
                type: 'tileload',
                sourceId: this.id,
                key: tile.key.toString(),
                data: data_tile,
            } as TileEvent)
        })
    }

    abortTile(tile: Tile) {
        tile.unload()
        // this.lruCache.abort(tile.id)
    }

    readyTiles(): Tile[] {
        const renderables: Map<string, Tile> = new Map()
        // debugger
        for (const ozID of this.coveringTileIDs) {
            const self = this.tileCache.get<Tile>(ozID.key.toString())

            // 1) ?????????????
            if (self?.hasData()) {
                renderables.set(self.id, self)
                continue
            }

            // 2) ??? children ??
            const { tiles: childTiles, fullyCovered } = this.findAvailableChildTiles(ozID, 2)
            for (const t of childTiles) renderables.set(t.id, t)

            if (!fullyCovered) {
                // 3) ??? parent ??
                const { tile: parentTile } = this.findClosestAvailableParentTile(ozID, this.minzoom)
                if (parentTile) renderables.set(parentTile.id, parentTile)
            }
        }

        // ?????????z ????z ?????? --> ???????
        // ???z ????????z ???? --> ?? stencil test ???
        return [...renderables.values()].sort(
            // (a, b) => a.overscaledTileID.canonical.z - b.overscaledTileID.canonical.z,
            (a, b) => b.overscaledTileID.canonical.z - a.overscaledTileID.canonical.z, // z ????
        )
    }

    update() {
        const coveringTiles = this.tilePicker!.coveringTile({
            minzoom: this.minzoom,
            maxzoom: this.maxzoom,
            renderWorldCopies: true,
            isDEMTile: false,
            roundZoom: false,
        })
        // console.log('coveringTiles', coveringTiles.map(t => t.canonical.toString()))

        // 1. prune ???? tile
        const keepKeys = new Set(coveringTiles.map((t) => t.key.toString()))
        this.tileCache.prune(keepKeys)

        // 2. ??? tile
        this.coveringTileIDs = coveringTiles
        for (const id of coveringTiles) {
            this.loadTile(id)
        }
    }

    private findClosestAvailableParentTile(
        ozID: OverscaledTileID,
        minCoveringZoom: number = this.minzoom,
    ): {
        tile: Tile | null
        tl: [number, number]
        scale: number
    } {
        let current = ozID
        const child = ozID.canonical

        while (current.canonical.z > minCoveringZoom) {
            // ????
            current = current.scaledTo(current.canonical.z - 1)

            const parentTile = this.tileCache.get<Tile>(current.key.toString())
            if (!parentTile?.hasData()) continue

            const parent = parentTile.overscaledTileID.canonical
            const dz = child.z - parent.z
            const scale = 1 << dz // 2^(dz)

            // ?????????????????????? 1/scale?
            const dx = child.x - parent.x * scale
            const dy = child.y - parent.y * scale

            const tl: [number, number] = [dx / scale, dy / scale]

            return { tile: parentTile, tl, scale }
        }

        return { tile: null, tl: [0, 0], scale: 1 }
    }

    private findAvailableChildTiles(
        ozID: OverscaledTileID,
        maxDepth: number = 2,
    ): { tiles: Tile[]; fullyCovered: boolean } {
        type Node = { id: OverscaledTileID; depth: number }
        const queue: Node[] = [{ id: ozID, depth: 0 }]

        const tiles: Tile[] = []
        let fullyCovered = false

        while (queue.length > 0) {
            const { id, depth } = queue.shift()!
            if (depth >= maxDepth) continue

            const children = id.children(this.maxzoom)

            // ?????? 4 ????????????????? tile?
            let all4Ready = true
            const ready4: Tile[] = []

            for (const childID of children) {
                const cached = this.tileCache.get<Tile>(childID.key.toString())
                if (cached?.hasData()) {
                    ready4.push(cached)
                } else {
                    all4Ready = false
                }
            }

            if (all4Ready) {
                // ????????????????? 4 ???
                tiles.push(...ready4)
                fullyCovered = true
                continue
            }

            // ?????????????????????? maxDepth ???
            for (const t of ready4) tiles.push(t)
            if (depth + 1 < maxDepth) {
                for (const childID of children) queue.push({ id: childID, depth: depth + 1 })
            }
        }

        return { tiles, fullyCovered }
    }

    remove() {
        super.remove()
        this.tileCache.release()
        this.dispatcher.remove()
        this.coveringTileIDs = []
        this.tilePicker = null
    }

    cleanCache() {
        console.log('cache clean')
        this.tileCache.release()
    }
}

