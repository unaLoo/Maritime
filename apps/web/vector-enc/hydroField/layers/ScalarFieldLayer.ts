import { Tile } from '../data/tile/tile'
import { mat4 } from 'gl-matrix'
import BaseStyleLayer from './BaseStyleLayer'
import TileManager from '../data/tile/tile_manager'
import RunTime from '../Runtime'
import { TileEvent } from '../data/tile/tile_util'
import { createProgram, createTexture2DFromImage } from '../util/gl'

type ScalarFieldLayerConfig = {
	id: string
	sourceId: string
}

const EXTENT = 8192.0

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
    
    uniform sampler2D u_texture;
    in vec2 v_texCoord;
    out vec4 fragColor;

    vec3 colorRamp(float value) {
        float minTemp = -24.0;
        float maxTemp = 15.0;
        
        float t = clamp((value - minTemp) / (maxTemp - minTemp), 0.0, 1.0);
        
        vec3 lowColor = vec3(0.0, 0.0, 1.0);
        vec3 midColor = vec3(0.0, 1.0, 0.0);
        vec3 highColor = vec3(1.0, 0.0, 0.0);
        
        if (t < 0.5) {
            return mix(lowColor, midColor, t * 2.0);
        } else {
            return mix(midColor, highColor, (t - 0.5) * 2.0);
        }
    }

    void main() {
        vec4 texColor = texture(u_texture, v_texCoord);
        
        if (texColor.a < 0.1) discard;

        float r = texColor.r * 255.0;
        float g = texColor.g * 255.0;
        
        float temp = (r * 256.0 + g) / 100.0 - 100.0;

        if(temp < -99.0) discard; 

        fragColor = vec4(colorRamp(temp), 0.5);
        
        // Debug: temperature
        // fragColor = vec4(vec3(temp / 40.0), 1.0); 

        // Debug: tileBoundary
        if (v_texCoord.x < 0.005 || v_texCoord.y < 0.005) fragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`

export default class ScalarFieldLayer implements BaseStyleLayer {
	id!: string
	sourceId!: string
	ready: boolean = false
	readyTiles: Tile[] = []
	tileManager: TileManager | null = null
	runtime: RunTime | null = null

	onTileUpdate: (e: TileEvent) => void = () => {}

	// WebGL Context & Resources
	private gl: WebGL2RenderingContext | null = null
	private program: WebGLProgram | null = null
	private vao: WebGLVertexArrayObject | null = null

	// Uniform Locations
	private u_matrix_loc: WebGLUniformLocation | null = null
	private u_texture_loc: WebGLUniformLocation | null = null

	// Texture Cache
	private textureCache: Map<string, WebGLTexture> = new Map()

	constructor(config: ScalarFieldLayerConfig) {
		Object.assign(this, config)
		this.onTileUpdate = this._onTileUpdate.bind(this)
	}

	private _onTileUpdate(e: TileEvent) {
		if (!this.gl) return

		this.readyTiles = this.tileManager?.getReadyTiles(this.sourceId) || []
		console.log(this.readyTiles.map((t) => t.overscaledTileID.canonical.toString()))

		const activeKeys = new Set<string>()

		// 1. ?? upload
		for (const tile of this.readyTiles) {
			const key = tile.overscaledTileID.key.toString()
			activeKeys.add(key)

			if (this.textureCache.has(key)) continue

			const bitmap = tile.bitmap
			if (bitmap) {
				const texture = createTexture2DFromImage(this.gl, bitmap, this.gl.NEAREST)
				texture && this.textureCache.set(key, texture)
			}
		}

		// 2. ?? GC
		for (const [key, texture] of this.textureCache.entries()) {
			if (!activeKeys.has(key)) {
				this.gl?.deleteTexture(texture)
				this.textureCache.delete(key)
			}
		}

		// ????
		this.runtime?.requestRepaint()
	}

	private initGL(gl: WebGL2RenderingContext) {
		this.program = createProgram(gl, vertexGLSL, fragmentGLSL, {
			label: 'ScalarFieldLayer',
		})

		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			console.error('Program link error:', gl.getProgramInfoLog(this.program))
			return
		}

		// --- Uniform Loc ---
		this.u_matrix_loc = gl.getUniformLocation(this.program, 'u_matrix')
		this.u_texture_loc = gl.getUniformLocation(this.program, 'u_texture')

		// --- quad (0 -> EXTENT) ---
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
		this._onTileUpdate({} as any)

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
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

		gl.enable(gl.STENCIL_TEST)
		gl.clear(gl.STENCIL_BUFFER_BIT) // reset to 0
		gl.stencilMask(0xff) // 0xFF --> 11111111 --> ???????
		// gl.NOTEQUAL: ??(stencilValue & mask) != (ref & mask) ?????
		// ref = 1, mask = 0xFF
		// ???????????? Stencil ???? 1 (????0)??????
		gl.stencilFunc(gl.NOTEQUAL, 1, 0xff)

		// gl.KEEP: ???????????????????		// gl.REPLACE: ????????????????Stencil ???? ref ??(??1)
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE)

		gl.uniform1i(this.u_texture_loc, 0)
		gl.activeTexture(gl.TEXTURE0)

		for (const tile of this.readyTiles) {
			const key = tile.overscaledTileID.key.toString()
			let texture = this.textureCache.get(key)

			// ??stencil ?????????? fallback ??uvOrigin ??uvRatio
			if (!texture) continue

			gl.bindTexture(gl.TEXTURE_2D, texture)
			const tileMVP = mat4.create()
			const tilePosMatrix = tile.tilePosMatrix(worldSize)
			mat4.mul(tileMVP, viewProjectionMatrix, tilePosMatrix)

			gl.uniformMatrix4fv(this.u_matrix_loc, false, tileMVP as unknown as Float32Array)

			gl.drawArrays(gl.TRIANGLES, 0, 6)
		}

		// Cleanup
		gl.bindVertexArray(null)
		gl.bindTexture(gl.TEXTURE_2D, null)
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
}

