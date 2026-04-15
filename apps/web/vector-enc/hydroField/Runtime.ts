import { type Map as MapboxMap } from 'mapbox-gl'
import TileManager from './data/tile/tile_manager'
import { CustomLayerInterface } from 'mapbox-gl'
import { getProjMatrix } from './transform'
import type BaseStyleLayer from './layers/BaseStyleLayer'

export default class RunTime {
    map: MapboxMap
    tileManager: TileManager
    layers: BaseStyleLayer[] = []
    gl: WebGL2RenderingContext
    ready: boolean = false

    constructor(map: MapboxMap) {
        this.map = map
        this.gl = this.map.painter.context.gl
        this.tileManager = TileManager.getInstance(map)
        this.initRenderAgent()
    }

    private initRenderAgent() {
        const renderAgent: CustomLayerInterface = {
            id: '--RUNTIME--AGENT--',
            renderingMode: '3d',
            type: 'custom' as const,
            render: this.render.bind(this),
        }
        const maploadedHandler = () => {
            this.map.addLayer(renderAgent)
            console.log('Add!!')
            this.ready = true
        }

        if (this.map.loaded()) {
            maploadedHandler()
        } else {
            this.map.once('style.load', maploadedHandler)
        }
    }

    addLayer(ly: BaseStyleLayer) {
        this.layers.push(ly)
        ly.onAdd(this, this.gl)
        this.requestRepaint()
    }

    requestRepaint() {
        this.map.triggerRepaint()
    }

    render() {
        if (!this.ready) return

        ///// ????????????????
        // tileLogicExtent: 0~8192
        const tileLogicExtent = 8192.0

        // tilePixelSize: 512
        const tileLogicPixels = 512

        // worldSize = 512 * 2 ^ zoom
        const worldSize = 512 * 2 ** this.map.transform.zoom

        // from world space to clip space
        // @ts-ignore
        // const { projMatrix } = updateProjMatrix.call(this.map.transform, 0.0)
        // const viewProjectionMatrix = projMatrix
        const viewProjectionMatrix = getProjMatrix(this.map.transform) as mat4
        // const viewProjectionMatrix = this.map.transform.projMatrix

        const transformInfo = {
            viewProjectionMatrix,
            worldSize,
            tileLogicExtent,
            tileLogicPixels,
            zoom: this.map.transform.zoom,
        }

        this.layers.forEach((ly) => {
            ly.render(viewProjectionMatrix, transformInfo)
        })
    }

    remove() {
        for (let i = this.layers.length - 1; i >= 0; i--) {
            this.layers[i].onRemove()
        }
        this.layers = []
        this.ready = false
        if (this.map.getLayer('--RUNTIME--AGENT--')) {
            this.map.removeLayer('--RUNTIME--AGENT--')
        }
        TileManager.removeInstance()
    }
}





