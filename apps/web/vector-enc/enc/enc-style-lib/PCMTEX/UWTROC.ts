import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createUWTROCTexts(colors: ColorTableType) {
	const PCMTEX_UWTROC_TEXT_0: SymbolLayerSpecification = {
		id: 'PCMTEX_UWTROC_TEXT_0',
		type: 'symbol',
		...SOURCE_DESC,
		filter: ['==', ['get', 'OBJL'], 153],
		layout: {
			'text-field': ['get', 'OBJNAM'],
			'text-anchor': 'center',
			'text-offset': [0, 0],
			'text-allow-overlap': true,
			'text-font': ['Roboto Medium'],
			'text-size': 14,
		},
		paint: {
			'text-color': colors.CHGRD,
		},
	}

	// 原代码中 texts 为空数组
	return { texts: [] as SymbolLayerSpecification[] }
}

export default createUWTROCTexts(ColorTable)
