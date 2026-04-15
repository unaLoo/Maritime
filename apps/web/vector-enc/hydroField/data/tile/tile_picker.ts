import { vec3 } from 'gl-matrix'
import { Map } from 'mapbox-gl'

import { getMatrices } from './pickUtil/map_transform'
import { Frustum, Aabb } from './pickUtil/geometry'
import MercatorCoordinate from './pickUtil/mercator_coordinate'
import { tileAABB } from './pickUtil/tile_util'

import { OverscaledTileID } from './tile_id'

/////// Const //////////////////////////////////
const NUM_WORLD_COPIES = 3

type QuadTileNode = {
    wrap: number
    x: number
    y: number
    z: number
    aabb: Aabb
    maxAltitude: number
    minAltitude: number
    fullyVisible: boolean
    shouldSplit?: boolean
}
type CoveringTileNode = {
    x: number
    y: number
    z: number
    tileID: OverscaledTileID
    wrap: number
    distance: number // distance to camera
}

export default class TilePicker {
    // Base
    type: 'custom' = 'custom' as const
    id: string = 'tile_picker'

    // Core-Properties
    private _map: Map
    frustum!: Frustum

    constructor(map: Map) {
        this._map = map
    }

    coveringTile(options: {
        minzoom?: number // data-source minzoom
        maxzoom?: number // data-source maxzoom
        renderWorldCopies?: boolean // enable warp
        isDEMTile?: boolean
        roundZoom?: boolean
    }): Array<OverscaledTileID> {
        /////// Basic variables //////////////////////////////////////////////////
        const transform = this._map.transform
        const mapZoom = transform.zoom
        let reparseOverscaled = false

        const isDEMTile = options.isDEMTile

        const minTileZoom = options.minzoom || 0
        const mapMaxTileZoom = options.roundZoom ? Math.round(mapZoom) : Math.floor(mapZoom)
        let maxTileZoom = mapMaxTileZoom // limited max zoom

        if (options.minzoom && maxTileZoom < options.minzoom) return []
        if (options.maxzoom && maxTileZoom > options.maxzoom) {
            maxTileZoom = options.maxzoom
            reparseOverscaled = true // enable if maxZoom setted
        }

        const worldSize_wd = 1 << maxTileZoom

        let minElevation = 0,
            maxElevation = 0

        if (isDEMTile) {
            maxElevation = 100 * 1000 // 100 km as a max altitude
            minElevation = -maxElevation
        }

        /////// Map Center //////////////////////////////////////////////////////
        // Lnglat-space | Webmercator-space | WD-space
        const mapCenter_lnglat = [transform._center.lng, transform._center.lat]
        const mapCenter_wmc = MercatorCoordinate.fromLngLat(mapCenter_lnglat)
        const mapCenter_wd = [mapCenter_wmc[0] * worldSize_wd, mapCenter_wmc[1] * worldSize_wd, 0.0]
        const mapCenterAltitude = 0.0 // temporary

        /////// zAxis-translation ///////////////////////////////////////////////
        // Meter-unit | WebmercatorZ-unit | WD-Z-unit
        const meter2wmcz = MercatorCoordinate.mercatorZfromAltitude(1, mapCenter_lnglat[1]) // meter to wmc-z
        const wmcz2meter = 1.0 / meter2wmcz // wmc-z to meter
        const meter2wdz = worldSize_wd * meter2wmcz // meter -> WD-z

        /////// Camera-Pos /////////////////////////////////////////////////////
        const cameraPos_wmc = transform.getFreeCameraOptions().position
        if (!cameraPos_wmc) return []
        const cameraAltitude = cameraPos_wmc.z * wmcz2meter
        const cameraPos_wd = [worldSize_wd * cameraPos_wmc.x, worldSize_wd * cameraPos_wmc.y, cameraAltitude]
        const cameraHeight = (cameraAltitude - mapCenterAltitude) * meter2wdz // in pixel coords.

        /////// Frustum  //////////////////////////////////////////////////////
        const { invProjMatrix } = getMatrices(transform, -100.0)!
        this.frustum = Frustum.fromInvViewProjection(invProjMatrix!, transform.worldSize, maxTileZoom)

        ////// Tile-Picking /////////////////////////////////////////////////////
        const overscaledZ = reparseOverscaled ? mapMaxTileZoom : maxTileZoom
        const stack: QuadTileNode[] = []
        const coveringTilesList: CoveringTileNode[] = []
        if (transform.renderWorldCopies) {
            for (let i = 1; i <= NUM_WORLD_COPIES; i++) {
                stack.push(rootTileNode(-i))
                stack.push(rootTileNode(i))
            }
        }
        stack.push(rootTileNode(0))

        while (stack.length > 0) {
            const node = stack.pop()!
            const x = node.x
            const y = node.y
            const z = node.z
            let fullyVisible = node.fullyVisible

            // Step 1: Make intersection check to determine [ If frustum fully contains Aabb when fullyVisible == false || undefined ]
            if (!fullyVisible) {
                const intersect = isDEMTile
                    ? node.aabb.intersects(this.frustum)
                    : node.aabb.intersectsFlat(this.frustum)

                if (intersect === 0) continue // discard if not at all intersected

                fullyVisible = intersect === 2
            }

            // Step 2: Stop splitting and collect it [ If tile-z is maxTileZoom, or the tile is too far from the camera ]
            if (z === maxTileZoom || !shouldNodeSplit(node)) {
                const tileZoom = z === maxTileZoom ? overscaledZ : z
                /*
                    Calculate dx, dy in WD_Space
                    node.wrap << z is node.wrap * numTiles in node.z
                    if maxTileZoom is 3, node.z is 2, and node.x is 1,
                    then the size of this tile is equivalent to 2^(maxTileZoom - z) times larger than a maxTileZoom tile.
                */
                const dx = mapCenter_wd[0] - (0.5 + x + (node.wrap << z)) * (1 << (maxTileZoom - z))
                const dy = mapCenter_wd[1] - (y + 0.5)

                coveringTilesList.push({
                    x,
                    y,
                    z,
                    tileID: new OverscaledTileID(tileZoom, node.wrap, z, x, y),
                    wrap: node.wrap,
                    distance: Math.sqrt(dx * dx + dy * dy),
                })

                continue
            }

            // Step 3: Quadrant
            for (let i = 0; i < 4; i++) {
                /*   ————————————
                    |  0  |  1  |
                    ————————————
                    |  2  |  3  |
                    ————————————  */
                const childX = (x << 1) + (i % 2)
                const childY = (y << 1) + (i >> 1)

                const aabb = node.aabb.quadrant(i)

                if (isDEMTile) {
                    const minmax = getTileElevationMinMax(x, y, z)
                    aabb.min[2] = minmax.min
                    aabb.max[2] = minmax.max
                    aabb.center[2] = (minmax.min + minmax.max) / 2
                }

                const child: QuadTileNode = {
                    x: childX,
                    y: childY,
                    z: z + 1,
                    wrap: node.wrap,
                    aabb: aabb,
                    maxAltitude: maxElevation,
                    minAltitude: minElevation,
                    fullyVisible: fullyVisible,
                    shouldSplit: undefined,
                }

                stack.push(child)
            }
        }

        // Sort by distance to camera
        const cover = coveringTilesList.sort((a, b) => a.distance - b.distance).map((node) => node.tileID)
        return cover

        // local helper /////////////////////////////////////////////////
        /**
         * Creates a root tile node.
         * @param warp
         * @returns A QuadTileNode representing the world root tile.
         */
        function rootTileNode(warp: number): QuadTileNode {
            return {
                x: 0,
                y: 0,
                z: 0,
                wrap: warp,
                aabb: tileAABB(worldSize_wd, 0, 0, 0, warp, minElevation, maxElevation),
                maxAltitude: maxElevation,
                minAltitude: minElevation,
                fullyVisible: false,
            } as QuadTileNode
        }

        /**
         * Determines if the given tile node should be split based on `distance to the camera`.
         * @param node The tile node to evaluate.
         * @returns A boolean indicating whether the node should be split.
         */
        function shouldNodeSplit(node: QuadTileNode): boolean {
            if (node.z < minTileZoom) return true
            if (node.z >= maxTileZoom) return false
            if (node.shouldSplit != null) return node.shouldSplit

            const camera2corner: vec3 = [0, 0, 0]

            // Note: closest-point is cameraPos_wd if it is inside the camera AABB
            const closestCornerPoint = node.aabb.closestPoint(cameraPos_wd as vec3)
            vec3.sub(camera2corner, closestCornerPoint, cameraPos_wd as vec3)
            camera2corner[2] = isDEMTile ? camera2corner[2] * meter2wdz : cameraHeight

            const closestDistance = vec3.dot(camera2corner, transform._camera.forward())

            const distToSplit = 1 << (maxTileZoom - node.z) // default mode
            // const distToSplit = 1 << (maxTileZoom - node.z - 1); // lazy mode
            // let distToSplit = (1 << maxTileZoom - node.z + 1) // hurry mode

            if (closestDistance < distToSplit) {
                return true
            }

            // Border case: with tilt of 85 degrees, center could be outside max zoom distance, due to scale.
            // Ensure max zoom tiles over center.
            const closestPointToCenter = node.aabb.closestPoint(mapCenter_wd as vec3)
            return closestPointToCenter[0] === mapCenter_wd[0] && closestPointToCenter[1] === mapCenter_wd[1]
        }

        /**
         * Get dem tile`s min & max
         */
        function getTileElevationMinMax(_: number, __: number, ___: number): { min: number; max: number } {
            return {
                min: minElevation,
                max: maxElevation,
            }
        }
    }

    extendTileCover(coverTiles: Array<OverscaledTileID>) {
        const extendTileSet = new Set<number>()
        const extendTiles: Array<OverscaledTileID> = []

        for (const ozTile of coverTiles) {
            const parentOzTile = ozTile.parent()
            if (!parentOzTile) continue
            if (extendTileSet.has(parentOzTile.key)) continue
            extendTileSet.add(parentOzTile.key)
            extendTiles.push(parentOzTile)
        }
        return extendTiles
    }
}
