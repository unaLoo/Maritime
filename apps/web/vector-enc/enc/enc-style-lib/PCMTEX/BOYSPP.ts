import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createBOYSPPTexts(colors: ColorTableType) {
	const PCMTEX_BOYSPP_TEXT_0: SymbolLayerSpecification = {
		id: 'PCMTEX_BOYSPP_TEXT_0',
		type: 'symbol',
		...SOURCE_DESC,
		filter: ['==', ['get', 'OBJL'], 19],
		minzoom: 12,
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

	return { texts: [PCMTEX_BOYSPP_TEXT_0] as SymbolLayerSpecification[] }
}

export default createBOYSPPTexts(ColorTable)
