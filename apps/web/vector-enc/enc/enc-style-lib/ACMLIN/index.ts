import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'
import { createACHARELines } from './ACHARE'
import { createAIRARELines } from './AIRARE'
import { createBUISGLLines } from './BUISGL'
import { createCANALSLines } from './CANALS'
import { createCAUSWYLines } from './CAUSWY'
import { createCRANESLines } from './CRANES'
import { createDAMCONLines } from './DAMCON'
import { createDOCARELines } from './DOCARE'
import { createFAIRWYLines } from './FAIRWY'
import { createFERYRTLines } from './FERYRT'
import { createFORSTCLines } from './FORSTC'
import { createOBSTRNLines } from './OBSTRN'
import { createPIPARELines } from './PIPARE'
import { createPRDARELines } from './PRDARE'
import { createTUNNULLines } from './TUNNUL'
import { createWRECKSLines } from './WRECKS'
import { createDMPGRDLines } from './DMPGRD'

const SOURCE_DESC = {
    source: 'AREA_COMMON_LINE',
    'source-layer': 'area_common_line',
}

export function createACMLINLayers(colors: ColorTableType) {
    const ACMLIN_DASH_CHGRF: LineLayerSpecification = {
        id: 'ACMLIN_DASH_CHGRF',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [1, 31, 32, 50, 54, 60, 135, 120], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.CHGRF,
            'line-width': 2,
        },
    }

    /**
     * 长得像下面这样的线  112  ESSARE01_LINE
     * |
     * |——  
     * |
     */
    const ACMLIN_UNKNOWN_LINE: LineLayerSpecification = {
        id: 'ACMLIN_UNKNOWN_LINE',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [112], true, false],
        // filter: ['match', ['get', 'OBJL'], [9999], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-pattern': 'ESSARE01',
            'line-width': 7,
        },
    }

    const ACMLIN_DASH_CHMGD: LineLayerSpecification = {
        id: 'ACMLIN_DASH_CHMGD',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [3, 10, 83, 88, 133], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.CHMGD,
            'line-width': 1.5,
            'line-dasharray': [4, 4],
        },
    }

    // 20  
    const ACMLIN_CBLARE51_LINE: LineLayerSpecification = {
        id: 'ACMLIN_CBLARE51_LINE',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [20], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-pattern': 'CBLARE51_LINE',
            'line-width': 20,
            "line-offset": 4 // 向右偏移4px
        },
    }



    const ACMLIN_SOLIDX_CHGRD: LineLayerSpecification = {
        id: 'ACMLIN_SOLIDX_CHGRD',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [11, 34, 154], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.CHGRD,
            'line-width': 3,
        },
    }

    const ACMLIN_SOLIDX_LANDF: LineLayerSpecification = {
        id: 'ACMLIN_SOLIDX_LANDF',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [13, 49, 116, 128, 155], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.LANDF,
            'line-width': 1.2,
        },
    }

    const ACMLIN_DASH_CHMGF: LineLayerSpecification = {
        id: 'ACMLIN_DASH_CHMGF',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [67, 25], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.CHMGF,
            'line-width': 1.2,
            'line-dasharray': [4, 4],
        },
    }

    const ACMLIN_DASH_TRFCD: LineLayerSpecification = {
        id: 'ACMLIN_DASH_TRFCD',
        type: 'line',
        ...SOURCE_DESC,
        // filter: ['match', ['get', 'OBJL'], [27, 41, 96, 152, 68], true, false],
        filter: ['match', ['get', 'OBJL'], [41, 152, 27, 68], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.TRFCD,
            'line-width': 2,
            'line-dasharray': [4, 4],
        },
    }

    // temp
    const temp: LineLayerSpecification = {
        id: 'ACMLIN_SOSSS_temp',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [96], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.TRFCD,
            'line-width': 2,
        },
    }

    const ACMLIN_DASH_CHGRF_2: LineLayerSpecification = {
        id: 'ACMLIN_DASH_CHGRF_2',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [37, 46, 56, 158], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.CHGRF,
            'line-width': 1.2,
            'line-dasharray': [4, 4],
        },
    }

    const ACMLIN_SOLIDX_CSTLN: LineLayerSpecification = {
        id: 'ACMLIN_SOLIDX_CSTLN',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [57, 61, 65, 87, 95, 98], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.CSTLN,
            'line-width': 2,
        },
    }

    const ACMLIN_DASH_CHGRD: LineLayerSpecification = {
        id: 'ACMLIN_DASH_CHGRD',
        type: 'line',
        ...SOURCE_DESC,
        filter: [
            'match',
            ['get', 'OBJL'],
            [55, 62, 66, 78, 82, 109, 121, 134, 136, 137, 138, 139, 140, 141, 142, 156, 63, 118, 160],
            true,
            false,
        ],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.CHGRD,
            'line-width': 1.2,
            'line-dasharray': [4, 4],
        },
    }

    const ACMLIN_SOLIDX_CHBLK: LineLayerSpecification = {
        id: 'ACMLIN_SOLIDX_CHBLK',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [69, 84, 114, 117, 127], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.CHBLK,
            'line-width': 1.2,
        },
    }

    const ACMLIN_DASH_CHBLK: LineLayerSpecification = {
        id: 'ACMLIN_DASH_CHBLK',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [79, 80], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.CHBLK,
            'line-width': 1.2,
            'line-dasharray': [4, 4],
        },
    }

    const ACMLIN_DASH_TRFCF: LineLayerSpecification = {
        id: 'ACMLIN_DASH_TRFCF',
        type: 'line',
        ...SOURCE_DESC,
        filter: ['match', ['get', 'OBJL'], [91, 100], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': colors.TRFCF,
            'line-width': 1.5,
            'line-dasharray': [4, 4],
        },
    }

    const lines = [
        temp,
        ACMLIN_CBLARE51_LINE,
        ACMLIN_DASH_CHGRF,
        ACMLIN_DASH_CHMGD,
        ACMLIN_SOLIDX_CHGRD,
        ACMLIN_SOLIDX_LANDF,
        ACMLIN_DASH_CHMGF,
        ACMLIN_DASH_TRFCD,
        ACMLIN_DASH_CHGRF_2,
        ACMLIN_SOLIDX_CSTLN,
        ACMLIN_DASH_CHGRD,
        ACMLIN_SOLIDX_CHBLK,
        ACMLIN_DASH_CHBLK,
        ACMLIN_DASH_TRFCF,
        ...createACHARELines(colors).lines,
        ...createAIRARELines(colors).lines,
        ...createBUISGLLines(colors).lines,
        ...createCANALSLines(colors).lines,
        ...createCAUSWYLines(colors).lines,
        ...createCRANESLines(colors).lines,
        ...createDAMCONLines(colors).lines,
        ...createDMPGRDLines(colors).lines,
        ...createDOCARELines(colors).lines,
        ...createFAIRWYLines(colors).lines,
        ...createFERYRTLines(colors).lines,
        ...createFORSTCLines(colors).lines,
        ...createOBSTRNLines(colors).lines,
        ...createPIPARELines(colors).lines,
        ...createPRDARELines(colors).lines,
        ...createTUNNULLines(colors).lines,
        ...createWRECKSLines(colors).lines,
    ]

    const underAreaLines = [
        ACMLIN_UNKNOWN_LINE,
    ]

    return { lines, underAreaLines }
}

export default createACMLINLayers(ColorTable)
