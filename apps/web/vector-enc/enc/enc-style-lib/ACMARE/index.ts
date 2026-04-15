import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'
import { createCAUSWYLayers } from './CAUSWY'
import { createLNDRGNLayers } from './LNDRGN'
import { createMARCULLayers } from './MARCUL'
import { createSNDWAVLayers } from './SNDWAV'
import { createICEARELayers } from './ICEARE'
import { createTUNNELLayers } from './TUNNEL'
import { createSBDARELayers } from './SBDARE'
import { createVEGATNLayers } from './VEGATN'
import { createUNSARELayers } from './UNSARE'
import { createBUAARELayers } from './BUAARE'
import { createBUISGLLayers } from './BUISGL'

export function createACMARELayers(colors: ColorTableType) {
    // style="color:CHBRN;fill_style:0;"
    const CHBRN_FILL_STYLE: FillLayerSpecification = {
        id: 'COMARE_CHBRN_FILL_0',
        type: 'fill',
        minzoom: 13,
        source: 'AREA_COMMON_AREA',
        'source-layer': 'area_common_polygon',
        filter: ['match', ['get', 'OBJL'], [12, 13, 35, 38, 49, 57, 59, 61, 65, 74, 84, 87, 95, 98, 117, 125, 128], true, false],
        layout: {},
        paint: {
            'fill-color': colors.CHBRN,
            'fill-opacity': 0.0
        },
    }
    // style="color:DEPVS;fill_style:0;"
    const DEPVS_FILL_STYLE: FillLayerSpecification = {
        id: 'COMARE_DEPVS_FILL_0',
        type: 'fill',
        source: 'AREA_COMMON_AREA',
        'source-layer': 'area_common_polygon',
        filter: ['match', ['get', 'OBJL'], [23, 45, 69, 79, 114], true, false],
        layout: {},
        paint: {
            'fill-color': colors.DEPVS,
        },
    }
    // style="color:LANDA;fill_style:0;"
    const LANDA_FILL_STYLE: FillLayerSpecification = {
        id: 'COMARE_LANDA_FILL_0',
        type: 'fill',
        source: 'AREA_COMMON_AREA',
        'source-layer': 'area_common_polygon',
        filter: ['match', ['get', 'OBJL'], [47, 116], true, false],
        layout: {},
        paint: {
            'fill-color': colors.LANDA,
        },
    }
    // style="color:CHMGD;fill_style:4;" !!!!
    const CHMGD_FILL_STYLE: FillLayerSpecification = {
        id: 'COMARE_PRCARE_FILL_0',
        type: 'fill',
        source: 'AREA_COMMON_AREA',
        'source-layer': 'area_common_polygon',
        filter: ['match', ['get', 'OBJL'], [96, 147, 149], true, false],
        layout: {},
        paint: {
            'fill-pattern': 'CHMGD_LINE',
        },
    }
    // style="color:CHGRD;fill_style:0;"
    const CHGRD_FILL_STYLE: FillLayerSpecification = {
        id: 'COMARE_CHGRD_FILL_0',
        type: 'fill',
        source: 'AREA_COMMON_AREA',
        'source-layer': 'area_common_polygon',
        filter: ['any', ['==', 'OBJL', 107], ['all', ['==', 'OBJL', 127], ['==', 'FillType', 1]]],
        layout: {},
        paint: {
            'fill-color': colors.CHGRD,
        },
    }
    // style="color:TRFCF;fill_style:0" tag="1"
    const TRFCF_FILL_STYLE: FillLayerSpecification = {
        id: 'COMARE_TRFCF_FILL_0',
        type: 'fill',
        source: 'AREA_COMMON_AREA',
        'source-layer': 'area_common_polygon',
        filter: ['==', ['get', 'OBJL'], 150],
        layout: {},
        paint: {
            'fill-color': colors.TRFCF,
        },
    }

    const buaare = createBUAARELayers(colors)
    const causwy = createCAUSWYLayers(colors)
    const lndrgn = createLNDRGNLayers(colors)
    const marcul = createMARCULLayers(colors)
    const sndwav = createSNDWAVLayers(colors)
    const iceare = createICEARELayers(colors)
    const tunnel = createTUNNELLayers(colors)
    const sbdare = createSBDARELayers(colors)
    const vegatn = createVEGATNLayers(colors)
    const unsare = createUNSARELayers(colors)
    const buisgl = createBUISGLLayers(colors)

    const fills: FillLayerSpecification[] = [
        CHBRN_FILL_STYLE,
        buaare.fills[0],
        DEPVS_FILL_STYLE,
        LANDA_FILL_STYLE,
        CHMGD_FILL_STYLE,
        CHGRD_FILL_STYLE,
        TRFCF_FILL_STYLE,
        causwy.fills[0],
        lndrgn.fills[0],
        marcul.fills[0],
        sndwav.fills[0],
        iceare.fills[0],
        iceare.fills[1],
        tunnel.fills[0],
        sbdare.fills[0],
        vegatn.fills[0],
        unsare.fills[0],
        buisgl.fills[0],
    ]
    // const slotBottomFills = fills.map((f) => ({
    //     ...f,
    //     slot: 'bottom',
    // }))

    const lines: LineLayerSpecification[] = [unsare.lines[0]]
    const symbols: SymbolLayerSpecification[] = []
    const texts: SymbolLayerSpecification[] = [...buaare.texts, ...buisgl.texts, ...lndrgn.texts, ...sbdare.texts]

    return { fills, lines, symbols, texts }
}

export default createACMARELayers(ColorTable)
