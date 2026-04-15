import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_MAGVAR_SYMBOL: SymbolLayerSpecification = {
    id: 'PCMMRK_MAGVAR_SYMBOL',
    type: 'symbol',
    ...SOURCE_DESC,
    filter: ['==', ['get', 'OBJL'], 81],
    layout: {
        'icon-allow-overlap': true,
        'icon-image': 'MAGVAR01',
        'icon-size': 2.0
    },
    paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_MAGVAR_SYMBOL]

export default {
    symbols,
}
