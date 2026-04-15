import { Tile } from '../data/tile/tile'
import { mat4 } from 'gl-matrix'
import BaseStyleLayer from './BaseStyleLayer'
import TileManager from '../data/tile/tile_manager'
import RunTime from '../Runtime'
import type { TemporalVectorData, TileEvent } from '../data/tile/tile_util'
import { createFramebuffer, createProgram, createTexture2D, createTexture2DArray } from '../util/gl'

// ?????????????????????????????????????????????????????????????????????????????
// Config
// ?????????????????????????????????????????????????????????????????????????????

type TemporalVectorFieldLayerConfig = {
    id: string
    sourceId: string
    globalMinU: number
    globalMaxU: number
    globalMinV: number
    globalMaxV: number
    speedFactor?: number
}

// ?????????????????????????????????????????????????????????????????????????????
// Constants
// ?????????????????????????????????????????????????????????????????????????????

const EXTENT = 8192.0
const TILE_SIZE = 256
const PARTICLE_RES = 32 // 16??2??4??28??56
const PARTICLE_COUNT = PARTICLE_RES * PARTICLE_RES
const TRAIL_RES = 1024
const POS_OFFSET = 0.2

// ?????????????????????????????????????????????????????????????????????????????
// GLSL Shaders
// ?????????????????????????????????????????????????????????????????????????????

// ?? Shared quad vertex (UV from [0,1]) ??????????????????????????????????????
const quadVert = /* glsl */`#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
    v_uv = a_pos;
    gl_Position = vec4(a_pos * 2.0 - 1.0, 0.0, 1.0);
}`

// ?? Update Pass ??????????????????????????????????????????????????????????????
// ???????????????????????? speedTex??
// ????????RG32F ????????[-POS_OFFSET, 1+POS_OFFSET]?????/????
// ?? drawBuffers ????
//   layout(location = 0) ??posFBO   (RG32F)
//   layout(location = 1) ??speedFBO (R32F)
//
// noData ????
//   ???????raw.x <= -1000???? drop=1 ??????speed ????
//   Draw Pass ?? speed < 0.0001 ??????????????
//   ?????? [0,1] ?????????? noData ??????????????
const updateVert = /* glsl */`#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
    v_uv = a_pos;
    gl_Position = vec4(a_pos * 2.0 - 1.0, 0.0, 1.0);
}`

const updateFrag = /* glsl */`#version 300 es
precision highp float;
precision highp sampler2DArray;

in vec2 v_uv;

uniform sampler2D      u_pos;        // RG32F ???????ping-pong ??
uniform sampler2DArray u_velocity;   // ????????
uniform float u_timeStep;
uniform float u_randSeed;
uniform float u_speedFactor;
uniform float u_resetRate;

// ?????? + ????
layout(location = 0) out vec2  outPos;
layout(location = 1) out float outSpeed;

const float POS_OFFSET = ${POS_OFFSET};

// ?? ??????
const vec3 RAND_C = vec3(12.9898, 78.233, 4375.85453);
float rand(vec2 co) {
    float t = dot(RAND_C.xy, co);
    return fract(sin(t) * (RAND_C.z + t));
}

// ?? linearstep????????smoothstep ??S ?? ??
vec2 linearstep(vec2 edge0, vec2 edge1, vec2 x) {
    return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

void main() {
    ivec2 px  = ivec2(v_uv * float(textureSize(u_pos, 0).x));
    vec2  pos = texelFetch(u_pos, px, 0).xy;   // ??????????

    // ?????clamp ???? [0,1] ??
    vec4 raw    = texture(u_velocity, vec3(clamp(pos, 0.0, 1.0), u_timeStep));
    bool noData = (raw.x <= -1000.0 || raw.y <= -1000.0);
    vec2 vel    = noData ? vec2(0.0) : raw.xy;
    float speed = length(vel);

    vec2 seed = (pos + v_uv) * u_randSeed;

    float drop  = 0.0;
    vec2 newPos = pos;

    if (noData) {
        // ???????????speed ??
        // Draw Pass ?? speed < 0.0001 ????????
        drop = 1.0;
    } else {
        // ?? ???? ??
        newPos = pos + vel * vec2(1.0, -1.0) * u_speedFactor;

        // ?? ???? ??????????????????????????????
        // ?????? [-POS_OFFSET, 0] ??[1, 1+POS_OFFSET] ????????
        // ?????? persist_rate=1???????? persist_rate=0
        vec2 persistRate = pow(
            linearstep(vec2(-POS_OFFSET), vec2(0.0), newPos) *
            linearstep(vec2(1.0 + POS_OFFSET), vec2(1.0), newPos),
            vec2(4.0)
        );
        vec2 dp = vel * u_speedFactor;
        vec2 perFramePersist = pow(persistRate, abs(dp) / max(POS_OFFSET, 0.0001));
        float dropRate = 1.0 - perFramePersist.x * perFramePersist.y;

        drop = step(1.0 - dropRate - u_resetRate, rand(seed));
    }

    // ????????[0,1] ????
    vec2 randomPos   = vec2(rand(seed + 1.3), rand(seed + 2.1));
    vec2  finalPos   = mix(newPos, randomPos, drop);
    // ???? speed ???Draw Pass ???????????????
    float finalSpeed = mix(speed, 0.0, drop);

    outPos   = finalPos;    // ??COLOR_ATTACHMENT0 (posFBO,   RG32F)
    outSpeed = finalSpeed;  // ??COLOR_ATTACHMENT1 (speedFBO, R32F)
}
`

// ?? Draw Pass??????????????????????????????????????????????????????????????
// ??????????????????????????Trail FBO ???
// ????
//   1. pos = posRead + tileOffset ????????????????
//   2. ????????????? speedTex?Update Pass ????
//      ???????????????????????????????
//   3. speed < 0.0001 ????noData ??????????????
//   4. ??????????????
const drawVert = /* glsl */`#version 300 es
precision highp float;

in float a_index;

uniform sampler2D u_pos;    // RG32F????????????
uniform sampler2D u_speed;  // R32F???????????????
uniform float u_res;
uniform vec2  u_tileOffset; // ??????????????

out float v_speed;

void main() {
    ivec2 px = ivec2(
        mod(a_index, u_res),
        floor(a_index / u_res)
    );

    vec2  localPos = texelFetch(u_pos,   px, 0).xy;  // ??????
    float speed    = texelFetch(u_speed, px, 0).x;

    // ??????????????
    vec2 pos = localPos + u_tileOffset;

    // speed < 0.0001?noData ??????????????????
    if (speed < 0.0001) {
        gl_Position = vec4(-10.0, -10.0, 0.0, 1.0);
        v_speed = 0.0;
    } else {
        v_speed     = speed;
        gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
    }
    gl_PointSize = 4.0;
}
`

const drawFrag = /* glsl */`#version 300 es
precision mediump float;

in float v_speed;
out vec4 fragColor;
uniform vec2 u_range;

vec3 getRampColor(float speed) {
    float t = clamp((speed - u_range.x) / (u_range.y - u_range.x), 0.0, 1.0) * 7.0;
    int index = int(floor(t));
    float f = fract(t);

    vec3 c[8];
    c[0] = vec3(0.424, 0.549, 0.988); // 0x6c8cfc - ??
    c[1] = vec3(0.553, 0.639, 0.992); // 0x8d9ffd
    c[2] = vec3(0.671, 0.729, 0.996); // 0xabbafe
    c[3] = vec3(0.784, 0.820, 0.996); // 0xc8d1fe - ????
    c[4] = vec3(0.976, 0.765, 0.769); // 0xf9c3c4 - ?? (????
    c[5] = vec3(1.000, 0.537, 0.529); // 0xff8979
    c[6] = vec3(0.996, 0.412, 0.404); // 0xfe6967
    c[7] = vec3(0.976, 0.263, 0.275); // 0xf94346 - ??

    if (index == 0) return mix(c[0], c[1], f);
    if (index == 1) return mix(c[1], c[2], f);
    if (index == 2) return mix(c[2], c[3], f);
    if (index == 3) return mix(c[3], c[4], f);
    if (index == 4) return mix(c[4], c[5], f);
    if (index == 5) return mix(c[5], c[6], f);
    if (index == 6) return mix(c[6], c[7], f);

    return c[7];
}

void main() {
    vec3 color = getRampColor(v_speed);
    fragColor = vec4(color, 1.0);
}
`

// ?? Fade Pass ????????????????????????????????????????????????????????????????
const fadeFrag = /* glsl */`#version 300 es
precision mediump float;

in vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_fadeRate;
out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    // floor ?????? alpha ???????? Mapbox ???
    fragColor = floor(color * u_fadeRate * 255.0) / 255.0;
}
`

// ?? Screen Pass ??????????????????????????????????????????????????????????????
const screenVert = /* glsl */`#version 300 es
in vec2 a_pos;
uniform mat4  u_matrix;
uniform float u_extent;
out vec2 v_uv;
void main() {
    v_uv = a_pos;
    gl_Position = u_matrix * vec4(a_pos * u_extent, 0.0, 1.0);
}
`

const screenFrag = /* glsl */`#version 300 es
precision mediump float;
in vec2 v_uv;
uniform sampler2D u_texture;
out vec4 fragColor;
void main() {
    fragColor = texture(u_texture, v_uv);
}
`

// ?????????????????????????????????????????????????????????????????????????????
// Types
// ?????????????????????????????????????????????????????????????????????????????

type TileParticleState = {
    /**
     * RG32F ?????????????
     * ???????? (x, y)????[-POS_OFFSET, 1+POS_OFFSET]??
     */
    posTex: [WebGLTexture, WebGLTexture]
    /**
     * R32F ?????????????? posTex ???????
     * ??Update Pass ???Draw Pass ??????????
     * noData ?????????? 0?Draw Pass ?????????
     */
    speedTex: [WebGLTexture, WebGLTexture]
    /**
     * ?????? FBO????FBO ?? attach ??????posTex + speedTex??
     * Update Pass ?? combinedFBOs[1 - readIdx] ??????drawBuffers ?????
     */
    combinedFBOs: [WebGLFramebuffer, WebGLFramebuffer]
    /** RGBA8 ????????????*/
    trailTexs: WebGLTexture[]
    trailFBOs: WebGLFramebuffer[]
    /** ?????????????pos ??speed ????*/
    readIdx: number
    /** ?????Trail ???? */
    trailReadIdx: number
}

// ???????? + 4????8??
const NEIGHBOR_OFFSETS: Array<[number, number]> = [
    [-1, 0],  // ??
    [1, 0],  // ??
    [0, -1],  // ??
    [0, 1],  // ??
    [-1, -1],  // ??
    [1, -1],  // ??
    [-1, 1],  // ??
    [1, 1],  // ??
]

// ?????????????????????????????????????????????????????????????????????????????
// Helper????????RG32F????????????
// ?????????????????????????????????????????????????????????????????????????????

function createPosInitData(): Float32Array {
    const data = new Float32Array(PARTICLE_COUNT * 2)
    const esgtsa = (s: number): number => {
        s = Math.imul(s ^ 2747636419, 2654435769) >>> 0
        s = Math.imul(s ^ (s >>> 16), 2654435769) >>> 0
        s = Math.imul(s ^ (s >>> 16), 2654435769) >>> 0
        return s / 4294967296
    }
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        data[i * 2] = esgtsa(2 * i)       // x ??[0,1]
        data[i * 2 + 1] = esgtsa(2 * i + 1)   // y ??[0,1]
    }
    return data
}

// Main Class

export default class TemporalVectorFieldLayer implements BaseStyleLayer {
    id!: string
    sourceId!: string
    globalMinU!: number
    globalMaxU!: number
    globalMinV!: number
    globalMaxV!: number
    speedRange: [number, number] = [0, 1]
    speedFactor: number = 0.00012
    ready: boolean = false
    readyTiles: Tile[] = []
    tileManager!: TileManager
    runtime!: RunTime
    currentTime: number = 0

    onTileUpdate: (e: TileEvent) => void = () => { }

    private gl: WebGL2RenderingContext | null = null

    private updateProgram: WebGLProgram | null = null
    private drawProgram: WebGLProgram | null = null
    private fadeProgram: WebGLProgram | null = null
    private screenProgram: WebGLProgram | null = null

    // VAO????quad?Update / Fade / Screen ????
    private quadVao: WebGLVertexArrayObject | null = null
    // VAO??????Draw Pass ??
    private particleVao: WebGLVertexArrayObject | null = null

    private animateFrameId: number = 0

    /** key ??????????sampler2DArray??*/
    private velocityCache: Map<string, WebGLTexture> = new Map()
    /** key ????/????????*/
    private particleStateCache: Map<string, TileParticleState> = new Map()

    // ?? Uniform location ?? ?????????????????????????????????????????????????

    private updateLoc: Record<string, WebGLUniformLocation | null> = {}
    private drawLoc: Record<string, WebGLUniformLocation | null> = {}
    private fadeLoc: Record<string, WebGLUniformLocation | null> = {}
    private screenLoc: Record<string, WebGLUniformLocation | null> = {}

    constructor(config: TemporalVectorFieldLayerConfig) {
        Object.assign(this, config)

        this.speedRange[0] = Math.sqrt(this.globalMinU ** 2 + this.globalMinV ** 2)
        this.speedRange[1] = Math.sqrt(this.globalMaxU ** 2 + this.globalMaxV ** 2)

        // console.log('[TemporalVectorFieldLayer] speedRange:', this.speedRange)

        this.onTileUpdate = this._onTileUpdate.bind(this)
        this.animate = this.animate.bind(this)
    }


    private getNeighborTiles(
        targetTile: Tile
    ): Array<{ tile: Tile; tileOffset: [number, number] }> {
        const { z, x, y } = targetTile.overscaledTileID.canonical
        const tilesPerRow = 1 << z
        const result: Array<{ tile: Tile; tileOffset: [number, number] }> = []

        for (const [dx, dy] of NEIGHBOR_OFFSETS) {
            const nx = (x + dx + tilesPerRow) % tilesPerRow  
            const ny = y + dy
            if (ny < 0 || ny >= tilesPerRow) continue          

            const neighbor = this.readyTiles.find(t => {
                const c = t.overscaledTileID.canonical
                return c.z === z && c.x === nx && c.y === ny
            })
            if (!neighbor) continue

            result.push({ tile: neighbor, tileOffset: [dx, dy] })
        }
        return result
    }


    private _onTileUpdate(_e: TileEvent) {
        if (!this.gl) return
        this.readyTiles = this.tileManager?.getReadyTiles(this.sourceId) ?? []
        const activeKeys = new Set<string>()

        for (const tile of this.readyTiles) {
            const key = tile.overscaledTileID.key.toString()
            activeKeys.add(key)

            const temporalData = tile.temporalVectorData
            if (!temporalData || temporalData.steps === 0) continue

            if (!this.velocityCache.has(key)) {
                const tex = this.createTextureArray(this.gl, temporalData)
                if (tex) this.velocityCache.set(key, tex)
            }
            if (!this.particleStateCache.has(key)) {
                this.particleStateCache.set(key, this.createTileParticleState(this.gl))
            }
        }

        // ?????????????
        for (const key of [...this.velocityCache.keys()]) {
            if (activeKeys.has(key)) continue

            this.gl.deleteTexture(this.velocityCache.get(key)!)
            this.velocityCache.delete(key)

            const ps = this.particleStateCache.get(key)
            if (ps) this.destroyTileParticleState(this.gl, ps)
            this.particleStateCache.delete(key)
        }
    }

    // ?? ???? ?????????????????????????????????????????????????????????????

    /**
     * ????????????
     *   - posTex[2]       : RG32F??????(x, y)????
     *   - speedTex[2]     : R32F?????????????? pos ?? readIdx
     *   - combinedFBOs[2] : ??????FBO?Update Pass ??drawBuffers ???????
     *   - trailTexs[2]    : RGBA8??????????
     */
    private createTileParticleState(gl: WebGL2RenderingContext): TileParticleState {
        const posInitData = createPosInitData()
        const speedInitData = new Float32Array(PARTICLE_COUNT).fill(0)

        // ?? ?????RG32F???
        const posTex: [WebGLTexture, WebGLTexture] = [
            createTexture2D(gl, PARTICLE_RES, PARTICLE_RES, gl.RG32F, gl.RG, gl.FLOAT, posInitData, gl.NEAREST),
            createTexture2D(gl, PARTICLE_RES, PARTICLE_RES, gl.RG32F, gl.RG, gl.FLOAT, posInitData, gl.NEAREST),
        ]

        // ?? ?????R32F?format = gl.RED???
        const speedTex: [WebGLTexture, WebGLTexture] = [
            createTexture2D(gl, PARTICLE_RES, PARTICLE_RES, gl.R32F, gl.RED, gl.FLOAT, speedInitData, gl.NEAREST),
            createTexture2D(gl, PARTICLE_RES, PARTICLE_RES, gl.R32F, gl.RED, gl.FLOAT, speedInitData, gl.NEAREST),
        ]

        // ?? ??????FBO?combinedFBOs[i] attach posTex[i] + speedTex[i]???
        const combinedFBOs: [WebGLFramebuffer, WebGLFramebuffer] = [
            this.createCombinedFBO(gl, posTex[0], speedTex[0]),
            this.createCombinedFBO(gl, posTex[1], speedTex[1]),
        ]

        // ?? ?????RGBA8???
        const trailTexs: WebGLTexture[] = []
        const trailFBOs: WebGLFramebuffer[] = []
        for (let i = 0; i < 2; i++) {
            const tex = createTexture2D(
                gl, TRAIL_RES, TRAIL_RES,
                gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE,
                null, gl.LINEAR
            )
            const fbo = this.createSingleFBO(gl, tex)
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            trailTexs.push(tex)
            trailFBOs.push(fbo)
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        return {
            posTex, speedTex, combinedFBOs,
            trailTexs, trailFBOs,
            readIdx: 0,
            trailReadIdx: 0,
        }
    }

    private destroyTileParticleState(gl: WebGL2RenderingContext, ps: TileParticleState) {
        ps.posTex.forEach(t => gl.deleteTexture(t))
        ps.speedTex.forEach(t => gl.deleteTexture(t))
        ps.combinedFBOs.forEach(f => gl.deleteFramebuffer(f))
        ps.trailTexs.forEach(t => gl.deleteTexture(t))
        ps.trailFBOs.forEach(f => gl.deleteFramebuffer(f))
    }

    private createTextureArray(
        gl: WebGL2RenderingContext,
        data: TemporalVectorData
    ): WebGLTexture | null {
        return createTexture2DArray(gl, TILE_SIZE, TILE_SIZE, data.steps, gl.RG32F, gl.RG, gl.FLOAT, data.body, gl.LINEAR)
    }

    /**
     * ??????FBO????attach posTex?location 0?? speedTex?location 1???
     * Update Pass ?? gl.drawBuffers([COLOR_ATTACHMENT0, COLOR_ATTACHMENT1]) ??
     * ???draw call ???????????
     */
    private createCombinedFBO(
        gl: WebGL2RenderingContext,
        posTex: WebGLTexture,
        speedTex: WebGLTexture
    ): WebGLFramebuffer {
        return createFramebuffer(gl, [posTex, speedTex])
    }

    /** ??????FBO?Trail ????*/
    private createSingleFBO(gl: WebGL2RenderingContext, tex: WebGLTexture): WebGLFramebuffer {
        return createFramebuffer(gl, [tex])
    }

    // ?? GL ?????????????????????????????????????????????????????????????????

    private initGL(gl: WebGL2RenderingContext) {
        // R32F / RG32F ?? FBO color attachment ?????
        gl.getExtension('EXT_color_buffer_float')
        gl.getExtension('OES_texture_float_linear')

        this.updateProgram = createProgram(gl, updateVert, updateFrag, { label: 'TemporalVectorFieldLayer:update' })
        this.drawProgram = createProgram(gl, drawVert, drawFrag, { label: 'TemporalVectorFieldLayer:draw' })
        this.fadeProgram = createProgram(gl, quadVert, fadeFrag, { label: 'TemporalVectorFieldLayer:fade', bindAttribLocations: { a_pos: 0 } })
        this.screenProgram = createProgram(gl, screenVert, screenFrag, { label: 'TemporalVectorFieldLayer:screen', bindAttribLocations: { a_pos: 0 } })

        const cacheLocations = (
            prog: WebGLProgram,
            names: string[],
            target: Record<string, WebGLUniformLocation | null>
        ) => names.forEach(n => { target[n] = gl.getUniformLocation(prog, n) })

        cacheLocations(this.updateProgram!, [
            'u_pos', 'u_velocity', 'u_timeStep',
            'u_randSeed', 'u_speedFactor', 'u_resetRate',
        ], this.updateLoc)

        cacheLocations(this.drawProgram!, [
            'u_pos', 'u_speed',
            'u_res', 'u_tileOffset', 'u_range',
        ], this.drawLoc)

        cacheLocations(this.fadeProgram!, [
            'u_texture', 'u_fadeRate',
        ], this.fadeLoc)

        cacheLocations(this.screenProgram!, [
            'u_texture', 'u_matrix', 'u_extent',
        ], this.screenLoc)

        // ?? Quad VAO??????????[0,1]?????
        const quadVerts = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])
        this.quadVao = gl.createVertexArray()
        gl.bindVertexArray(this.quadVao)
        const quadBuf = gl.createBuffer()!
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
        gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW)
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

        // ?? Particle VAO??????0..PARTICLE_COUNT-1????
        const indices = new Float32Array(PARTICLE_COUNT)
        for (let i = 0; i < PARTICLE_COUNT; i++) indices[i] = i
        this.particleVao = gl.createVertexArray()
        gl.bindVertexArray(this.particleVao)
        const pBuf = gl.createBuffer()!
        gl.bindBuffer(gl.ARRAY_BUFFER, pBuf)
        gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW)
        const aIdx = gl.getAttribLocation(this.drawProgram!, 'a_index')
        gl.enableVertexAttribArray(aIdx)
        gl.vertexAttribPointer(aIdx, 1, gl.FLOAT, false, 0, 0)

        gl.bindVertexArray(null)
    }

    // ?? ???? ??????????????????????????????????????????????????????????????

    onAdd(runtime: RunTime, gl: WebGL2RenderingContext) {
        this.runtime = runtime
        this.gl = gl
        this.tileManager = runtime.tileManager
        this.initGL(gl)
        this.readyTiles = this.tileManager.getReadyTiles(this.sourceId)
        this._onTileUpdate({} as TileEvent)
        this.tileManager.onTileLoad(this.sourceId, this.onTileUpdate)
        this.ready = true
        this.animate()
    }

    private animate() {
        if (this.ready && this.runtime) this.runtime.requestRepaint()
        this.animateFrameId = requestAnimationFrame(this.animate)
    }

    // ?? ????????????????????????????????????????????????????????????????????

    render(viewProjectionMatrix: mat4): void {
        if (!this.ready || !this.gl) return
        if (!this.updateProgram || !this.drawProgram || !this.fadeProgram || !this.screenProgram) return

        const gl = this.gl
        const worldSize = this.runtime.map.transform.worldSize
        const mapZoom = this.runtime.map.transform.zoom

        gl.disable(gl.DEPTH_TEST)
        gl.disable(gl.STENCIL_TEST)
        gl.disable(gl.CULL_FACE)
        gl.colorMask(true, true, true, true)

        // =============================================================
        // Pass 1 ??Update
        // ?????????????????????????
        // ????posTex?RG32F?? speedTex?R32F?????drawBuffers ????
        // noData ?????????speed ???Draw Pass ???????
        // =============================================================
        gl.useProgram(this.updateProgram)
        gl.bindVertexArray(this.quadVao)
        gl.disable(gl.BLEND)

        for (const tile of this.readyTiles) {
            const key = tile.overscaledTileID.key.toString()
            const velTex = this.velocityCache.get(key)
            const ps = this.particleStateCache.get(key)
            const td = tile.temporalVectorData
            if (!velTex || !ps || !td || td.steps === 0) continue

            const timeStep = this.currentTime % td.steps
            const writeIdx = 1 - ps.readIdx

            // ??????FBO??????attachment
            gl.bindFramebuffer(gl.FRAMEBUFFER, ps.combinedFBOs[writeIdx])
            gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1])
            gl.viewport(0, 0, PARTICLE_RES, PARTICLE_RES)

            // TEXTURE0 ??u_pos????????
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, ps.posTex[ps.readIdx])
            gl.uniform1i(this.updateLoc['u_pos'], 0)

            // TEXTURE1 ??u_velocity????????
            gl.activeTexture(gl.TEXTURE1)
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, velTex)
            gl.uniform1i(this.updateLoc['u_velocity'], 1)

            gl.uniform1f(this.updateLoc['u_timeStep'], timeStep)
            gl.uniform1f(this.updateLoc['u_randSeed'], Math.random())
            gl.uniform1f(this.updateLoc['u_speedFactor'], this.speedFactor)
            gl.uniform1f(this.updateLoc['u_resetRate'], 0.003)

            gl.drawArrays(gl.TRIANGLES, 0, 6)

            // Ping-Pong???? flip
            ps.readIdx = writeIdx
        }

        // =============================================================
        // Pass 2 ??Draw?Fade + Particles??
        // ????????
        //   2a. ??????
        //   2b. ??????????tileOffset ??(0,0)??
        //   2c. ??????????tileOffset = (0,0)??
        //
        // ???????? speedTex????????????????
        // speed=0 ????noData ?????? Draw Vert ????????
        // =============================================================
        for (const targetTile of this.readyTiles) {
            const targetKey = targetTile.overscaledTileID.key.toString()
            const targetPS = this.particleStateCache.get(targetKey)
            const td = targetTile.temporalVectorData
            if (!targetPS || !td || td.steps === 0) continue

            // ?? 2a. Fade ?????????? ??
            const writeTrailIdx = 1 - targetPS.trailReadIdx
            gl.bindFramebuffer(gl.FRAMEBUFFER, targetPS.trailFBOs[writeTrailIdx])
            gl.drawBuffers([gl.COLOR_ATTACHMENT0])
            gl.viewport(0, 0, TRAIL_RES, TRAIL_RES)
            gl.disable(gl.BLEND)

            gl.useProgram(this.fadeProgram)
            gl.bindVertexArray(this.quadVao)

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, targetPS.trailTexs[targetPS.trailReadIdx])
            gl.uniform1i(this.fadeLoc['u_texture'], 0)
            gl.uniform1f(this.fadeLoc['u_fadeRate'], 0.983)
            gl.drawArrays(gl.TRIANGLES, 0, 6)

            // ?? 2b + 2c. ??? Trail FBO ??????????
            // FBO ????writeTrailIdx????????
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

            gl.useProgram(this.drawProgram)
            gl.bindVertexArray(this.particleVao)
            gl.uniform1f(this.drawLoc['u_res'], PARTICLE_RES)
            gl.uniform2f(this.drawLoc['u_range'], this.speedRange[0], this.speedRange[1])

            // ????????????????????????
            const neighbors = this.getNeighborTiles(targetTile)
            for (const { tile: neighborTile, tileOffset } of neighbors) {
                const nKey = neighborTile.overscaledTileID.key.toString()
                const nPS = this.particleStateCache.get(nKey)
                if (!nPS) continue
                this.drawParticlesToTrail(gl, nPS, tileOffset)
            }
            this.drawParticlesToTrail(gl, targetPS, [0, 0])

            // Trail Ping-Pong
            targetPS.trailReadIdx = writeTrailIdx
        }

        // =============================================================
        // Pass 3 ??Screen
        // ???????? Trail ?????????
        // =============================================================
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        // gl.enable(gl.DEPTH_TEST)

        gl.useProgram(this.screenProgram)
        gl.bindVertexArray(this.quadVao)

        for (const tile of this.readyTiles) {
            const ps = this.particleStateCache.get(tile.overscaledTileID.key.toString())
            if (!ps) continue

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, ps.trailTexs[ps.trailReadIdx])
            gl.uniform1i(this.screenLoc['u_texture'], 0)
            gl.uniform1f(this.screenLoc['u_extent'], EXTENT)

            const mvp = mat4.create()
            mat4.mul(mvp, viewProjectionMatrix, tile.tilePosMatrix(worldSize))
            gl.uniformMatrix4fv(this.screenLoc['u_matrix'], false, mvp as unknown as Float32Array)

            gl.drawArrays(gl.TRIANGLES, 0, 6)
        }

        gl.bindVertexArray(null)
    }

    /**
     * ??pState ????????????Trail FBO ???
     *
     * ????????speedTex ????????????????????????
     * speed=0 ????noData ?????? Draw Vert ????????????
     *
     * @param tileOffset ????????????????????
     *   ?? [0,0]???? [1,0]??????[-1,-1] ???
     */
    private drawParticlesToTrail(
        gl: WebGL2RenderingContext,
        pState: TileParticleState,
        tileOffset: [number, number]
    ) {
        const idx = pState.readIdx

        // TEXTURE0 ??u_pos??????
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, pState.posTex[idx])
        gl.uniform1i(this.drawLoc['u_pos'], 0)

        // TEXTURE1 ??u_speed?????????????+ noData ????
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, pState.speedTex[idx])
        gl.uniform1i(this.drawLoc['u_speed'], 1)

        gl.uniform2f(this.drawLoc['u_tileOffset'], tileOffset[0], tileOffset[1])

        gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT)
    }

    // ?? ?? ??????????????????????????????????????????????????????????????????

    onRemove(): void {
        this.tileManager?.offTileLoad(this.sourceId, this.onTileUpdate)
        cancelAnimationFrame(this.animateFrameId)
        if (!this.gl) return
        const gl = this.gl

        this.velocityCache.forEach(tex => gl.deleteTexture(tex))
        this.velocityCache.clear()

        this.particleStateCache.forEach(ps => this.destroyTileParticleState(gl, ps))
        this.particleStateCache.clear()

        if (this.updateProgram) gl.deleteProgram(this.updateProgram)
        if (this.drawProgram) gl.deleteProgram(this.drawProgram)
        if (this.fadeProgram) gl.deleteProgram(this.fadeProgram)
        if (this.screenProgram) gl.deleteProgram(this.screenProgram)
        if (this.quadVao) gl.deleteVertexArray(this.quadVao)
        if (this.particleVao) gl.deleteVertexArray(this.particleVao)
    }

    setTime(time: number): void {
        this.currentTime = time
    }
}

