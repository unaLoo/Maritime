import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createWRECKSTexts(colors: ColorTableType) {
    const PCMTEX_WRECKS_TEXT_0: SymbolLayerSpecification = {
        id: 'PCMTEX_WRECKS_TEXT_0',
        type: 'symbol',
        ...SOURCE_DESC,
        // filter: ['==', ['get', 'OBJL'], 159],
        filter: [
            'all',
            ['==', ['get', 'OBJL'], 159],
            ['match', ['get', 'CATEGORY'], [1, 2, 3, 4, 8], true, false],
        ],
        layout: {
            'text-field': ['get', 'OBJNAM'],
            'text-anchor': 'center',
            'text-offset': [0, 0.2],
            'text-allow-overlap': true,
            'text-font': ['Roboto Medium'],
            'text-size': 12,
            'text-pitch-alignment': 'map',
            'text-rotation-alignment': 'map',
        },
        paint: {
            'text-color': colors.CHBLK,
        },
    }

    return { texts: [PCMTEX_WRECKS_TEXT_0] as SymbolLayerSpecification[] }
}

export default createWRECKSTexts(ColorTable)
