import * as THREE from 'three'
import { ThreeMapLayer } from './ThreeMapLayer'

// ================================================================
// Shader Code - Procedural Beam Generation (No Texture)
// ================================================================

const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
        vUv = uv;
        
        vec3 pos = position;
        vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
`

const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uSpeed;
    uniform float uFrequency;
    uniform float uOpacity;

    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
        // 1. Time-based progress along the corridor
        float progress = vUv.x * uFrequency - uTime * uSpeed;
        
        // 2. Create scrolling sawtooth wave (0.0 to 1.0)
        float wave = fract(progress);
        
        // 3. Shape the light beam with smoothstep for smooth edges
        float beam = smoothstep(0.0, 0.3, wave) * smoothstep(1.0, 0.5, wave);
        
        // 4. Edge masking using sine wave - fade out at corridor edges
        float edgeMask = sin(vUv.y * 3.14159265);
        
        // 5. Final color with modulated opacity
        float alpha = beam * edgeMask * uOpacity;
        
        gl_FragColor = vec4(uColor, alpha);
    }
`

const fragmentShaderWithTexture = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uSpeed;
    uniform float uRepeat;
    uniform sampler2D uMainTexture;
    uniform float uOpacity;
    uniform float uArrowSize;

    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
        // Scrolled U coordinate for texture animation
        float scrolledU = mod(vUv.x * uRepeat - (uTime * uSpeed), 1.0);
        
        // Apply arrow size: only show texture in the first uArrowSize portion of each cycle
        // The rest (1.0 - uArrowSize) will be transparent (gap between arrows)
        if (scrolledU > uArrowSize) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
        }
        
        // Remap scrolledU to [0, 1] within the arrow size range
        float remappedU = scrolledU / uArrowSize;
        
        // Sample texture with remapped coordinates
        vec4 texColor = texture2D(uMainTexture, vec2(vUv.y, remappedU));
        
        // Edge fade to avoid harsh edges
        float edgeFade = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
        
        // Blend with color and apply opacity
        float alpha = texColor.a * edgeFade * uOpacity;
        
        gl_FragColor = vec4(uColor * texColor.rgb, alpha);
    }
`

// ================================================================
// Interface & Types
// ================================================================

interface DynamicDirectionConfig {
    id: string
    lineString: any // GeoJSON LineString coordinates or Feature<LineString>
    direction: 1 | -1 // 1 for forward, -1 for reverse
    speed: number // flow speed
    color: [number, number, number] | string | number // RGB or hex
    width?: number // corridor width (default 50 meters, affects V scale)
    opacity?: number // default 0.8
    frequency?: number // wave frequency for procedural shader (default 5.0)
    repeat?: number // texture repeat frequency (default 4.0)
    arrowSize?: number // texture visibility ratio (0.0-1.0, default 0.5 means 50% arrow, 50% gap)
    textureUrl?: string // optional texture URL, if provided use texture mode instead of procedural
    anchor?: [number, number]
    elevationOffset?: number // lift corridor above ground to reduce z-fighting (meters)
}

// ================================================================
// Utilities
// ================================================================

/**
 * Convert color to THREE.Color
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

// ================================================================
// Geometry Builder - LineString Based
// ================================================================

/**
 * Build geometry from a LineString center line
 * Creates a strip around the line with procedural UV mapping
 * 
 * U coordinate: progress along the line (0 to 1)
 * V coordinate: offset perpendicular to the line (0 = left, 1 = right)
 */
function buildDirectionGeometry(
    lineCoordinates: Array<[number, number]>,
    projectToScene: (lngLat: [number, number], altitude: number) => THREE.Vector3,
    direction: 1 | -1,
    width: number,
    elevationOffset: number,
): {
    positions: number[]
    uvs: number[]
    faces: number[]
    totalDistance: number
} {
    const n = lineCoordinates.length
    const positions: number[] = []
    const uvs: number[] = []
    const faces: number[] = []

    // Project center line points
    const centerPoints: THREE.Vector3[] = []
    const distances: number[] = [0]
    let totalDistance = 0

    for (let i = 0; i < n; i++) {
        const p = projectToScene(lineCoordinates[i], elevationOffset)
        centerPoints.push(p)

        if (i > 0) {
            totalDistance += p.distanceTo(centerPoints[i - 1])
            distances.push(totalDistance)
        }
    }

    // Build strip geometry along the line
    const halfWidth = width / 2

    for (let i = 0; i < n; i++) {
        const cp = centerPoints[i]
        const u =
            totalDistance > 0 ? distances[i] / totalDistance : 0
        const uFinal = direction === -1 ? 1.0 - u : u

        // Calculate perpendicular direction
        let tangent = new THREE.Vector3(0, 0, 1)
        let perpendicular = new THREE.Vector3(1, 0, 0)

        if (i < n - 1) {
            tangent = new THREE.Vector3()
                .subVectors(centerPoints[i + 1], cp)
                .normalize()
        } else if (i > 0) {
            tangent = new THREE.Vector3()
                .subVectors(cp, centerPoints[i - 1])
                .normalize()
        }

        // Calculate perpendicular (XZ plane)
        perpendicular = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()

        // Left offset point
        const leftOffset = new THREE.Vector3()
            .copy(cp)
            .addScaledVector(perpendicular, -halfWidth)
        positions.push(leftOffset.x, leftOffset.y, leftOffset.z)
        uvs.push(uFinal, 0.0)

        // Right offset point
        const rightOffset = new THREE.Vector3()
            .copy(cp)
            .addScaledVector(perpendicular, halfWidth)
        positions.push(rightOffset.x, rightOffset.y, rightOffset.z)
        uvs.push(uFinal, 1.0)

        // Create quad faces
        if (i < n - 1) {
            const idx = i * 2
            const nextIdx = (i + 1) * 2

            // Triangle 1
            faces.push(idx, nextIdx, idx + 1)
            // Triangle 2
            faces.push(nextIdx, nextIdx + 1, idx + 1)
        }
    }

    return { positions, uvs, faces, totalDistance }
}

// ================================================================
// Main Function
// ================================================================

const addDynamicDirection = (
    layer: ThreeMapLayer,
    config: DynamicDirectionConfig,
): Promise<{
    mesh: THREE.Mesh
    material: THREE.ShaderMaterial
    updateColor: (newColor: [number, number, number] | string | number) => void
    updateSpeed: (newSpeed: number) => void
    updateFrequency?: (newFrequency: number) => void
    updateRepeat?: (newRepeat: number) => void
    updateOpacity: (newOpacity: number) => void
    updateArrowSize?: (newArrowSize: number) => void
}> => {
    return new Promise((resolve) => {
        const {
            id,
            lineString,
            direction,
            speed,
            color,
            width = 50,
            opacity = 0.8,
            frequency = 5.0,
            repeat = 4.0,
            arrowSize = 0.5,
            textureUrl,
            anchor,
            elevationOffset = 1.0,
        } = config

        // Extract coordinates from lineString
        let coordinates: number[][]
        if (Array.isArray(lineString)) {
            coordinates = lineString
        } else if (lineString.type === 'LineString') {
            coordinates = lineString.coordinates
        } else if (
            lineString.geometry &&
            lineString.geometry.type === 'LineString'
        ) {
            coordinates = lineString.geometry.coordinates
        } else {
            throw new Error(
                'Invalid lineString: must be coordinates array or GeoJSON LineString',
            )
        }

        // Set anchor only if explicitly provided
        if (anchor) {
            layer.setAnchor(anchor)
        }

        // Build geometry
        const { positions, uvs, faces } = buildDirectionGeometry(
            coordinates as any,
            (lngLat, altitude) => layer.projectToScene(lngLat, altitude),
            direction,
            width,
            elevationOffset,
        )

        // Create geometry
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions), 3),
        )
        geometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(uvs), 2),
        )
        geometry.setIndex(
            new THREE.BufferAttribute(new Uint32Array(faces), 1),
        )
        geometry.computeVertexNormals()

        const threeColor = parseColor(color)

        // If textureUrl is provided, load texture and use texture-based shader
        if (textureUrl) {
            const textureLoader = new THREE.TextureLoader()
            textureLoader.load(textureUrl, (texture: THREE.Texture) => {
                // Configure texture
                texture.wrapS = THREE.RepeatWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
                texture.magFilter = THREE.LinearFilter
                texture.minFilter = THREE.LinearFilter

                // Create material with texture shader
                const uniforms = {
                    uTime: { value: 0.0 },
                    uColor: { value: threeColor },
                    uSpeed: { value: speed * (direction === -1 ? -1 : 1) },
                    uRepeat: { value: repeat },
                    uMainTexture: { value: texture },
                    uOpacity: { value: opacity },
                    uArrowSize: { value: arrowSize },
                }

                const material = new THREE.ShaderMaterial({
                    vertexShader,
                    fragmentShader: fragmentShaderWithTexture,
                    uniforms,
                    transparent: true,
                    side: THREE.DoubleSide,
                    depthTest: true,
                    depthWrite: false,
                    polygonOffset: true,
                    polygonOffsetFactor: -1,
                    polygonOffsetUnits: -1,
                })

                // Create mesh
                const mesh = new THREE.Mesh(geometry, material)
                layer.addToScene(id, mesh)

                // Animation update
                layer.animatedObjects.push({
                    tick: () => {
                        material.uniforms.uTime.value += 1.0 / 60.0
                    },
                })

                // Return control interface
                resolve({
                    mesh,
                    material,
                    updateColor: (
                        newColor: [number, number, number] | string | number,
                    ) => {
                        material.uniforms.uColor.value = parseColor(newColor)
                    },
                    updateSpeed: (newSpeed: number) => {
                        material.uniforms.uSpeed.value =
                            newSpeed * (direction === -1 ? -1 : 1)
                    },
                    updateRepeat: (newRepeat: number) => {
                        material.uniforms.uRepeat.value = newRepeat
                    },
                    updateOpacity: (newOpacity: number) => {
                        material.uniforms.uOpacity.value = newOpacity
                    },
                    updateArrowSize: (newArrowSize: number) => {
                        material.uniforms.uArrowSize.value = Math.max(0, Math.min(1, newArrowSize))
                    },
                })
            })
        } else {
            // Use procedural shader (no texture)
            const uniforms = {
                uTime: { value: 0.0 },
                uColor: { value: threeColor },
                uSpeed: { value: speed * (direction === -1 ? -1 : 1) },
                uFrequency: { value: frequency },
                uOpacity: { value: opacity },
            }

            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms,
                transparent: true,
                side: THREE.DoubleSide,
                depthTest: true,
                depthWrite: false,
                polygonOffset: true,
                polygonOffsetFactor: -1,
                polygonOffsetUnits: -1,
            })

            // Create mesh
            const mesh = new THREE.Mesh(geometry, material)
            layer.addToScene(id, mesh)

            // Animation update
            layer.animatedObjects.push({
                tick: () => {
                    material.uniforms.uTime.value += 1.0 / 60.0
                },
            })

            // Return control interface
            resolve({
                mesh,
                material,
                updateColor: (
                    newColor: [number, number, number] | string | number,
                ) => {
                    material.uniforms.uColor.value = parseColor(newColor)
                },
                updateSpeed: (newSpeed: number) => {
                    material.uniforms.uSpeed.value =
                        newSpeed * (direction === -1 ? -1 : 1)
                },
                updateFrequency: (newFrequency: number) => {
                    material.uniforms.uFrequency.value = newFrequency
                },
                updateOpacity: (newOpacity: number) => {
                    material.uniforms.uOpacity.value = newOpacity
                },
            })
        }
    })
}

export { addDynamicDirection, DynamicDirectionConfig }
