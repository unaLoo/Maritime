import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createTS_FEBTexts(colors: ColorTableType) {
	const PCMTEX_TS_FEB_TEXT_0: SymbolLayerSpecification = {
		id: 'PCMTEX_TS_FEB_TEXT_0',
		type: 'symbol',
		...SOURCE_DESC,
		filter: ['==', ['get', 'OBJL'], 160],
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

	return { texts: [PCMTEX_TS_FEB_TEXT_0] as SymbolLayerSpecification[] }
}

export default createTS_FEBTexts(ColorTable)
