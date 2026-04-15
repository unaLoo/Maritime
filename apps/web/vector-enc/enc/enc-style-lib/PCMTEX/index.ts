import { SymbolLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'
import { createBCNLATTexts } from './BCNLAT'
import { createBERTHSTexts } from './BERTHS'
import { createBOYSPPTexts } from './BOYSPP'
import { createLNDELVTexts } from './LNDELV'
import { createLNDRGNTexts } from './LNDRGN'
import { createOBSTRNTexts } from './OBSTRN'
import { createSBDARETexts } from './SBDARE'
import { createUWTROCTexts } from './UWTROC'
import { createWRECKSTexts } from './WRECKS'
import { createTS_FEBTexts } from './TS_FEB'
import { createANNOTATexts } from './ANNOTA'
import { createBOYLATTexts } from './BOYLAT'

export function createPCMTEXLayers(colors: ColorTableType) {
    const texts: SymbolLayerSpecification[] = [
        ...createBCNLATTexts(colors).texts,
        ...createBERTHSTexts(colors).texts,
        ...createBOYLATTexts(colors).texts,
        ...createBOYSPPTexts(colors).texts,
        ...createLNDELVTexts(colors).texts,
        ...createLNDRGNTexts(colors).texts,
        ...createOBSTRNTexts(colors).texts,
        ...createSBDARETexts(colors).texts,
        ...createUWTROCTexts(colors).texts,
        ...createWRECKSTexts(colors).texts,
        ...createTS_FEBTexts(colors).texts,
        ...createANNOTATexts(colors).texts,
    ]

    // Add: consider influnce of mapPitch
    const texts_pitch: SymbolLayerSpecification[] = texts.map((sym: SymbolLayerSpecification) => {
        const ans = {
            ...sym,
            minzoom: 13,
        }

        const t = sym.filter && sym.filter[0]
        if (sym.filter === undefined) {
            throw '!!!, sym' + sym
        }
        if (t === 'all') {
            ans.filter = [
                ...sym.filter,
                [
                    'case',
                    ['<=', ['pitch'], 40],
                    true,
                    [
                        'case',
                        ['<=', ['pitch'], 50],
                        true,
                        [
                            'step',
                            ['pitch'],
                            true,
                            50,
                            ['<=', ['distance-from-center'], 0.8],
                            55,
                            ['<', ['distance-from-center'], 0.7],
                            60,
                            ['<', ['distance-from-center'], 0.7],
                            65,
                            ['<', ['distance-from-center'], 0.5],
                            70,
                            ['<', ['distance-from-center'], -0.05],
                        ],
                    ],
                ],
            ]
        } else if (t === '==') {
            ans.filter = [
                'all',
                sym.filter,
                [
                    'case',
                    ['<=', ['pitch'], 40],
                    true,
                    [
                        'case',
                        ['<=', ['pitch'], 50],
                        true,
                        [
                            'step',
                            ['pitch'],
                            true,
                            50,
                            ['<=', ['distance-from-center'], 0.8],
                            55,
                            ['<', ['distance-from-center'], 0.7],
                            60,
                            ['<', ['distance-from-center'], 0.7],
                            65,
                            ['<', ['distance-from-center'], 0.5],
                            70,
                            ['<', ['distance-from-center'], -0.05],
                        ],
                    ],
                ],
            ]
        } else {
            console.warn('???', sym)
        }

        return ans
    })

    return { texts: texts_pitch }
}

export default createPCMTEXLayers(ColorTable)
