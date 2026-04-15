import { SymbolLayerSpecification } from 'mapbox-gl'

import AIRARE from './AIRARE'
import ACHBRT from './ACHBRT'
import ACHARE from './ACHARE'
import BCNCAR from './BCNCAR'
import BCNISD from './BCNISD'
import BCNLAT from './BCNLAT'
import BCNSAW from './BCNSAW'
import BCNSPP from './BCNSPP'
import BERTHS from './BERTHS'
import BRIDGE from './BRIDGE'
import BUISGL from './BUISGL'
import BUAARE from './BUAARE'
import BOYCAR from './BOYCAR'
import BOYINB from './BOYINB'
import BOYISD from './BOYISD'
import BOYLAT from './BOYLAT'
import BOYSAW from './BOYSAW'
import BOYSPP from './BOYSPP'
import CTSARE from './CTSARE'
import CTNARE from './CTNARE'
import CHKPNT from './CHKPNT'
import CGUSTA from './CGUSTA'
import CTRPNT from './CTRPNT'
import CRANES from './CRANES'
import CURENT from './CURENT'
import DAMCON from './DAMCON'
import DAYMAR from './DAYMAR'
import DISMAR from './DISMAR'
import DMPGRD from './DMPGRD'
import FSHFAC from './FSHFAC'
import FOGSIG from './FOGSIG'
import FORSTC from './FORSTC'
import GATCON from './GATCON'
import HRBFAC from './HRBFAC'
import HULKES from './HULKES'
import ICNARE from './ICNARE'
import LNDARE from './LNDARE'
import LNDELV from './LNDELV'
import LNDRGN from './LNDRGN'
import LNDMRK from './LNDMRK'
import LIGHTS from './LIGHTS'
import LITFLT from './LITFLT'
import LITVES from './LITVES'
import LOCMAG from './LOCMAG'
import MAGVAR from './MAGVAR'
import MARCUL from './MARCUL'
import MIPARE from './MIPARE'
import MORFAC from './MORFAC'
import OBSTRN from './OBSTRN'
import OFSPLF from './OFSPLF'
import PILPNT from './PILPNT'
import PILBOP from './PILBOP'
import PIPARE from './PIPARE'
import PRCARE from './PRCARE'
import PRDARE from './PRDARE'
import PYLONS from './PYLONS'
import RADRFL from './RADRFL'
import RADSTA from './RADSTA'
import RTPBCN from './RTPBCN'
import RDOCAL from './RDOCAL'
import RDOSTA from './RDOSTA'
import RCTLPT from './RCTLPT'
import RSCSTA from './RSCSTA'
import RETRFL from './RETRFL'
import SNDWAV from './SNDWAV'
import SEAARE from './SEAARE'
import SPLARE from './SPLARE'
import SLCONS from './SLCONS'
import SISTAT from './SISTAT'
import SISTAW from './SISTAW'
import SILTNK from './SILTNK'
import SLOGRD from './SLOGRD'
import SMCFAC from './SMCFAC'
import SPRING from './SPRING'
import TOPMAR from './TOPMAR'
import UWTROC from './UWTROC'
import WATTUR from './WATTUR'
import WEDKLP from './WEDKLP'
import WRECKS from './WRECKS'
import TS_FEB from './TS_FEB'

const symbols: SymbolLayerSpecification[] = [
    ...AIRARE.symbols,
    ...ACHBRT.symbols,
    ...ACHARE.symbols,
    ...BCNCAR.symbols,
    ...BCNISD.symbols,
    ...BCNLAT.symbols,
    ...BCNSAW.symbols,
    ...BCNSPP.symbols,
    ...BERTHS.symbols,
    ...BRIDGE.symbols,
    ...BUISGL.symbols,
    ...BUAARE.symbols,
    ...BOYCAR.symbols,
    ...BOYINB.symbols,
    ...BOYISD.symbols,
    ...BOYLAT.symbols,
    ...BOYSAW.symbols,
    ...BOYSPP.symbols,
    ...CTSARE.symbols,
    ...CTNARE.symbols,
    ...CHKPNT.symbols,
    ...CGUSTA.symbols,
    ...CTRPNT.symbols,
    ...CRANES.symbols,
    ...CURENT.symbols,
    ...DAMCON.symbols,
    ...DAYMAR.symbols,
    ...DISMAR.symbols,
    ...DMPGRD.symbols,
    ...FSHFAC.symbols,
    ...FOGSIG.symbols,
    ...FORSTC.symbols,
    ...GATCON.symbols,
    ...HRBFAC.symbols,
    ...HULKES.symbols,
    ...ICNARE.symbols,
    ...LNDARE.symbols,
    ...LNDELV.symbols,
    ...LNDRGN.symbols,
    ...LNDMRK.symbols,
    ...LIGHTS.symbols,
    ...LITFLT.symbols,
    ...LITVES.symbols,
    ...LOCMAG.symbols,
    ...MAGVAR.symbols,
    ...MARCUL.symbols,
    ...MIPARE.symbols,
    ...MORFAC.symbols,
    ...OBSTRN.symbols,
    ...OFSPLF.symbols,
    ...PILPNT.symbols,
    ...PILBOP.symbols,
    ...PIPARE.symbols,
    ...PRCARE.symbols,
    ...PRDARE.symbols,
    ...PYLONS.symbols,
    ...RADRFL.symbols,
    ...RADSTA.symbols,
    ...RTPBCN.symbols,
    ...RDOCAL.symbols,
    ...RDOSTA.symbols,
    ...RCTLPT.symbols,
    ...RSCSTA.symbols,
    ...RETRFL.symbols,
    ...SNDWAV.symbols,
    ...SEAARE.symbols,
    ...SPLARE.symbols,
    ...SLCONS.symbols,
    ...SISTAT.symbols,
    ...SISTAW.symbols,
    ...SILTNK.symbols,
    ...SLOGRD.symbols,
    ...SMCFAC.symbols,
    ...SPRING.symbols,
    ...TOPMAR.symbols,
    ...UWTROC.symbols,
    ...WATTUR.symbols,
    ...WEDKLP.symbols,
    ...WRECKS.symbols,
    ...TS_FEB.symbols,
]

// Add: consider influnce of mapPitch
const symbols_pitch: SymbolLayerSpecification[] = symbols.map((sym: SymbolLayerSpecification) => {
    const ans = {
        ...sym,
    }
    // ans.layout!['icon-pitch-alignment'] = 'map'

    const t = sym.filter && sym.filter[0]
    if (sym.filter === undefined) {
        throw '!!!, sym' + sym
    }
    if (t === 'all') {
        ans.filter = [
            ...sym.filter,
            [
                'case',
                ['<=', ['pitch'], 40],
                true,
                [
                    'case',
                    ['<=', ['pitch'], 50],
                    true,
                    [
                        'step',
                        ['pitch'],
                        true,
                        50,
                        ['<=', ['distance-from-center'], 0.8],
                        55,
                        ['<', ['distance-from-center'], 0.7],
                        60,
                        ['<', ['distance-from-center'], 0.7],
                        65,
                        ['<', ['distance-from-center'], 0.5],
                        70,
                        ['<', ['distance-from-center'], -0.05],
                    ],
                ],
            ],
        ]
    } else if (t === '==') {
        ans.filter = [
            'all',
            sym.filter,
            [
                'case',
                ['<=', ['pitch'], 40],
                true,
                [
                    'case',
                    ['<=', ['pitch'], 50],
                    true,
                    [
                        'step',
                        ['pitch'],
                        true,
                        50,
                        ['<=', ['distance-from-center'], 0.8],
                        55,
                        ['<', ['distance-from-center'], 0.7],
                        60,
                        ['<', ['distance-from-center'], 0.7],
                        65,
                        ['<', ['distance-from-center'], 0.5],
                        70,
                        ['<', ['distance-from-center'], -0.05],
                    ],
                ],
            ],
        ]
    } else {
        console.warn('???', sym)
    }

    return ans
})
// console.log(symbols_pitch)

export default {
    // symbols,
    symbols: symbols_pitch,
}
