import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createBOYLATTexts(colors: ColorTableType) {
	const PCMTEX_BOYLAT_TEXT_0: SymbolLayerSpecification = {
		id: 'PCMTEX_BOYLAT_TEXT_0',
		type: 'symbol',
		...SOURCE_DESC,
		filter: ['==', ['get', 'OBJL'], 17],
		layout: {
			'text-field': ['get', 'OBJNAM'],
			'text-anchor': 'right',
			'text-offset': [-1, 0],
			'text-max-width': 20,
			'text-allow-overlap': true,
			'text-font': ['Roboto Medium'],
			'text-size': 14,
		},
		paint: {
			'text-color': colors.CHBLK,
		},
	}

	return { texts: [PCMTEX_BOYLAT_TEXT_0] as SymbolLayerSpecification[] }
}

export default createBOYLATTexts(ColorTable)
