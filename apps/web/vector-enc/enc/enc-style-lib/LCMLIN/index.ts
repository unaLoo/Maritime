import { LineLayerSpecification, SymbolLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'
import { createBRIDGELines } from './BRIDGE'
import { createCBLOHDLines } from './CBLOHD'
import { createCBLSUBLines } from './CBLSUB'
import { createCANALSLines } from './CANALS'
import { createCAUSWYLines } from './CAUSWY'
import { createCOALNELines } from './COALNE'
import { createCONVYRLines } from './CONVYR'
import { createDAMCONLines } from './DAMCON'
import { createDYKCONLines } from './DYKCON'
import { createFNCLNELines } from './FNCLNE'
import { createFERYRTLines } from './FERYRT'
import { createFSHFACLines } from './FSHFAC'
import { createFLODOCLines } from './FLODOC'
import { createFORSTCLines } from './FORSTC'
import { createGATCONLines } from './GATCON'
import { createLAKSHRLines } from './LAKSHR'
import { createLNDARELines } from './LNDARE'
import { createLNDELVLines } from './LNDELV'
import { createLNDMRKLines } from './LNDMRK'
import { createLOCMAGLines } from './LOCMAG'
import { createMARCULLines } from './MARCUL'
import { createMORFACLines } from './MORFAC'
import { createNAVLNELines } from './NAVLNE'
import { createOBSTRNLines } from './OBSTRN'
import { createOILBARLines } from './OILBAR'
import { createPIPOHDLines } from './PIPOHD'
import { createPONTONLines } from './PONTON'
import { createRADLNELines } from './RADLNE'
import { createRDOCALLines } from './RDOCAL'
import { createRAILWYLines } from './RAILWY'
import { createRAPIDSLines } from './RAPIDS'
import { createRCRTCLLines } from './RCRTCL'
import { createRECTRCLines } from './RECTRC'
import { createRIVERSLines } from './RIVERS'
import { createROADWYLines } from './ROADWY'
import { createRUNWAYLines } from './RUNWAY'
import { createSNDWAVLines } from './SNDWAV'
import { createSBDARELines } from './SBDARE'
import { createSLCONSLines } from './SLCONS'
import { createSLOTOPLines } from './SLOTOP'
import { createSTSLNELines } from './STSLNE'
import { createTIDEWYLines } from './TIDEWY'
import { createTSELNELines } from './TSELNE'
import { createTSSBNDLines } from './TSSBND'
import { createTUNNELLines } from './TUNNEL'
import { createVEGATNLines } from './VEGATN'
import { createWATFALLines } from './WATFAL'
import { createDEPCNTLines } from './DEPCNT'

export function createLCMLINLayers(colors: ColorTableType) {
    const navlne = createNAVLNELines(colors)
    const pipohd = createPIPOHDLines(colors)

    const lines: LineLayerSpecification[] = [
        // ...createDEPCNTLines(colors).lines,
        ...createBRIDGELines(colors).lines,
        ...createCBLOHDLines(colors).lines,
        ...createCBLSUBLines(colors).lines,
        ...createCANALSLines(colors).lines,
        ...createCAUSWYLines(colors).lines,
        ...createCOALNELines(colors).lines,
        ...createCONVYRLines(colors).lines,
        ...createDAMCONLines(colors).lines,
        ...createDYKCONLines(colors).lines,
        ...createFNCLNELines(colors).lines,
        ...createFERYRTLines(colors).lines,
        ...createFSHFACLines(colors).lines,
        ...createFLODOCLines(colors).lines,
        ...createFORSTCLines(colors).lines,
        ...createGATCONLines(colors).lines,
        ...createLAKSHRLines(colors).lines,
        ...createLNDARELines(colors).lines,
        ...createLNDELVLines(colors).lines,
        ...createLNDMRKLines(colors).lines,
        ...createLOCMAGLines(colors).lines,
        ...createMARCULLines(colors).lines,
        ...createMORFACLines(colors).lines,
        ...navlne.lines,
        ...createOBSTRNLines(colors).lines,
        ...createOILBARLines(colors).lines,
        ...pipohd.lines,
        ...createPONTONLines(colors).lines,
        ...createRADLNELines(colors).lines,
        ...createRDOCALLines(colors).lines,
        ...createRAILWYLines(colors).lines,
        ...createRAPIDSLines(colors).lines,
        ...createRCRTCLLines(colors).lines,
        ...createRECTRCLines(colors).lines,
        ...createRIVERSLines(colors).lines,
        ...createROADWYLines(colors).lines,
        ...createRUNWAYLines(colors).lines,
        ...createSNDWAVLines(colors).lines,
        ...createSBDARELines(colors).lines,
        ...createSLCONSLines(colors).lines,
        ...createSLOTOPLines(colors).lines,
        ...createSTSLNELines(colors).lines,
        ...createTIDEWYLines(colors).lines,
        ...createTSELNELines(colors).lines,
        ...createTSSBNDLines(colors).lines,
        ...createTUNNELLines(colors).lines,
        ...createVEGATNLines(colors).lines,
        ...createWATFALLines(colors).lines,
    ]

    const texts: SymbolLayerSpecification[] = [...(navlne.symbols || []), ...(pipohd.symbols || [])]

    return { lines, texts }
}

export default createLCMLINLayers(ColorTable)
