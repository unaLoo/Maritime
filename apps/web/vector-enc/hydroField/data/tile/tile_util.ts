import { VectorTile, VectorTileFeature, type VectorTileLayer } from '@mapbox/vector-tile'
import Pbf from 'pbf'
import type { Tile } from './tile'

const EXTENT = 8192 // Standard extent for mapbox-gl

// --------------------- Types -----------------------------
interface ENCFeatureGeometry {
    type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon'
    coordinates: number[] | number[][] | number[][][]
}

interface ENCFeatureProperties {
    [key: string]: any
}

type FeatureType =
    | 'Point'
    | 'LineString'
    | 'Polygon'
    | 'MultiPoint'
    | 'MultiLineString'
    | 'MultiPolygon'
    | 'GeometryCollection'

export interface TileLocalGeometry {
    type: FeatureType
    coordinates:
    | { x: number; y: number }
    | Array<{ x: number; y: number }>
    | Array<Array<{ x: number; y: number }>>
    | Array<Array<Array<{ x: number; y: number }>>>
}

export interface ENCFeature {
    type: 'Feature'
    geometry: ENCFeatureGeometry
    properties: ENCFeatureProperties
    tileLocalGeometry?: TileLocalGeometry
}

export type TileEvent = {
    type: 'tileload' | 'tileerror'
    sourceId: string
    key: string // z/x/y 或 quadkey
    data?: any // 成功时返回瓦片内容（ImageBitmap/ArrayBuffer/texture handle）
    error?: any // 失败时
    meta?: {
        // 可选：调试/统计
        url?: string
        fromCache?: boolean
        ms?: number
    }
}

export type TemporalScalarData = {
    steps: number
    localMin: number
    localMax: number
    body: Float32Array
}

export type TemporalVectorData = {
    steps: number
    body: Float32Array
    [key: string]: any
}

// --------------------- Functions -----------------------------
/**
 * Parse MVT buffer to ENCFeature[]
 */
function parseMVT(buffer: ArrayBuffer, tileZ: number, tileX: number, tileY: number): ENCFeature[] {
    const features: ENCFeature[] = []

    try {
        // Create Pbf instance from buffer and parse vector tile
        const pbf = new Pbf(buffer)
        const tile = new VectorTile(pbf)
        const layers = Object.keys(tile.layers)

        for (const layerName of layers) {
            const layer: VectorTileLayer = tile.layers[layerName]

            if (!layer) {
                console.warn(`layer "${layerName}" not found in tile ${tileZ}/${tileX}/${tileY}`)
                continue
            }

            for (let i = 0; i < layer.length; i++) {
                const feature: VectorTileFeature = layer.feature(i)
                try {
                    // WGS84 geojsonFeature, 存一个以备不时之需
                    const geoJSONFeature = feature.toGeoJSON(tileX, tileY, tileZ)

                    // 瓦片的局部坐标系统一到 0~8192 空间
                    const normalizedGeometry = normalizeTileGeom(feature, feature.extent)

                    // Convert normalized geometry to our format
                    const tileLocalGeo: TileLocalGeometry = {
                        type: geoJSONFeature.geometry.type,
                        coordinates: convertCoordinates(normalizedGeometry, geoJSONFeature.geometry.type),
                    }

                    // Convert to ENCFeature format
                    features.push({
                        type: 'Feature',
                        geometry: geoJSONFeature.geometry as ENCFeature['geometry'],
                        properties: {
                            ...geoJSONFeature.properties,
                            // meta...
                        },
                        tileLocalGeometry: tileLocalGeo, // for render
                    })
                } catch (featureError) {
                    console.warn(
                        `Error parsing feature ${i} in layer "${layerName}" of tile ${tileZ}/${tileX}/${tileY}:`,
                        featureError,
                    )
                    // Continue parsing other features
                }
            }
        }
    } catch (error) {
        console.error('Error parsing MVT:', error)
        throw error
    }

    return features
}

function convertCoordinates(
    geometry: Array<Array<{ x: number; y: number }>>,
    mvtType:
        | 'Point'
        | 'LineString'
        | 'Polygon'
        | 'MultiPoint'
        | 'MultiLineString'
        | 'MultiPolygon'
        | 'GeometryCollection',
): TileLocalGeometry['coordinates'] {
    switch (mvtType) {
        case 'Point': // Point
            // Point: geometry is [[{x, y}]] -> {x, y}
            if (geometry.length > 0 && geometry[0].length > 0) {
                return geometry[0][0]
            }
            throw new Error('Invalid Point geometry')

        case 'LineString': // LineString
            // LineString: geometry is [[{x, y}, {x, y}, ...]] -> [{x, y}, {x, y}, ...]
            if (geometry.length > 0) {
                return geometry[0]
            }
            throw new Error('Invalid LineString geometry')

        case 'MultiLineString': // MultiLineString
        case 'Polygon': // Polygon
        case 'MultiPoint': // MultiPoint
        case 'MultiPolygon': // MultiPolygon
            return geometry
        default:
            throw new Error(`Unsupported MVT geometry type: ${mvtType}`)
    }
}

function normalizeTileGeom(feature: VectorTileFeature, featureExtent: number) {
    const tileLocalGeometry = feature.loadGeometry()
    const extentScale = EXTENT / featureExtent
    const normalizedGeometry = normalizeGeometryCoordinates(tileLocalGeometry, extentScale)
    return normalizedGeometry
}

function normalizeGeometryCoordinates(
    geometry: Array<Array<{ x: number; y: number }>>,
    scale: number,
): Array<Array<{ x: number; y: number }>> {
    return geometry.map((ring) =>
        ring.map((point) => ({
            x: point.x * scale,
            y: point.y * scale,
        })),
    )
}

// --------------------- Tile Cache -----------------------------
class LRUCache {
    cache: { [key: string]: any }
    keys: string[]
    capacity: number
    private keyIndexMap: Map<string, number> // 内部优化：key 到索引的映射，用于 O(1) 查找

    constructor(capacity: number) {
        this.capacity = capacity
        this.cache = {}
        this.keys = []
        this.keyIndexMap = new Map()
    }

    get<T>(key: string): T | null {
        if (key in this.cache) {
            const index = this.keyIndexMap.get(key)!
            // 移除旧位置
            this.keys.splice(index, 1)
            // 更新后续元素的索引
            for (let i = index; i < this.keys.length; i++) {
                this.keyIndexMap.set(this.keys[i], i)
            }
            // 添加到末尾
            this.keys.push(key)
            this.keyIndexMap.set(key, this.keys.length - 1)
            return this.cache[key] as T
        }
        return null
    }

    put(key: string, value: unknown, cb?: (shiftKey: string) => void) {
        if (key in this.cache) {
            // 更新已存在的 key 的位置
            const index = this.keyIndexMap.get(key)!
            this.keys.splice(index, 1)
            // 更新后续元素的索引
            for (let i = index; i < this.keys.length; i++) {
                this.keyIndexMap.set(this.keys[i], i)
            }
        } else if (this.keys.length >= this.capacity) {
            // 移除最旧的 key
            const oldestKey = this.keys.shift()!
            this.keyIndexMap.delete(oldestKey)
            // 更新所有后续元素的索引
            for (let i = 0; i < this.keys.length; i++) {
                this.keyIndexMap.set(this.keys[i], i)
            }
            oldestKey && cb && cb(oldestKey)
            if (oldestKey) {
                delete this.cache[oldestKey]
            }
        }
        // 添加或更新值
        this.cache[key] = value
        this.keys.push(key)
        this.keyIndexMap.set(key, this.keys.length - 1)
    }

    abort(key: string) {
        if (key in this.cache) {
            const index = this.keyIndexMap.get(key)
            if (index !== undefined) {
                this.keys.splice(index, 1)
                this.keyIndexMap.delete(key)
                // 更新后续元素的索引
                for (let i = index; i < this.keys.length; i++) {
                    this.keyIndexMap.set(this.keys[i], i)
                }
            }
            delete this.cache[key]
        }
    }

    has(key: string) {
        return key in this.cache
    }

    release() {
        this.cache = {}
        this.keys = []
        this.keyIndexMap.clear()
    }
}

class TileCache {
    private tiles: Map<string, Tile> = new Map()

    has(key: string) { return this.tiles.has(key) }
    get<T>(key: string) { return this.tiles.get(key) as T | undefined }

    put(key: string, tile: Tile) { this.tiles.set(key, tile) }

    // update() 时调用：保留 keepKeys，其余全部 abort + 删除
    prune(keepKeys: Set<string>) {
        for (const [key, tile] of this.tiles) {
            if (!keepKeys.has(key)) {
                tile.unload()
                this.tiles.delete(key)
            }
        }
    }

    release() {
        this.tiles.clear()
    }
}

export { parseMVT, LRUCache, TileCache }
