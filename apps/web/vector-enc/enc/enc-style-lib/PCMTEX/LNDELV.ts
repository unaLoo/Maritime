import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createLNDELVTexts(colors: ColorTableType) {
	const PCMTEX_LNDELV_TEXT_0: SymbolLayerSpecification = {
		id: 'PCMTEX_LNDELV_TEXT_0',
		type: 'symbol',
		...SOURCE_DESC,
		filter: ['==', ['get', 'OBJL'], 72],
		layout: {
			'text-field': ['get', 'OBJNAM'],
			'text-anchor': 'top',
			'text-offset': [0, -1.5],
			'text-allow-overlap': true,
			'text-font': ['Roboto Medium'],
			'text-size': 14,
		},
		paint: {
			'text-color': colors.CHBLK,
		},
	}

	return { texts: [PCMTEX_LNDELV_TEXT_0] as SymbolLayerSpecification[] }
}

export default createLNDELVTexts(ColorTable)
