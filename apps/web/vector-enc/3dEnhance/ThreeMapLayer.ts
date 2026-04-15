import mapboxgl from 'mapbox-gl'
import * as THREE from 'three'

interface AnimatedObject {
    tick?: (delta: number) => void // 增加 tick 方法支持
    material?: any
}

export class ThreeMapLayer {
    id: string
    type: 'custom'
    renderingMode: '2d'

    map: mapboxgl.Map | null

    scene: THREE.Scene
    camera: THREE.Camera
    renderer: THREE.WebGLRenderer | null
    clock: THREE.Clock

    animatedObjects: AnimatedObject[] = []
    objects: Map<string, THREE.Object3D>

    // ！！！ 作为局部坐标的中心
    sceneAnchor: mapboxgl.MercatorCoordinate | null = null
    sceneScale: number = 1 // mercatorUnit per meter

    constructor(id = 'three-scene-layer') {
        this.id = id
        this.type = 'custom'
        this.renderingMode = '2d'
        this.map = null
        this.renderer = null
        this.objects = new Map()

        this.scene = new THREE.Scene()
        this.camera = new THREE.Camera()
        this.clock = new THREE.Clock()

        const ambientLight = new THREE.AmbientLight(0xffffff)
        const dirLight = new THREE.DirectionalLight(0xffffff, 1)
        dirLight.position.set(70, 500, 1000).normalize()
        this.scene.add(ambientLight, dirLight)
    }

    onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext) {
        this.map = map
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true,
            preserveDrawingBuffer: true,
        })
        this.renderer.autoClear = false
    }

    setAnchor(lngLat: [number, number]) {
        this.sceneAnchor = mapboxgl.MercatorCoordinate.fromLngLat(lngLat, 0)
        this.sceneScale = this.sceneAnchor.meterInMercatorCoordinateUnits() // ！！
    }

    /**
     * Core：将经纬度转换为相对于 Anchor 的局部坐标（单位：米, 右手系）
     */
    projectToScene(lngLat: [number, number], altitude: number = 0): THREE.Vector3 {
        if (!this.sceneAnchor) {
            throw new Error('Please call setAnchor() first!')
        }

        const target = mapboxgl.MercatorCoordinate.fromLngLat(lngLat, altitude)

        // 计算 Mercator 坐标差值
        const dx = target.x - this.sceneAnchor.x
        const dy = target.y - this.sceneAnchor.y
        const dz = target.z - this.sceneAnchor.z

        const xMeter = dx / this.sceneScale // sceneScale: unit per meter
        const yMeter = dy / this.sceneScale
        const zMeter = dz / this.sceneScale

        // mapbox 的 WebMercator 体系中，x向右，y向下，z向上 --> 左手坐标系
        // three/webgl 坐标系，x 向右，y向上，z射出屏幕
        return new THREE.Vector3(xMeter, zMeter, yMeter) // 交换 y,z 实现坐标系的转换
    }

    render(gl: WebGLRenderingContext, matrix: number[]) {
        if (!this.sceneAnchor || !this.renderer || !this.map) return

        /////////// Matrix //////////////////////////////////

        const rotateX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2)
        const transform = new THREE.Matrix4()
            .makeTranslation(this.sceneAnchor.x, this.sceneAnchor.y, this.sceneAnchor.z) // T
            .scale(new THREE.Vector3(this.sceneScale, -this.sceneScale, this.sceneScale)) // S
            .multiply(rotateX) // R
        // 数学表达： transform = T * S * R
        // 当一个物体右乘 transform 矩阵，相当于先自旋，再缩放，再平移

        const m = new THREE.Matrix4().fromArray(matrix)

        // Final camera.projectionMatrix = MapboxVPMatrix * AnchorTransform, (0,0,0) --> Anchor 点
        this.camera.projectionMatrix = m.multiply(transform)

        /////////// Tick Logic //////////////////////////////////

        const delta = this.clock.getDelta()
        this.animatedObjects.forEach((obj) => {
            if (obj.tick) {
                obj.tick(delta)
            } else if (obj.material && obj.material.uniforms && obj.material.uniforms['time']) {
                obj.material.uniforms['time'].value += delta
            }
        })

        /////////// Tick Render //////////////////////////////////
        this.renderer.resetState()
        this.renderer.render(this.scene, this.camera)
        this.map.triggerRepaint()
    }

    addToScene(id: string, object: THREE.Object3D) {
        this.objects.set(id, object)
        this.scene.add(object)
    }
}
