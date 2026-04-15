import { Tile } from '../data/tile/tile'
import { mat4 } from 'gl-matrix'
import BaseStyleLayer from './BaseStyleLayer'
import TileManager from '../data/tile/tile_manager'
import RunTime from '../Runtime'
import { TileEvent, type TemporalScalarData } from '../data/tile/tile_util'
import { createProgram, createTexture2DArray } from '../util/gl'

type TemporalScalarFieldLayerConfig = {
    id: string
    sourceId: string
    globalMin: number
    globalMax: number
}

const EXTENT = 8192.0
const TILE_SIZE = 256 // ????

const vertexGLSL = `#version 300 es
    in vec2 a_position;
    
    uniform mat4 u_matrix;
    
    out vec2 v_texCoord;
    
    void main() {
        gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
        
        vec2 normalized_pos = a_position / ${EXTENT.toFixed(1)};
        v_texCoord = normalized_pos;
    }
`

const fragmentGLSL = `#version 300 es
    precision highp float;
    precision highp sampler2DArray;

    uniform sampler2DArray u_textureArray;
    uniform float u_time;
    uniform float u_maxLayer;
    uniform float u_min;
    uniform float u_max;

    in vec2 v_texCoord;
    out vec4 fragColor;

    vec3 colorRamp(float t) {
        t = clamp(t, 0.0, 1.0);
        vec3 c1 = vec3(0.0, 0.0, 1.0);
        vec3 c2 = vec3(0.0, 1.0, 1.0);
        vec3 c3 = vec3(1.0, 1.0, 0.0);
        vec3 c4 = vec3(1.0, 0.0, 0.0);
        if (t < 0.33) return mix(c1, c2, t * 3.0);
        if (t < 0.66) return mix(c2, c3, (t - 0.33) * 3.0);
        return mix(c3, c4, (t - 0.66) * 3.0);
    }

    void main() {
        float layer0 = floor(u_time);
        float layer1 = layer0 + 1.0;
        float t = fract(u_time);

        float val0 = texture(u_textureArray, vec3(v_texCoord, layer0)).r;
        float val;
        if (layer1 > u_maxLayer || t < 0.001) {
            val = val0;
        } else {
            float val1 = texture(u_textureArray, vec3(v_texCoord, layer1)).r;
            bool isValid0 = val0 > -9000.0;
            bool isValid1 = val1 > -9000.0;

            if (!isValid0 && !isValid1) {
                fragColor = vec4(0.0);
                discard;
                return;
            }

            if (isValid0 && isValid1) {
                val = mix(val0, val1, t);
            } else if (isValid0) {
                val = val0;
            } else {
                val = val1;
            }
        }

        if (val < -9000.0) {
            fragColor = vec4(0.0);
            discard;
            return;
        }

        float normalized = (val - u_min) / (u_max - u_min);
        fragColor = vec4(colorRamp(normalized), 0.5);
    }
`

export default class TemporalScalarFieldLayer implements BaseStyleLayer {
    id!: string
    sourceId!: string
    globalMin!: number
    globalMax!: number
    ready: boolean = false
    readyTiles: Tile[] = []
    tileManager!: TileManager
    runtime!: RunTime

    // ??????????????????????
    currentTime: number = 0

    onTileUpdate: (e: TileEvent) => void = () => { }

    // WebGL Context & Resources
    private gl: WebGL2RenderingContext | null = null
    private program: WebGLProgram | null = null
    private vao: WebGLVertexArrayObject | null = null

    // Uniform Locations
    private u_matrix_loc: WebGLUniformLocation | null = null
    private u_time_loc: WebGLUniformLocation | null = null
    private u_maxLayer_loc: WebGLUniformLocation | null = null
    private u_min_loc: WebGLUniformLocation | null = null
    private u_max_loc: WebGLUniformLocation | null = null

    // Texture Cache: Map<tileKey, WebGLTexture>
    private textureCache: Map<string, WebGLTexture> = new Map()

    constructor(config: TemporalScalarFieldLayerConfig) {
        Object.assign(this, config)
        this.onTileUpdate = this._onTileUpdate.bind(this)
    }

    private _onTileUpdate(_e: TileEvent) {
        if (!this.gl) return

        this.readyTiles = this.tileManager?.getReadyTiles(this.sourceId) || []

        const activeKeys = new Set<string>()

        // 1. ????readyTile ??????Texture2DArray
        for (const tile of this.readyTiles) {
            const key = tile.overscaledTileID.key.toString()
            activeKeys.add(key)

            const temporalData = tile.temporalScalarData
            if (!temporalData || temporalData.steps === 0) {
                continue
            }

            // ??????????????????
            if (this.textureCache.has(key)) {
                continue
            }

            // ?? Texture2DArray
            const texture = this.createTextureArray(this.gl, temporalData)
            if (texture) {
                this.textureCache.set(key, texture)
            }
        }

        // 2. 清理不再使用的纹理
        for (const [key, texture] of this.textureCache.entries()) {
            if (!activeKeys.has(key)) {
                this.gl?.deleteTexture(texture)
                this.textureCache.delete(key)
            }
        }

        // ????
        this.runtime?.requestRepaint()
    }

    private createTextureArray(gl: WebGL2RenderingContext, data: TemporalScalarData): WebGLTexture | null {
        return createTexture2DArray(gl, TILE_SIZE, TILE_SIZE, data.steps, gl.R32F, gl.RED, gl.FLOAT, data.body, gl.LINEAR)
    }

    private initGL(gl: WebGL2RenderingContext) {
        this.program = createProgram(gl, vertexGLSL, fragmentGLSL, {
            label: 'TemporalScalarFieldLayer',
        })

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(this.program))
            return
        }

        // --- Uniform Locations ---
        this.u_matrix_loc = gl.getUniformLocation(this.program, 'u_matrix')
        this.u_time_loc = gl.getUniformLocation(this.program, 'u_time')
        this.u_maxLayer_loc = gl.getUniformLocation(this.program, 'u_maxLayer')
        this.u_min_loc = gl.getUniformLocation(this.program, 'u_min')
        this.u_max_loc = gl.getUniformLocation(this.program, 'u_max')

        // --- Quad (0 -> EXTENT) ---
        const vertices = new Float32Array([0, 0, EXTENT, 0, 0, EXTENT, 0, EXTENT, EXTENT, 0, EXTENT, EXTENT])

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)

        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

        const a_pos_loc = gl.getAttribLocation(this.program, 'a_position')
        gl.enableVertexAttribArray(a_pos_loc)
        gl.vertexAttribPointer(a_pos_loc, 2, gl.FLOAT, false, 0, 0)

        gl.bindVertexArray(null)
    }

    onAdd(runtime: RunTime, gl: WebGL2RenderingContext) {
        this.runtime = runtime
        this.gl = gl
        const tm = (this.tileManager = runtime.tileManager)

        this.initGL(gl)

        this.readyTiles = tm.getReadyTiles(this.sourceId)
        this._onTileUpdate({} as TileEvent)

        tm.onTileLoad(this.sourceId, this.onTileUpdate)
        this.ready = true
    }

    render(viewProjectionMatrix: mat4): void {
        if (!this.ready) return
        if (!this.runtime || !this.gl || !this.program || !this.vao) return

        const gl = this.gl
        const worldSize = this.runtime.map.transform.worldSize

        gl.useProgram(this.program)
        gl.bindVertexArray(this.vao)

        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        // gl.disable(gl.BLEND)

        gl.enable(gl.STENCIL_TEST)
        gl.clear(gl.STENCIL_BUFFER_BIT)
        gl.stencilMask(0xff)
        gl.stencilFunc(gl.NOTEQUAL, 1, 0xff)
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE)

        // ???? uniform ??  
        gl.uniform1f(this.u_min_loc, this.globalMin)
        gl.uniform1f(this.u_max_loc, this.globalMax)

        gl.activeTexture(gl.TEXTURE0)

        // ??????
        for (const tile of this.readyTiles) {
            const key = tile.overscaledTileID.key.toString()
            const texture = this.textureCache.get(key)

            if (!texture) continue

            // 确保时间步在有效范围内
            const temporalData = tile.temporalScalarData
            if (!temporalData || temporalData.steps === 0) continue

            // ?? currentTime ??????
            const maxLayer = temporalData.steps - 1
            const clampedTime = maxLayer > 0 ? this.currentTime % temporalData.steps : 0

            gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture)
            gl.uniform1f(this.u_time_loc, clampedTime)
            gl.uniform1f(this.u_maxLayer_loc, maxLayer)

            const tileMVP = mat4.create()
            const tilePosMatrix = tile.tilePosMatrix(worldSize)
            mat4.mul(tileMVP, viewProjectionMatrix, tilePosMatrix)

            gl.uniformMatrix4fv(this.u_matrix_loc, false, tileMVP as unknown as Float32Array)

            gl.drawArrays(gl.TRIANGLES, 0, 6)
        }

        // Cleanup
        gl.bindVertexArray(null)
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null)
    }

    onRemove(): void {
        this.tileManager?.offTileLoad(this.sourceId, this.onTileUpdate)

        if (this.gl) {
            this.textureCache.forEach((tex) => this.gl?.deleteTexture(tex))
            this.textureCache.clear()
            if (this.program) this.gl.deleteProgram(this.program)
            if (this.vao) this.gl.deleteVertexArray(this.vao)
        }
    }

    // ????????????????????????
    setTime(time: number): void {
        this.currentTime = time
        this.runtime?.requestRepaint()
    }
}

