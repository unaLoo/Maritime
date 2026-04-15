import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createANNOTATexts(colors: ColorTableType) {
	const PCMTEX_ANNOTA_TEXT_0: SymbolLayerSpecification = {
		id: 'PCMTEX_ANNOTA_TEXT_0',
		type: 'symbol',
		...SOURCE_DESC,
		filter: ['==', ['get', 'OBJL'], 22001],
		layout: {
			'text-field': ['get', 'OBJNAM'],
			'text-anchor': 'center',
			'text-offset': [0, 0],
			'text-allow-overlap': true,
			'text-font': ['Roboto Medium'],
			'text-size': 14,
		},
		paint: {
			'text-color': colors.CHBLK,
		},
	}

	return { texts: [PCMTEX_ANNOTA_TEXT_0] as SymbolLayerSpecification[] }
}

export default createANNOTATexts(ColorTable)
