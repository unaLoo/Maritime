import { SymbolLayerSpecification, FillLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createTUNNELLayers(colors: ColorTableType) {
	const TUNNEL_FILL_0: FillLayerSpecification = {
		id: 'COMARE_TUNNEL_FILL_0',
		type: 'fill',
		source: 'AREA_COMMON_AREA',
		'source-layer': 'area_common_polygon',
		filter: ['all', ['==', ['get', 'OBJL'], 151], ['==', ['get', 'FillType'], 4]],
		layout: {},
		paint: {
			'fill-color': colors.DEPVS,
		},
	}

	return {
		fills: [TUNNEL_FILL_0] as FillLayerSpecification[],
		lines: [] as LineLayerSpecification[],
		symbols: [] as SymbolLayerSpecification[],
	}
}

export default createTUNNELLayers(ColorTable)
