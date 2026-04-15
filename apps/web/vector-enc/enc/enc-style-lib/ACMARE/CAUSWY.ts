import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createCAUSWYLayers(colors: ColorTableType) {
	const COMARE_CAUSWY_FILL_0: FillLayerSpecification = {
		id: 'CAUSWY_case-fill_5',
		type: 'fill',
		source: 'AREA_COMMON_AREA',
		'source-layer': 'area_common_polygon',
		filter: ['==', ['get', 'OBJL'], 26],
		paint: {
			'fill-color': [
				'case',
				['==', ['get', 'FillType'], 1],
				colors.DEPIT,
				['==', ['get', 'FillType'], 2],
				colors.CHBRN,
				'rgba(0,0,0,0)',
			],
		},
	}

	return {
		fills: [COMARE_CAUSWY_FILL_0] as FillLayerSpecification[],
		lines: [] as LineLayerSpecification[],
		symbols: [] as SymbolLayerSpecification[],
	}
}

export default createCAUSWYLayers(ColorTable)
