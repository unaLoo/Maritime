import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createMARCULLayers(colors: ColorTableType) {
	const MARCUL_FILL_0: FillLayerSpecification = {
		id: 'COMARE_MARCUL_FILL_0',
		type: 'fill',
		source: 'AREA_COMMON_AREA',
		'source-layer': 'area_common_polygon',
		filter: ['==', ['get', 'OBJL'], 82],
		paint: {
			'fill-pattern': 'fish_area1',
			'fill-opacity': 1,
		},
	}

	return {
		fills: [MARCUL_FILL_0] as FillLayerSpecification[],
		lines: [] as LineLayerSpecification[],
		symbols: [] as SymbolLayerSpecification[],
	}
}

export default createMARCULLayers(ColorTable)
