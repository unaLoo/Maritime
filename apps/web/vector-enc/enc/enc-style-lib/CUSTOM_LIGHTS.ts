// @ts-nocheck
import { CustomLayerInterface, Map, MercatorCoordinate } from 'mapbox-gl'
import { type ColorTableType } from './ColorTable'
import * as tilebelt from '@mapbox/tilebelt'
import { mat4 } from 'gl-matrix'

interface LightProp {
    CHARTID: number
    RCID: number
    OBJL: number
    OBJNAM: string
    NOBJNM: string
    CATEGORY: number
    VAL1: number
    VAL2: number
}

interface TileRenderBatch {
    id: string
    z: number
    x: number
    y: number
    ringBuffer: WebGLBuffer | null
    ringCount: number
    dashBuffer: WebGLBuffer | null // 包含 pos, angle, sec1, sec2 等合并数据
    dashCount: number
    isStale: boolean
}

export default class LIGHTSLAYER implements CustomLayerInterface {
    id: string = 'lights-layer'
    type: 'custom' = 'custom'
    renderingMode: '2d' | '3d' = '3d'
    map!: Map
    gl!: WebGL2RenderingContext
    colorTable: ColorTableType
    visible: boolean = true
    minimumZoom: number = 5

    // --- Programs ---
    ringProgram!: WebGLProgram
    ringVao!: WebGLVertexArrayObject

    dashLineProgram!: WebGLProgram
    dashLineVao!: WebGLVertexArrayObject

    // --- Data ---
    private tileBatches: Map<string, TileRenderBatch> = new window.Map()
    private mapUpdateHandler: Function

    // --- Matrices ---
    private modelMatrix = mat4.create()
    private mvpMatrix = mat4.create()

    // --- Config ---
    public pitchAlignment: 'map' | 'viewport' = 'map' // 默认贴地

    constructor(colors: ColorTableType) {
        this.colorTable = colors
        this.mapUpdateHandler = throttle(this.update.bind(this), 300)
    }

    onAdd(map: Map, gl: WebGL2RenderingContext): void {
        this.map = map
        this.gl = gl

        this._initRingProgram()
        this._initDashLineProgram()

        this.map.on('move', this.mapUpdateHandler as any) // 监听 move 而不是 moveend 以便更流畅
        setTimeout(() => this.update(), 500)
    }

    onRemove(map: Map, gl: WebGL2RenderingContext): void {
        this.map.off('move', this.mapUpdateHandler as any)
        this.tileBatches.forEach((batch) => {
            if (batch.ringBuffer) gl.deleteBuffer(batch.ringBuffer)
            if (batch.dashBuffer) gl.deleteBuffer(batch.dashBuffer)
        })
        this.tileBatches.clear()
    }

    render(gl: WebGL2RenderingContext, matrix: number[]): void {
        if (!this.visible || this.map.getZoom() < this.minimumZoom) return

        // 1. Config GL
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.disable(gl.DEPTH_TEST) // 灯光通常在最上层，可根据需求开启

        // 2. Prepare Uniforms & Constants
        const TILE_EXTENT = 8192.0
        const TILE_SIZE = 512.0
        const currentZoom = this.map.getZoom()

        // --- RENDER RINGS ---
        gl.useProgram(this.ringProgram)
        const uRingMatrix = gl.getUniformLocation(this.ringProgram, 'u_matrix')
        const uRingPxToUnits = gl.getUniformLocation(this.ringProgram, 'u_pixelsToTileUnits')

        this.tileBatches.forEach((batch) => {
            if (batch.ringCount === 0) return

            // 计算动态缩放因子：确保像素大小在屏幕上一致
            // 如果希望灯塔半径随地图缩放而变大(物理尺寸)，这里可以设为固定值 (TILE_EXTENT / TILE_SIZE)
            // 这里我们保持像素尺寸一致：
            const zoomDiff = currentZoom - batch.z
            const scaleFactor = Math.pow(2, zoomDiff)
            const pixelsToUnits = TILE_EXTENT / TILE_SIZE / scaleFactor

            gl.uniform1f(uRingPxToUnits, pixelsToUnits)

            // 计算 MVP 矩阵
            this.calcTileMVP(matrix, batch)
            gl.uniformMatrix4fv(uRingMatrix, false, this.mvpMatrix)

            gl.bindVertexArray(this.ringVao)

            // 重新绑定 Buffer 到 VAO (因为我们复用了同一个 VAO 但切换了 Buffer)
            // *优化提示*：更好的做法是每个 Tile 一个 VAO，或者在这里显式 bindBuffer + vertexAttribPointer
            // 这里为了代码简洁，复用 VAO 逻辑，但必须 bindBuffer
            gl.bindBuffer(gl.ARRAY_BUFFER, batch.ringBuffer)
            this.setupRingAttributes()

            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, batch.ringCount)
        })

        // --- RENDER DASH LINES ---
        gl.useProgram(this.dashLineProgram)
        const uDashMatrix = gl.getUniformLocation(this.dashLineProgram, 'u_matrix')
        const uDashPxToUnits = gl.getUniformLocation(this.dashLineProgram, 'u_pixelsToTileUnits')

        this.tileBatches.forEach((batch) => {
            if (batch.dashCount === 0) return

            const zoomDiff = currentZoom - batch.z
            const scaleFactor = Math.pow(2, zoomDiff)
            const pixelsToUnits = TILE_EXTENT / TILE_SIZE / scaleFactor

            gl.uniform1f(uDashPxToUnits, pixelsToUnits)

            this.calcTileMVP(matrix, batch)
            gl.uniformMatrix4fv(uDashMatrix, false, this.mvpMatrix)

            gl.bindVertexArray(this.dashLineVao)
            gl.bindBuffer(gl.ARRAY_BUFFER, batch.dashBuffer)
            this.setupDashAttributes()

            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, batch.dashCount)
        })

        gl.bindVertexArray(null)
    }

    private calcTileMVP(mapboxMatrix: number[], batch: TileRenderBatch) {
        const TILE_EXTENT = 8192.0
        const numTiles = 1 << batch.z
        const scale = 1.0 / (numTiles * TILE_EXTENT)

        mat4.identity(this.modelMatrix)
        mat4.translate(this.modelMatrix, this.modelMatrix, [batch.x / numTiles, batch.y / numTiles, 0])
        mat4.scale(this.modelMatrix, this.modelMatrix, [scale, scale, 1])
        mat4.multiply(this.mvpMatrix, mapboxMatrix as any, this.modelMatrix)
    }

    // -----------------------------------------------------------
    // Data Update & Batch Creation
    // -----------------------------------------------------------

    update() {
        this.syncTiles()
        this.map.triggerRepaint()
    }

    private syncTiles() {
        const map = this.map
        const sourceCache = map.style?._sourceCaches['symbol:POINT_COMMON_POINT']
        if (!sourceCache) return
        this.tileBatches.forEach((b) => (b.isStale = true))

        for (const id in sourceCache._tiles) {
            const tile = sourceCache._tiles[id]
            const tileKey = this.getTileKey(tile.tileID)

            if (this.tileBatches.has(tileKey)) {
                this.tileBatches.get(tileKey)!.isStale = false
                continue
            }

            // 数据过滤逻辑
            const features: any[] = []
            tile.querySourceFeatures(features, {
                sourceLayer: 'point_common',
                filter: [
                    'all',
                    ['==', ['get', 'OBJL'], 75],
                    ['match', ['get', 'CATEGORY'], [101, 102, 103, 104, 201, 202, 203, 204], true, false],
                ],
            })

            if (features.length > 0) {
                const batch = this.createTileBatch(tile.tileID, features)
                if (batch) this.tileBatches.set(tileKey, batch)
            }
        }

        // 清理旧瓦片
        this.tileBatches.forEach((batch, key) => {
            if (batch.isStale) {
                if (batch.ringBuffer) this.gl.deleteBuffer(batch.ringBuffer)
                if (batch.dashBuffer) this.gl.deleteBuffer(batch.dashBuffer)
                this.tileBatches.delete(key)
            }
        })
    }

    private createTileBatch(tileID: any, features: any[]): TileRenderBatch | null {
        const gl = this.gl
        const EXTENT = 8192
        const canonical = tileID.canonical
        // const tileBBox = tilebelt.tileToBBOX([canonical.x, canonical.y, canonical.z]);
        // const tileW = tileBBox[2] - tileBBox[0];
        // const tileH = tileBBox[3] - tileBBox[1];
        const tilesCount = Math.pow(2, canonical.z)

        // Arrays for Ring
        const ringData: number[] = [] // [x, y, r, g, b, ri, ro, sec1, sec2]
        // Arrays for Dash
        const dashData: number[] = [] // [x, y, angle, sec1, sec2] -> Simplified to just needed attributes

        const { ringFeatures, sectorRingFeatures } = this._classify(features)
        const allRingFeats = [...ringFeatures, ...sectorRingFeatures]

        // --- Process Rings ---
        for (const feat of allRingFeats) {
            const coords = feat.coord
            const mercator = MercatorCoordinate.fromLngLat(coords)
            // LngLat -> Tile Local (0-8192)
            // const localX = ((coords[0] - tileBBox[0]) / tileW) * EXTENT;
            // const localY = (1.0 - (coords[1] - tileBBox[1]) / tileH) * EXTENT;
            const localX = (mercator.x * tilesCount - canonical.x) * EXTENT
            const localY = (mercator.y * tilesCount - canonical.y) * EXTENT

            const { color, ri, ro, sec1, sec2 } = this._processRingAttributes(feat)

            // Push data
            ringData.push(localX, localY, color[0], color[1], color[2], ri, ro, sec1, sec2)
        }

        // --- Process Dashes ---
        // Dash lines logic: based on sectorRingFeatures
        for (const feat of sectorRingFeatures) {
            const coords = feat.coord
            const mercator = MercatorCoordinate.fromLngLat(coords)
            const localX = (mercator.x * tilesCount - canonical.x) * EXTENT
            const localY = (mercator.y * tilesCount - canonical.y) * EXTENT

            const sec1 = (feat.properties.VAL1 + 180) % 360
            const sec2 = (feat.properties.VAL2 + 180) % 360

            // Dash Line 1 (Start Angle)
            dashData.push(localX, localY, sec1)
            // Dash Line 2 (End Angle)
            dashData.push(localX, localY, sec2)
        }

        if (ringData.length === 0 && dashData.length === 0) return null

        // Create Buffers
        let ringBuffer = null
        if (ringData.length > 0) {
            ringBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, ringBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ringData), gl.STATIC_DRAW)
        }

        let dashBuffer = null
        if (dashData.length > 0) {
            dashBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, dashBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dashData), gl.STATIC_DRAW)
        }

        return {
            id: this.getTileKey(tileID),
            z: canonical.z,
            x: canonical.x,
            y: canonical.y,
            ringBuffer,
            ringCount: ringData.length / 9,
            dashBuffer,
            dashCount: dashData.length / 3,
            isStale: false,
        }
    }

    // -----------------------------------------------------------
    // Logic Helpers
    // -----------------------------------------------------------

    _classify(features: any[]) {
        const ringCats = [101, 102, 103, 104]
        const sectorRingCats = [201, 202, 203, 204]
        const ringFeatures: any[] = []
        const sectorRingFeatures: any[] = []

        features.forEach((feat) => {
            const props = feat.properties
            const item = { coord: feat.geometry.coordinates, properties: props }
            if (ringCats.includes(props.CATEGORY)) ringFeatures.push(item)
            else if (sectorRingCats.includes(props.CATEGORY)) sectorRingFeatures.push(item)
        })
        return { ringFeatures, sectorRingFeatures }
    }

    _processRingAttributes(feat: any) {
        const cat = feat.properties.CATEGORY
        const val1 = feat.properties.VAL1
        const val2 = feat.properties.VAL2

        let color = [1, 1, 1]
        let sec1 = 0,
            sec2 = 360,
            ri = 0,
            ro = 20

        // 简化字典逻辑
        if ([101, 201].includes(cat)) color = hexToRgb(this.colorTable.LITRD)
        else if ([102, 202].includes(cat)) color = hexToRgb(this.colorTable.LITGN)
        else if ([103, 203].includes(cat)) color = hexToRgb(this.colorTable.LITYW)
        else if ([104, 204].includes(cat)) color = hexToRgb(this.colorTable.CHMGD)

        if ([101, 102, 103, 104].includes(cat)) {
            // ri = val1 * 2
            ri = val1 * 1.2
            ro = ri + 5
        } else {
            sec1 = (val1 + 180) % 360
            sec2 = (val2 + 180) % 360
            // ri = 12 * 2
            ri = 12 * 1.2
            ro = ri + 5
        }

        return { color, ri, ro, sec1, sec2 }
    }

    getTileKey(tileID: any) {
        const c = tileID.canonical || tileID
        return `${c.z}/${c.x}/${c.y}`
    }

    // -----------------------------------------------------------
    // GL Initialization
    // -----------------------------------------------------------

    _initRingProgram() {
        const gl = this.gl
        // Vertex Shader: Map Aligned Logic
        const vertexSource = `#version 300 es
            precision highp float;

            in vec2 a_pos;    // Tile Local Coords (0-8192)
            in vec3 a_color;
            in float a_ri;    // Radius Inner (Pixels)
            in float a_ro;    // Radius Outer (Pixels)
            in float a_sec1;
            in float a_sec2;

            uniform mat4 u_matrix;
            uniform float u_pixelsToTileUnits; // Transform Pixels -> Tile Units

            out vec3 v_color;
            out vec2 v_local_offset; // Offset in pixels (for distance calc)
            out float v_ri;
            out float v_ro;
            out float v_sec1;
            out float v_sec2;

            // Quad corners: -1 to 1
            const vec2 quad_offsets[4] = vec2[4](
                vec2(-1.0, -1.0), vec2(-1.0,  1.0),
                vec2( 1.0, -1.0), vec2( 1.0,  1.0)
            );

            void main() {
                // 1. Calculate geometry size in Tile Units
                // quad_offset * outer_radius * unit_scale
                vec2 offset_pixels = quad_offsets[gl_VertexID] * a_ro * 2.0; // Expand to bounding box
                vec2 offset_tile_units = offset_pixels * u_pixelsToTileUnits;

                vec2 final_pos = a_pos + offset_tile_units;

                gl_Position = u_matrix * vec4(final_pos, 0.0, 1.0);

                // Pass data to fragment
                v_local_offset = offset_pixels; 
                v_ri = a_ri;
                v_ro = a_ro;
                v_sec1 = a_sec1;
                v_sec2 = a_sec2;
                v_color = a_color;
            }
        `

        const fragmentSource = `#version 300 es
            precision highp float;

            in vec3 v_color;
            in vec2 v_local_offset; // Relative position in pixels
            in float v_ri;
            in float v_ro;
            in float v_sec1;
            in float v_sec2;

            out vec4 outColor;

            void main() {
                vec2 p = v_local_offset * 0.5; 
                float dist = length(p);

                // Basic Cull
                if (dist > v_ro || dist < v_ri) discard;

                // --- Angle Calc ---
                float currentAngle = degrees(atan(p.x, -p.y)); 
                currentAngle = mod(currentAngle + 360.0, 360.0);

                // --- Sector Logic ---
                bool inSector = false;
                if (v_sec1 <= v_sec2) {
                    // 比如 sec1 = 20, sec2 = 150, 那么有效区域应该是， 20 - 150
                    inSector = (currentAngle >= v_sec1 && currentAngle <= v_sec2);
                } else {
                    // 比如 sec1 = 150, sec2 = 20, 那么有效区域应该是， 150-360, 0-20
                    inSector = (currentAngle <= 360.0 && currentAngle >= v_sec1) || 
                        (currentAngle >= 0.0 && currentAngle <= v_sec2);
                }

                if (!inSector) discard;

                // --- Style ---
                float strokeWidth = 2.0; 
                float aa = 1.0; 
                vec3 strokeColor = vec3(0.0, 0.0, 0.0);

                // Edges
                float alphaOuter = 1.0 - smoothstep(v_ro - aa, v_ro, dist);
                float alphaInner = smoothstep(v_ri, v_ri + aa, dist);
                float shapeAlpha = alphaOuter * alphaInner;

                // Stroke
                float distToOuter = abs(dist - v_ro);
                float distToInner = abs(dist - v_ri);
                float distToEdge = min(distToOuter, distToInner);
                float borderFactor = 1.0 - smoothstep(strokeWidth - aa, strokeWidth, distToEdge);
                
                vec3 finalColor = mix(v_color, strokeColor, borderFactor);

                outColor = vec4(finalColor, shapeAlpha);
            }
        `

        this.ringProgram = this.createProgram(gl, vertexSource, fragmentSource)
        this.ringVao = gl.createVertexArray()!
    }

    _initDashLineProgram() {
        const gl = this.gl
        const vertexSource = `#version 300 es
            precision highp float;

            in vec2 a_pos;   // Tile coords
            in float a_angle;

            uniform mat4 u_matrix;
            uniform float u_pixelsToTileUnits;

            const float u_length_px = 80.0;
            const float u_width_px = 2.0;

            out float v_dist_px;

            void main() {
                // VertexID 0,1,2,3 -> Line Segment
                // 0,1 = start; 2,3 = end
                float isEnd = (gl_VertexID == 2 || gl_VertexID == 3) ? 1.0 : 0.0;
                float side = (gl_VertexID == 1 || gl_VertexID == 3) ? 1.0 : -1.0;

                float len_px = isEnd * u_length_px;
                float width_px = side * u_width_px * 0.5;

                v_dist_px = len_px;

                // Rotate offset based on angle
                float rad = radians(a_angle);
                vec2 dir = vec2(sin(rad), -cos(rad)); // 0 deg = Up
                vec2 perp = vec2(dir.y, -dir.x); // Right

                vec2 offset_px = dir * len_px + perp * width_px;
                vec2 offset_units = offset_px * u_pixelsToTileUnits;

                gl_Position = u_matrix * vec4(a_pos + offset_units, 0.0, 1.0);
            }
        `

        const fragmentSource = `#version 300 es
            precision highp float;
            in float v_dist_px;
            
            const vec3 u_color = vec3(0.0, 0.0, 0.0);
            const float u_dash = 10.0;
            const float u_gap = 5.0;

            out vec4 outColor;

            void main() {
                if (mod(v_dist_px, u_dash + u_gap) > u_dash) discard;
                outColor = vec4(u_color, 1.0);
            }
        `

        this.dashLineProgram = this.createProgram(gl, vertexSource, fragmentSource)
        this.dashLineVao = gl.createVertexArray()!
    }

    setupRingAttributes() {
        const gl = this.gl
        const stride = 9 * 4 // 36 bytes
        // Locations
        const aPos = gl.getAttribLocation(this.ringProgram, 'a_pos')
        const aColor = gl.getAttribLocation(this.ringProgram, 'a_color')
        const aRi = gl.getAttribLocation(this.ringProgram, 'a_ri')
        const aRo = gl.getAttribLocation(this.ringProgram, 'a_ro')
        const aSec1 = gl.getAttribLocation(this.ringProgram, 'a_sec1')
        const aSec2 = gl.getAttribLocation(this.ringProgram, 'a_sec2')

        gl.enableVertexAttribArray(aPos)
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, stride, 0)
        gl.vertexAttribDivisor(aPos, 1)

        gl.enableVertexAttribArray(aColor)
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride, 8)
        gl.vertexAttribDivisor(aColor, 1)

        gl.enableVertexAttribArray(aRi)
        gl.vertexAttribPointer(aRi, 1, gl.FLOAT, false, stride, 20)
        gl.vertexAttribDivisor(aRi, 1)

        gl.enableVertexAttribArray(aRo)
        gl.vertexAttribPointer(aRo, 1, gl.FLOAT, false, stride, 24)
        gl.vertexAttribDivisor(aRo, 1)

        gl.enableVertexAttribArray(aSec1)
        gl.vertexAttribPointer(aSec1, 1, gl.FLOAT, false, stride, 28)
        gl.vertexAttribDivisor(aSec1, 1)

        gl.enableVertexAttribArray(aSec2)
        gl.vertexAttribPointer(aSec2, 1, gl.FLOAT, false, stride, 32)
        gl.vertexAttribDivisor(aSec2, 1)
    }

    setupDashAttributes() {
        const gl = this.gl
        const stride = 3 * 4 // pos(2) + angle(1)
        const aPos = gl.getAttribLocation(this.dashLineProgram, 'a_pos')
        const aAngle = gl.getAttribLocation(this.dashLineProgram, 'a_angle')

        gl.enableVertexAttribArray(aPos)
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, stride, 0)
        gl.vertexAttribDivisor(aPos, 1)

        gl.enableVertexAttribArray(aAngle)
        gl.vertexAttribPointer(aAngle, 1, gl.FLOAT, false, stride, 8)
        gl.vertexAttribDivisor(aAngle, 1)
    }

    createProgram(gl: WebGL2RenderingContext, vs: string, fs: string) {
        const p = gl.createProgram()!
        const v = gl.createShader(gl.VERTEX_SHADER)!
        const f = gl.createShader(gl.FRAGMENT_SHADER)!
        gl.shaderSource(v, vs)
        gl.compileShader(v)
        gl.shaderSource(f, fs)
        gl.compileShader(f)
        gl.attachShader(p, v)
        gl.attachShader(p, f)
        gl.linkProgram(p)
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(p), gl.getShaderInfoLog(v), gl.getShaderInfoLog(f))
        }
        return p
    }
}

// Helpers
function throttle(fn: Function, interval: number) {
    let last = 0
    return function (this: any, ...args: any[]) {
        const now = Date.now()
        if (now - last >= interval) {
            last = now
            fn.apply(this, args)
        }
    }
}

function hexToRgb(hex: string) {
    const m = hex.match(/\w\w/g)
    return m ? m.map((c) => parseInt(c, 16) / 255) : [1, 1, 1]
}
