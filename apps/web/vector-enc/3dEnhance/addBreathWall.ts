import * as THREE from 'three'
import { ThreeMapLayer } from './ThreeMapLayer'

// ================================================================
// Shader Code
// ================================================================

const vertexShader = `
    attribute float aHeight;
    varying vec2 vUv;
    varying float vHeightRatio;
    varying vec3 vWorldPosition;

    void main() {
        vUv = uv;
        vHeightRatio = aHeight; // 0.0 (bottom) to 1.0 (top)
        
        vec3 pos = position;
        vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
`

const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uMinAlpha;
    uniform float uMaxAlpha;
    uniform float uBreathingFreq;

    varying vec2 vUv;
    varying float vHeightRatio;
    varying vec3 vWorldPosition;

    void main() {
        // Breathing effect: A(t) = α_min + (α_max - α_min) * (0.5 * sin(ωt) + 0.5)
        float breathing = sin(uBreathingFreq * uTime) * 0.5 + 0.5;
        float alpha = uMinAlpha + (uMaxAlpha - uMinAlpha) * breathing;
        
        // Fade out from top to bottom: opacity * (1.0 - v)
        float fadeFactor = 1.0 - vHeightRatio;
        
        // Final color with fade effect
        alpha *= fadeFactor;
        
        gl_FragColor = vec4(uColor, alpha);
    }
`

// ================================================================
// Interface & Types
// ================================================================

interface SecurityPolygonConfig {
    id: string
    geojson: any // GeoJSON Polygon
    height: number
    color: [number, number, number] | string // RGB in 0-1 range, or hex color
    minAlpha?: number // breathing effect min alpha (default 0.2)
    maxAlpha?: number // breathing effect max alpha (default 0.8)
    breathingFreq?: number // breathing frequency in Hz (default 1.0)
}


// ================================================================
// Utilities
// ================================================================

/**
 * Convert hex color or RGB array to THREE.Color
 */
function parseColor(
    color: [number, number, number] | string | number,
): THREE.Color {
    if (typeof color === 'string') {
        return new THREE.Color(color)
    } else if (typeof color === 'number') {
        return new THREE.Color(color)
    } else {
        return new THREE.Color(color[0], color[1], color[2])
    }
}

/**
 * Generate vertices for a vertical wall around a polygon
 * Returns: { positions, indices, heights }
 */
function buildWallGeometry(
    coordinates: number[][][],
    wallHeight: number,
    projectToScene: (lngLat: [number, number], altitude: number) => THREE.Vector3,
): {
    positions: number[]
    faces: number[]
    heights: number[]
} {
    const positions: number[] = []
    const faces: number[] = []
    const heights: number[] = []

    // Process all rings (supports Polygon outer ring, MultiPolygon, and MultiLineString)
    for (const ring of coordinates) {
        // Create vertices for each segment of the ring
        for (let i = 0; i < ring.length - 1; i++) {
            const [lng1, lat1] = ring[i]
            const [lng2, lat2] = ring[i + 1]

            const p1Bottom = projectToScene([lng1, lat1], 0)
            const p1Top = projectToScene([lng1, lat1], wallHeight)
            const p2Bottom = projectToScene([lng2, lat2], 0)
            const p2Top = projectToScene([lng2, lat2], wallHeight)

            const baseIdx = positions.length / 3

            // Add 4 vertices per segment (forming a quad)
            // Order: bottom-left, top-left, bottom-right, top-right
            positions.push(p1Bottom.x, p1Bottom.y, p1Bottom.z)
            heights.push(0.0) // bottom

            positions.push(p1Top.x, p1Top.y, p1Top.z)
            heights.push(1.0) // top

            positions.push(p2Bottom.x, p2Bottom.y, p2Bottom.z)
            heights.push(0.0) // bottom

            positions.push(p2Top.x, p2Top.y, p2Top.z)
            heights.push(1.0) // top

            // Triangle 1 (bottom-left, top-left, bottom-right)
            faces.push(baseIdx + 0, baseIdx + 1, baseIdx + 2)
            // Triangle 2 (top-left, top-right, bottom-right)
            faces.push(baseIdx + 1, baseIdx + 3, baseIdx + 2)
        }
    }

    return { positions, faces, heights }
}

// ================================================================
// Main Function
// ================================================================

const addBreathWall = (layer: ThreeMapLayer, config: SecurityPolygonConfig) => {
    const {
        id,
        geojson,
        height,
        color,
        minAlpha = 0.2,
        maxAlpha = 0.8,
        breathingFreq = 1.0,
    } = config


    // Build geometry
    // const coordinates = geojson.geometry.coordinates
    let coordinates: number[][][] = []
    if (geojson.geometry.type === 'Polygon') {
        coordinates = geojson.geometry.coordinates
    } else if (geojson.geometry.type === 'MultiPolygon') {
        coordinates = geojson.geometry.coordinates[0] // 取第一个 Polygon
    } else if (geojson.geometry.type === 'MultiLineString') {
        // 将所有的线段作为多个环来处理
        coordinates = geojson.geometry.coordinates as number[][][]
    }

    console.log(id, coordinates)

    const { positions, faces, heights } = buildWallGeometry(
        coordinates,
        height,
        (lngLat, altitude) => layer.projectToScene(lngLat, altitude),
    )

    // Create geometry
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    geometry.setAttribute('aHeight', new THREE.BufferAttribute(new Float32Array(heights), 1))
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(faces), 1))

    // Create material with shader
    const threeColor = parseColor(color)
    const uniforms = {
        uTime: { value: 0.0 },
        uColor: { value: threeColor },
        uMinAlpha: { value: minAlpha },
        uMaxAlpha: { value: maxAlpha },
        uBreathingFreq: { value: breathingFreq * Math.PI * 2 }, // convert Hz to rad/s
    }

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: false, // prevent z-fighting
    })

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material)
    layer.addToScene(id, mesh)

    // Add animation update
    layer.animatedObjects.push({
        tick: () => {
            material.uniforms.uTime.value += 1.0 / 60.0
        },
    })

    return mesh
}

export { addBreathWall, SecurityPolygonConfig }
