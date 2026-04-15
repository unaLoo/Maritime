import { type CustomLayerInterface } from 'mapbox-gl'
import earcut, { flatten } from 'earcut'

// ==============
// 集成示例
// const terrainLayer = new TerrainLayer({
//     maskURL: '/mask/BH_BBOX.geojson',
//     terrainTileURL: '/TTB/test/{z}/{x}/{y}.png',
//     exaggeration: 30,
//     withContour: true,
//     withLighting: true,
//     elevationRange: [-15.5, 4.4],
//     shallowColor: [182, 153, 124],
//     deepColor: [22, 26, 33],
// })
// map.addLayer(terrainLayer)
// ==============


// ============================================
// Shader Code
// ============================================

const MESH_SHADER = `
#ifdef VERTEX_SHADER
precision highp int;
precision highp float;
precision highp usampler2D;

layout(location = 0) in vec2 a_position;

uniform mat4 u_matrix;
uniform float ep;
uniform float use_skirt;
uniform sampler2D float_dem_texture;
uniform vec2 u_dem_tl;
uniform float u_dem_size;
uniform float u_dem_scale;
uniform float u_skirt_height;
uniform float u_exaggeration;
uniform float u_offset_x;
uniform float u_offset_y;

const float MAPBOX_TILE_EXTENT = 8192.0;
const float SKIRT_OFFSET = 24575.0;
const float SKIRT_HEIGHT = 1000.0;

out float v_height;
out float is_skirt;
out vec3 v_meshNormal;

vec4 tileUvToDemSample(vec2 uv, float dem_size, float dem_scale, vec2 dem_tl) {
    vec2 pos = dem_size * (uv * dem_scale + dem_tl) + 1.0;
    vec2 f = fract(pos);
    return vec4((pos - f + 0.5) / (dem_size + 2.0), f);
}

float epsilon(float x) {
    return 0.000001 * x;
}

float singleElevation(vec2 apos) {
    vec2 uv = (u_dem_size * (apos / 8192.0 * u_dem_scale + u_dem_tl) + vec2(u_offset_x, u_offset_y)) / (u_dem_size + 2.0);
    return texture(float_dem_texture, uv).r + ep * 1e-6;
}

vec3 decomposeToPosAndSkirt(vec2 posWithComposedSkirt) {
    float skirt = float(posWithComposedSkirt.x >= SKIRT_OFFSET);
    vec2 pos = posWithComposedSkirt - vec2(skirt * SKIRT_OFFSET, 0.0);
    return vec3(pos, skirt);
}

vec3 calcMeshNormal(vec2 apos) {
    float factor = 1.0;
    float b = singleElevation(apos + vec2(0.0, 1.0 * factor)) * u_exaggeration;
    float d = singleElevation(apos + vec2(-1.0 * factor, 0.0)) * u_exaggeration;
    float f = singleElevation(apos + vec2(1.0 * factor, 0.0)) * u_exaggeration;
    float h = singleElevation(apos + vec2(0.0, -1.0 * factor)) * u_exaggeration;

    float tr = f;
    float bl = b;
    float eS = h;
    float eW = d;

    vec3 dx = normalize(vec3(1.0, 0.0, (tr - eW)));
    vec3 dy = normalize(vec3(0.0, 1.0, (bl - eS)));
    vec3 normal = normalize(cross(dx, dy));
    return normal;
}

void main() {
    vec3 pos_skirt = decomposeToPosAndSkirt(a_position);
    vec2 pos = pos_skirt.xy;
    float skirt = pos_skirt.z;

    float height = singleElevation(pos);
    float z = height * u_exaggeration - skirt * u_skirt_height * use_skirt;

    gl_Position = u_matrix * vec4(pos.xy, z, 1.0);

    vec3 meshNormal = calcMeshNormal(pos);

    v_height = height;
    is_skirt = skirt;
    v_meshNormal = meshNormal;
}
#endif

#ifdef FRAGMENT_SHADER
precision highp int;
precision highp float;
precision highp usampler2D;

in float v_height;
in vec3 v_meshNormal;

out vec4 outColor;


void main() {
    outColor = vec4(v_height, v_meshNormal);
}
#endif
`

const MASK_SHADER = `
#ifdef VERTEX_SHADER

#define PI 3.141592653589793
#define RAD_TO_DEG 180.0/PI
#define DEG_TO_RAD PI/180.0

layout(location = 0) in vec4 aPosition;

out vec2 SSpos;

float mercatorXfromLng(float lng) {
    return (180.0 + lng) / 360.0;
}
float mercatorYfromLat(float lat) {
    return (180.0 - (RAD_TO_DEG * log(tan(PI / 4.0 + lat / 2.0 * DEG_TO_RAD)))) / 360.0;
}
vec2 mercatorFromLngLat(vec2 lngLat) {
    return vec2(mercatorXfromLng(lngLat.x), mercatorYfromLat(lngLat.y));
}

uniform mat4 u_matrix;

void main() {
    vec4 CSpos = u_matrix * vec4(mercatorFromLngLat(aPosition.xy), 0.0, 1.0);
    gl_Position = CSpos;
    SSpos = CSpos.xy / CSpos.w * 0.5 + 0.5;
}

#endif
#ifdef FRAGMENT_SHADER
precision lowp float;

uniform sampler2D depth_texture;
in vec2 SSpos;

out float FragColor;
void main() {
    FragColor = 1.0;
}
#endif
`

const CONTOUR_SHADER = `
#ifdef VERTEX_SHADER

precision highp float;

const float SKIRT_HEIGHT_FLAG = 24575.0;

out vec2 texcoords;

vec4[] vertices = vec4[4](vec4(-1.0, -1.0, 0.0, 0.0), vec4(1.0, -1.0, 1.0, 0.0), vec4(-1.0, 1.0, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0));

void main() {
    vec4 attributes = vertices[gl_VertexID];
    gl_Position = vec4(attributes.xy, 0.0, 1.0);
    texcoords = attributes.zw;
}

#endif

#ifdef FRAGMENT_SHADER

precision highp int;
precision highp float;
precision highp usampler2D;

const float SKIRT_HEIGHT_FLAG = 24575.0;

in vec2 texcoords;

uniform sampler2D meshTexture;
uniform sampler2D paletteTexture;
uniform sampler2D maskTexture;

uniform vec2 e;
uniform float interval;
uniform float withContour;
uniform float withLighting;
uniform vec3 LightPos;
uniform float diffPower;
uniform vec3 shallowColor;
uniform vec3 deepColor;
uniform float u_threshold;

out vec4 fragColor;

const vec3 LightColor = vec3(1.0, 1.0, 1.0);
const vec3 specularColor = vec3(1.0, 1.0, 1.0);

vec2 decomposeHeight(float heightValue) {
    float skirt = float(heightValue >= SKIRT_HEIGHT_FLAG);
    float realHeight = heightValue - skirt * SKIRT_HEIGHT_FLAG;
    return vec2(realHeight, skirt);
}

vec4 loadTerrainInfo(vec2 uv, vec2 offset) {
    vec2 dim = vec2(textureSize(meshTexture, 0)) - 1.0;
    vec4 texel = texelFetch(meshTexture, ivec2(uv * dim + offset), 0);
    vec2 height_skirt = decomposeHeight(texel.r);
    return texel;
}

vec3 colorMapping(float elevation) {
    float normalizedElevation = (elevation - e.x) / (e.y - e.x);
    return mix(deepColor, shallowColor, normalizedElevation) / 255.0;
}

float epsilon(float x) {
    return 0.00001 * x;
}

int withinInterval(float elevation) {
    return int(elevation / interval);
}

float validFragment(vec2 uv) {
    return texture(maskTexture, uv).r;
}

float sigmoid(float x) {
    return 1.0 / (1.0 + exp(-x));
}

void main() {
    if(validFragment(texcoords) == 0.0) {
        return;
    }

    float factor = 1.5;
    vec4 M = loadTerrainInfo(texcoords, vec2(0.0, 0.0));
    vec4 N = loadTerrainInfo(texcoords, vec2(0.0, factor));
    vec4 E = loadTerrainInfo(texcoords, vec2(factor, 0.0));
    vec4 S = loadTerrainInfo(texcoords, vec2(0.0, -factor));
    vec4 W = loadTerrainInfo(texcoords, vec2(-factor, 0.0));

    int intervalM = withinInterval(M.r);
    int intervalN = withinInterval(N.r);
    int intervalE = withinInterval(E.r);
    int intervalS = withinInterval(S.r);
    int intervalW = withinInterval(W.r);

    float diff = 1.0;
    if(withLighting == 1.0) {
        vec3 lightDir = normalize(LightPos - vec3(0.0));
        vec3 norm = M.gba;
        diff = clamp(dot(norm, lightDir), 0.0, 1.0);
    }

    vec3 outColor = colorMapping(M.r) * diff;
    vec3 intervalColor = outColor;
    
    if(withContour == 1.0)
        if(intervalN > intervalM || intervalE > intervalM || intervalS > intervalM || intervalW > intervalM) {
            outColor = intervalColor * 0.8;
            if(intervalM == 0) {
                outColor = vec3(0.93);
            } else if(abs(float(intervalM) + 6.0) < 1e-5) {
                outColor = vec3(1.0, 0.23, 0.23);
            } else if(abs(float(intervalM) + 10.0) < 1e-5) {
                outColor = vec3(0.09, 0.62, 0.98);
            }
        }

    float alpha = 1.0;
    float originalElevation = M.r;

    // float normalizedElevation = (M.r - e.x) / (e.y - e.x);
    // alpha = alpha * (1.0 - normalizedElevation);

    if(originalElevation > u_threshold || originalElevation > 9998.0) {
        alpha = 0.0;
    }
    fragColor = vec4(outColor, alpha);
}

#endif
`

const DEPTH_RESTORE_SHADER = `
#ifdef VERTEX_SHADER
precision highp float;

out vec2 texcoords;

vec4[] vertices = vec4[4](vec4(-1.0, -1.0, 0.0, 0.0), vec4(1.0, -1.0, 1.0, 0.0), vec4(-1.0, 1.0, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0));

void main() {
    vec4 attributes = vertices[gl_VertexID];
    gl_Position = vec4(attributes.xy, 0.0, 1.0);
    texcoords = attributes.zw;
}

#endif

#ifdef FRAGMENT_SHADER

precision highp int;
precision highp float;
precision highp usampler2D;

in vec2 texcoords;
uniform sampler2D depthTexture;

void main() {
    float depth = texture(depthTexture, texcoords).r;
    gl_FragDepth = depth;
}   

#endif
`

const SHOW_SHADER = `
#ifdef VERTEX_SHADER

precision highp float;

out vec2 texcoords;

vec4[] vertices = vec4[4](vec4(-1.0, -1.0, 0.0, 0.0), vec4(1.0, -1.0, 1.0, 0.0), vec4(-1.0, 1.0, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0));

void main() {
    vec4 attributes = vertices[gl_VertexID];
    gl_Position = vec4(attributes.xy, 0.0, 1.0);
    texcoords = attributes.zw;
}

#endif

#ifdef FRAGMENT_SHADER

precision highp float;

in vec2 texcoords;
uniform sampler2D u_texture;

out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, texcoords);
    // fragColor = vec4(color.rgb, 0.9);
    fragColor = color;
}

#endif
`


// ============================================
// LRU Cache
// ============================================

class LRUCache {
    capacity: number
    cache: { [key: string]: any } = {}
    keys: string[] = []

    constructor(capacity: number) {
        this.capacity = capacity
        this.cache = {}
        this.keys = []
    }

    get(key: string): any {
        if (key in this.cache) {
            const index = this.keys.indexOf(key)
            if (index > -1) {
                this.keys.splice(index, 1)
            }
            this.keys.push(key)
            return this.cache[key]
        }
        return null
    }

    put(key: string, value: any) {
        if (key in this.cache) {
            const index = this.keys.indexOf(key)
            if (index > -1) {
                this.keys.splice(index, 1)
            }
            this.cache[key] = value
            this.keys.push(key)
        } else {
            this.cache[key] = value
            this.keys.push(key)

            if (this.keys.length > this.capacity) {
                const removedKey = this.keys.shift()
                if (removedKey) {
                    delete this.cache[removedKey]
                }
            }
        }
    }
}



// ============================================
// Main TerrainLayer Class
// ============================================

interface TerrainConfig {
    maskURL: string
    terrainTileURL: string
    exaggeration: number
    elevationRange: [number, number]
    withContour: boolean
    withLighting: boolean
    interval: number
    shallowColor: [number, number, number]
    deepColor: [number, number, number]
}

export default class TerrainLayer implements CustomLayerInterface {
    id = 'terrainLayer'
    type = 'custom' as const
    renderingMode = '3d' as const
    frame = 0.0

    // Map and GL context
    map: any
    gl: WebGL2RenderingContext | null = null

    // Configuration
    maskURL = '/mask/BH_BBOX.geojson'
    terrainTileURL = ''
    canvasWidth = 0
    canvasHeight = 0
    isReady = false

    // Rendering parameters
    u_offset_x = 1.5
    u_offset_y = 1.5
    exaggeration = 30.0
    withContour = 1.0
    withLighting = 1.0
    elevationRange: [number, number] = [-15.513999999999996, 4.3745000000000003]
    diffPower = 1.1
    use_skirt = 1.0

    shallowColor = [182, 153, 124]
    deepColor = [22, 26, 33]

    u_threshold = -2.0
    interval = 1.0
    ep = 100

    LightPos = [-0.03, 0.1, 0.86]

    // Shader programs
    meshProgram: WebGLProgram | null = null
    maskProgram: WebGLProgram | null = null
    contourProgram: WebGLProgram | null = null
    depthRestoreProgram: WebGLProgram | null = null
    showProgram: WebGLProgram | null = null

    // Textures
    maskTexture: WebGLTexture | null = null
    meshTexture: WebGLTexture | null = null
    meshDepthTexture: WebGLTexture | null = null
    contourCanvasTexture: WebGLTexture | null = null

    // Framebuffers
    maskFbo: WebGLFramebuffer | null = null
    meshFbo: WebGLFramebuffer | null = null
    contourFbo: WebGLFramebuffer | null = null

    // VAOs and buffers
    maskVao: WebGLVertexArrayObject | null = null
    meshVao_128: WebGLVertexArrayObject | null = null
    maskElements = 0
    meshElements_128 = 0

    // Data
    maskgeojson: any = null
    demStore: LRUCache | null = null

    // GUI
    gui: any = null

    // ============================================
    // Lifecycle
    // ============================================
    constructor(config: TerrainConfig) {
        this.maskURL = config.maskURL
        this.terrainTileURL = config.terrainTileURL
        this.exaggeration = config.exaggeration
        this.withContour = config.withContour ? 1.0 : 0.0
        this.withLighting = config.withLighting ? 1.0 : 0.0
        this.elevationRange = config.elevationRange
        this.shallowColor = config.shallowColor
        this.deepColor = config.deepColor
        this.interval = config.interval
    }

    async onAdd(map: any, gl: WebGL2RenderingContext) {
        this.map = map
        this.gl = gl

        enableAllExtensions(gl)
        this.demStore = new LRUCache(100)
        // this.initGUI()

        // Load mask GeoJSON
        const response = await fetch(this.maskURL)
        this.maskgeojson = await response.json()
        // Initialize proxy DEM sources (defer setTerrain until source is loaded)
        await this.initProxy(map)

        this.canvasWidth = gl.canvas.width
        this.canvasHeight = gl.canvas.height

        // Create shader programs
        this.meshProgram = createShaderFromCode(gl, MESH_SHADER)
        this.maskProgram = createShaderFromCode(gl, MASK_SHADER)
        this.contourProgram = createShaderFromCode(gl, CONTOUR_SHADER)
        this.depthRestoreProgram = createShaderFromCode(gl, DEPTH_RESTORE_SHADER)
        this.showProgram = createShaderFromCode(gl, SHOW_SHADER)

        // Create textures
        this.maskTexture = createTexture2D(gl, this.canvasWidth, this.canvasHeight, gl.R8, gl.RED, gl.UNSIGNED_BYTE)
        this.meshTexture = createTexture2D(gl, this.canvasWidth, this.canvasHeight, gl.RGBA32F, gl.RGBA, gl.FLOAT)
        this.meshDepthTexture = createTexture2D(
            gl,
            this.canvasWidth,
            this.canvasHeight,
            gl.DEPTH_COMPONENT32F,
            gl.DEPTH_COMPONENT,
            gl.FLOAT
        )
        this.contourCanvasTexture = createTexture2D(gl, this.canvasWidth, this.canvasHeight, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE)

        // Create framebuffers
        this.maskFbo = createFrameBuffer(gl, [this.maskTexture], null, null)
        this.meshFbo = createFrameBuffer(gl, [this.meshTexture], this.meshDepthTexture, null)
        this.contourFbo = createFrameBuffer(gl, [this.contourCanvasTexture], null, null)

        // Setup mask VAO
        const { vertexData, indexData } = parseMultipolygon(this.maskgeojson)
        const maskPosBuffer = createVBO(gl, vertexData)
        const maskIdxBuffer = createIBO(gl, indexData)
        this.maskElements = indexData.length

        this.maskVao = gl.createVertexArray()!
        gl.bindVertexArray(this.maskVao)
        gl.enableVertexAttribArray(0)
        gl.bindBuffer(gl.ARRAY_BUFFER, maskPosBuffer)
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, maskIdxBuffer)
        gl.bindVertexArray(null)

        // Setup mesh VAO
        const { meshElements, meshVao } = this.createTerrainGridsVao(128)
        this.meshElements_128 = meshElements
        this.meshVao_128 = meshVao
        this.isReady = true
    }

    render(gl: WebGL2RenderingContext, matrix: any) {
        if (!this.isReady) {
            return
        }
        this.frame++

        const terrain = this.map.painter.terrain
        const tr = this.map.transform

        const mercatorMatrix = matrix


        const tileIDs = this.getTiles2()
        const skirt = skirtHeight(tr.zoom, this.exaggeration, terrain.sourceCache._source.tileSize)
        const sourceCache = terrain.proxySourceCache

        // ============================================
        // Pass 1: Terrain Mesh Pass
        // ============================================

        if (!this.meshProgram || !this.meshFbo || !this.meshVao_128) return

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.meshFbo)
        gl.viewport(0.0, 0.0, this.canvasWidth, this.canvasHeight)
        gl.clearColor(9999.0, 0.0, 0.0, 0.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.disable(gl.BLEND)

        gl.clear(gl.DEPTH_BUFFER_BIT)
        gl.enable(gl.DEPTH_TEST)
        gl.depthFunc(gl.LESS)

        gl.useProgram(this.meshProgram)
        gl.bindVertexArray(this.meshVao_128)


        gl.uniform1f(gl.getUniformLocation(this.meshProgram, 'u_offset_x'), this.u_offset_x)
        gl.uniform1f(gl.getUniformLocation(this.meshProgram, 'u_offset_y'), this.u_offset_y)
        gl.uniform1f(gl.getUniformLocation(this.meshProgram, 'ep'), this.ep)
        gl.uniform1f(gl.getUniformLocation(this.meshProgram, 'u_exaggeration'), this.exaggeration)
        gl.uniform1f(gl.getUniformLocation(this.meshProgram, 'use_skirt'), this.use_skirt)
        gl.uniform1f(gl.getUniformLocation(this.meshProgram, 'u_skirt_height'), skirt)

        for (const coord of tileIDs) {
            const tile = sourceCache.getTile(coord)
            if (!tile) continue

            const demTile = this.demStore!.get(coord.key)
            if (!demTile) continue
            const demTexture = demTile.demTexture?.texture
            if (!demTexture) continue

            const proxyId = tile.tileID.canonical
            const demId = demTile.tileID.canonical
            const demScaleBy = Math.pow(2, demId.z - proxyId.z)
            const dem_tl = [proxyId.x * demScaleBy % 1, proxyId.y * demScaleBy % 1]
            const dem_size = demTile.demTexture.size[0] - 2

            const tileMatrix = coord.projMatrix

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, demTexture)

            gl.uniform1i(gl.getUniformLocation(this.meshProgram, 'float_dem_texture'), 0)
            gl.uniform2fv(gl.getUniformLocation(this.meshProgram, 'u_dem_tl'), dem_tl)
            gl.uniform1f(gl.getUniformLocation(this.meshProgram, 'u_dem_size'), dem_size)
            gl.uniform1f(gl.getUniformLocation(this.meshProgram, 'u_dem_scale'), demScaleBy)
            gl.uniformMatrix4fv(gl.getUniformLocation(this.meshProgram, 'u_matrix'), false, tileMatrix)

            gl.drawElements(gl.TRIANGLES, this.meshElements_128, gl.UNSIGNED_SHORT, 0)
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        // ============================================
        // Pass 2: Mask Pass
        // ============================================

        if (!this.maskProgram || !this.maskFbo || !this.maskVao) return

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.maskFbo)
        gl.viewport(0.0, 0.0, this.canvasWidth, this.canvasHeight)
        gl.clearColor(0.0, 0.0, 0.0, 0.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.useProgram(this.maskProgram)
        gl.bindVertexArray(this.maskVao)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.meshDepthTexture)
        gl.uniform1i(gl.getUniformLocation(this.maskProgram, 'depth_texture'), 0)
        gl.uniformMatrix4fv(gl.getUniformLocation(this.maskProgram, 'u_matrix'), false, mercatorMatrix)

        gl.drawElements(gl.TRIANGLES, this.maskElements, gl.UNSIGNED_SHORT, 0)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        // ============================================
        // Pass 3: Contour Pass
        // ============================================

        if (!this.contourProgram || !this.contourFbo) return

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.contourFbo)
        gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height)

        gl.disable(gl.BLEND)
        gl.useProgram(this.contourProgram)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.meshTexture)
        gl.activeTexture(gl.TEXTURE2)
        gl.bindTexture(gl.TEXTURE_2D, this.maskTexture)

        gl.uniform1i(gl.getUniformLocation(this.contourProgram, 'meshTexture'), 0)
        gl.uniform1i(gl.getUniformLocation(this.contourProgram, 'maskTexture'), 2)
        gl.uniform2fv(gl.getUniformLocation(this.contourProgram, 'e'), this.elevationRange)
        gl.uniform1f(gl.getUniformLocation(this.contourProgram, 'interval'), this.interval)
        gl.uniform1f(gl.getUniformLocation(this.contourProgram, 'withContour'), this.withContour)
        gl.uniform1f(gl.getUniformLocation(this.contourProgram, 'withLighting'), this.withLighting)
        gl.uniform3fv(gl.getUniformLocation(this.contourProgram, 'LightPos'), this.LightPos)
        gl.uniform1f(gl.getUniformLocation(this.contourProgram, 'diffPower'), this.diffPower)
        gl.uniform3fv(gl.getUniformLocation(this.contourProgram, 'shallowColor'), this.shallowColor as any)
        gl.uniform3fv(gl.getUniformLocation(this.contourProgram, 'deepColor'), this.deepColor as any)
        gl.uniform1f(gl.getUniformLocation(this.contourProgram, 'u_threshold'), this.u_threshold)

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        // ============================================
        // Pass 4: Show Pass - Display final result to screen
        // ============================================

        if (!this.showProgram) return

        gl.useProgram(this.showProgram)
        gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height)

        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.contourCanvasTexture)
        gl.uniform1i(gl.getUniformLocation(this.showProgram, 'u_texture'), 0)

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        // ============================================
        // Pass 5: Depth Restore Pass (Optional)
        // ============================================

        if (!this.depthRestoreProgram) return

        gl.colorMask(false, false, false, false)
        gl.depthMask(true)

        gl.enable(gl.DEPTH_TEST)
        gl.clear(gl.DEPTH_BUFFER_BIT)

        gl.useProgram(this.depthRestoreProgram)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.meshDepthTexture)
        gl.uniform1i(gl.getUniformLocation(this.depthRestoreProgram, 'depthTexture'), 0)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        gl.colorMask(true, true, true, true)
    }

    // ============================================
    // Helper Methods
    // ============================================

    private getTiles2(): any[] {
        const terrain = this.map.painter.terrain
        const sourceCache = terrain.proxySourceCache

        if (!sourceCache) return []

        const accumulatedDrapes: any[] = []
        const proxies = terrain.proxiedCoords[sourceCache.id]
        if (!proxies) return []

        for (const proxy of proxies) {
            const tile = sourceCache.getTileByID(proxy.proxyTileKey)
            if (!tile) continue
            accumulatedDrapes.push(tile.tileID)

            const prevDemTile = terrain.prevTerrainTileForTile[tile.tileID.key]
            const nextDemTile = terrain.terrainTileForTile[tile.tileID.key]
            if (prevDemTile && prevDemTile.demTexture) {
                this.demStore!.put(tile.tileID.key, prevDemTile)
            }
            if (nextDemTile && nextDemTile.demTexture) {
                this.demStore!.put(tile.tileID.key, nextDemTile)
            }
        }
        return accumulatedDrapes
    }

    private createTerrainGridsVao(element: number = 512): { meshElements: number; meshVao: WebGLVertexArrayObject } {
        if (!this.gl) throw new Error('GL context not initialized')

        const { vertices, indices } = createGrid(8192, element + 1)

        const gl = this.gl
        const vbo = createVBO(gl, new Float32Array(vertices))
        const ebo = createIBO(gl, indices)

        const vao = gl.createVertexArray()!
        gl.bindVertexArray(vao)
        gl.enableVertexAttribArray(0)
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo)
        gl.bindVertexArray(null)

        return { meshElements: indices.length, meshVao: vao }
    }

    private async initProxy(map: any) {
        const sourceId = 'underwater-dem-1'
        map.addSource(sourceId, {
            type: 'raster-dem',
            // tiles: ['/TTB/test/{z}/{x}/{y}.png'],
            tiles: [this.terrainTileURL],
            tileSize: 256,
            maxzoom: 14,
        })

        // Wait for DEM source to be ready before enabling terrain to reduce blank white period.
        await this.waitForSourceLoaded(map, sourceId, 8000)
        map.setTerrain({ source: sourceId, exaggeration: this.exaggeration })
        map.triggerRepaint()
    }

    private waitForSourceLoaded(map: any, sourceId: string, timeoutMs: number): Promise<void> {
        return new Promise((resolve) => {
            if (map.isSourceLoaded?.(sourceId)) {
                resolve()
                return
            }

            let resolved = false
            const finalize = () => {
                if (resolved) return
                resolved = true
                map.off('sourcedata', onSourceData)
                clearTimeout(timer)
                resolve()
            }

            const onSourceData = (event: any) => {
                if (event?.sourceId !== sourceId) return
                if (map.isSourceLoaded?.(sourceId)) {
                    finalize()
                }
            }

            const timer = setTimeout(() => {
                // Timeout fallback: avoid blocking layer initialization forever.
                finalize()
            }, timeoutMs)

            map.on('sourcedata', onSourceData)
        })
    }

    // private initGUI() {
    //     if (typeof dat === 'undefined') return

    //     this.gui = new dat.GUI()
    //     this.gui.add(this, 'exaggeration', 0, 100).step(1).onChange((value: number) => { this.map.setTerrain({ 'exaggeration': value }); this.map.triggerRepaint(); })
    //     this.gui.add(this, 'withContour', 0, 1).step(1).onChange((value: number) => { this.map.triggerRepaint(); })
    //     this.gui.add(this, 'withLighting', 0, 1).step(1).onChange((value: number) => { this.map.triggerRepaint(); })
    //     this.gui.add(this, 'interval', 0.1, 10, 0.1).onChange((value: number) => { this.map.triggerRepaint(); })
    //     this.gui.add(this, 'u_threshold', -4, 2, 0.01).onChange((value: number) => { this.map.triggerRepaint(); })
    // }
}


// ============================================
// Helper Functions
// ============================================

function enableAllExtensions(gl: WebGL2RenderingContext) {
    const extensions = gl.getSupportedExtensions()
    extensions?.forEach((ext) => {
        gl.getExtension(ext)
    })
}

function createVBO(gl: WebGL2RenderingContext, data: Float32Array | number[]): WebGLBuffer {
    const buffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    if (data instanceof Array) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    } else {
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    }
    return buffer
}

function createIBO(gl: WebGL2RenderingContext, data: Uint16Array | number[]): WebGLBuffer {
    const indexBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    if (data instanceof Array) {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW)
    } else {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)
    }
    return indexBuffer
}

function createShaderFromCode(gl: WebGL2RenderingContext, code: string): WebGLProgram {
    const compileShader = (source: string, type: GLenum): WebGLShader => {
        const versionDefinition = '#version 300 es\n'
        const module = gl.createShader(type)!
        if (type === gl.VERTEX_SHADER) {
            source = versionDefinition + '#define VERTEX_SHADER\n' + source
        } else if (type === gl.FRAGMENT_SHADER) {
            source = versionDefinition + '#define FRAGMENT_SHADER\n' + source
        }

        gl.shaderSource(module, source)
        gl.compileShader(module)
        if (!gl.getShaderParameter(module, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(module))
            gl.deleteShader(module)
            return null as any
        }
        return module
    }

    const vertexShaderStage = compileShader(code, gl.VERTEX_SHADER)
    const fragmentShaderStage = compileShader(code, gl.FRAGMENT_SHADER)

    const shader = gl.createProgram()!
    gl.attachShader(shader, vertexShaderStage)
    gl.attachShader(shader, fragmentShaderStage)
    gl.linkProgram(shader)

    if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(shader))
    }

    return shader
}

function createFrameBuffer(
    gl: WebGL2RenderingContext,
    textures?: WebGLTexture[] | null,
    depthTexture?: WebGLTexture | null,
    renderBuffer?: WebGLRenderbuffer | null
): WebGLFramebuffer {
    const frameBuffer = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)

    textures?.forEach((texture, index) => {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + index, gl.TEXTURE_2D, texture, 0)
    })

    if (depthTexture) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0)
    }

    if (renderBuffer) {
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderBuffer)
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    return frameBuffer
}

function createTexture2D(
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    internalFormat: GLenum,
    format: GLenum,
    type: GLenum,
    //   resource?: ArrayBufferView | ImageBitmap,
    filter: GLenum = gl.NEAREST,
    generateMips: boolean = false,
    repeat: boolean = false
): WebGLTexture {
    const texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, texture)

    if (repeat) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, generateMips ? gl.LINEAR_MIPMAP_LINEAR : filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)

    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null)

    gl.bindTexture(gl.TEXTURE_2D, null)

    return texture
}

function parseMultipolygon(geojson: any): { vertexData: number[]; indexData: number[] } {
    const coordinate = geojson.features[0].geometry.coordinates[0]
    const data = flatten(coordinate)
    const triangle = earcut(data.vertices, data.holes, data.dimensions)
    const vertices = data.vertices.flat()
    return {
        vertexData: vertices,
        indexData: triangle,
    }
}

function createGrid(TILE_EXTENT: number, count: number) {
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))
    const EXTENT = TILE_EXTENT
    const size = count + 2

    let vertices: number[] = []
    let indices: number[] = []
    let linesIndices: number[] = []

    const step = EXTENT / (count - 1)
    const gridBound = EXTENT + step / 2
    const bound = gridBound + step

    // Skirt offset 0x5FFF encodes skirt flag in the x position
    const skirtOffset = 24575

    for (let y = -step; y < bound; y += step) {
        for (let x = -step; x < bound; x += step) {
            const offset = (x < 0 || x > gridBound || y < 0 || y > gridBound) ? skirtOffset : 0
            const xi = clamp(Math.round(x), 0, EXTENT)
            const yi = clamp(Math.round(y), 0, EXTENT)
            vertices.push(xi + offset, yi)
        }
    }

    const skirtIndicesOffset = (size - 3) * (size - 3) * 2
    const quad = (i: number, j: number) => {
        const index = j * size + i
        indices.push(index + 1, index, index + size)
        indices.push(index + size, index + size + 1, index + 1)
    }

    for (let j = 1; j < size - 2; j++) {
        for (let i = 1; i < size - 2; i++) {
            quad(i, j)
        }
    }

    ;[0, size - 2].forEach((j) => {
        for (let i = 0; i < size - 1; i++) {
            quad(i, j)
            quad(j, i)
        }
    })

    return {
        vertices,
        indices,
        skirtIndicesOffset,
        linesIndices,
    }
}

function skirtHeight(zoom: number, terrainExaggeration: number, tileSize: number): number {
    // Skirt height calculation is heuristic: provided value hides
    // seams between tiles and it is not too large: 9 at zoom 22, ~20000m at zoom 0.
    if (terrainExaggeration === 0) return 0;
    const exaggerationFactor = (terrainExaggeration < 1.0 && tileSize === 514) ? 0.25 / terrainExaggeration : 1.0;
    return 10 * Math.pow(1.5, 22 - zoom) * Math.max(terrainExaggeration, 1.0) * exaggerationFactor;
}