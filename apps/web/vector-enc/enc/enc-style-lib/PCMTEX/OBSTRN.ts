import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createOBSTRNTexts(colors: ColorTableType) {
    const PCMTEX_OBSTRN_TEXT_0: SymbolLayerSpecification = {
        id: 'PCMTEX_OBSTRN_TEXT_0',
        type: 'symbol',
        ...SOURCE_DESC,
        filter: ['==', ['get', 'OBJL'], 86],
        minzoom: 11,
        layout: {
            // 'text-field': ['get', 'OBJNAM'],
            'text-field': [
                'format',
                // 整数部分
                ['slice', ['to-string', ['get', 'OBJNAM']], 0, ['index-of', '.', ['to-string', ['get', 'OBJNAM']]]], // 返回 str
                { 'font-scale': 1.0 }, // 返回 desc
                ' ',
                { 'font-scale': 0.1 },
                // 小数部分
                [
                    'case',
                    [
                        'all',
                        // 1. 有小数部分
                        ['!=', ['index-of', '.', ['to-string', ['get', 'OBJNAM']]], -1],
                        // 2. 小数部分有意义 avoid .0
                        [
                            '>',
                            [
                                'length',
                                [
                                    'slice',
                                    ['to-string', ['get', 'OBJNAM']],
                                    ['+', ['index-of', '.', ['to-string', ['get', 'OBJNAM']]], 1],
                                ],
                            ],
                            0,
                        ],
                    ], // condition
                    [
                        'slice',
                        ['to-string', ['get', 'OBJNAM']],
                        ['+', ['index-of', '.', ['to-string', ['get', 'OBJNAM']]], 1], // 从小数点开始截取（包含小数点）
                    ], // true, 返回 decimal str
                    '', // false, 返回 empty str
                ],
                {
                    'font-scale': 0.8,
                },
            ],
            'text-anchor': 'center',
            'text-offset': [0, 0.2],
            'text-allow-overlap': true,
            'text-font': ['Roboto Medium'],
            'text-size': 12,
        },
        paint: {
            'text-color': colors.CHGRD,
        },
    }

    return { texts: [PCMTEX_OBSTRN_TEXT_0] as SymbolLayerSpecification[] }
}

export default createOBSTRNTexts(ColorTable)
