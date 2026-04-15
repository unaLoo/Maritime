import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:86;">  
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:ACHARE02" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:FLTHAZ02" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:FOULAR01" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:FOULGND1" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:ISODGR51" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:OBSTRN01" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:OBSTRN03" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:OBSTRN11" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DANGER01" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DANGER51" />
    <style type="pointx.icon" style="key:11;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DANGER52" />
    <style type="pointx.icon" style="key:12;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DANGER53" />
    <style type="pointx.icon" style="key:13;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:LNDARE01" />
</style>
*/

const PCMMRK_OBSTRN_SYMBOL: SymbolLayerSpecification = {
    id: 'PCMMRK_OBSTRN_SYMBOL',
    type: 'symbol',
    ...SOURCE_DESC,
    minzoom: 11,
    filter: [
        'all',
        ['==', ['get', 'OBJL'], 86],
        ['match', ['get', 'CATEGORY'], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], true, false],
    ],
    layout: {
        'icon-allow-overlap': true,
        'icon-image': [
            'case',
            ['==', ['get', 'CATEGORY'], 1],
            'ACHARE02',
            ['==', ['get', 'CATEGORY'], 2],
            // 'FLTHAZ02',
            'FOULAR01',
            ['==', ['get', 'CATEGORY'], 3],
            'FOULAR01',
            ['==', ['get', 'CATEGORY'], 4],
            'FOULGND1',
            ['==', ['get', 'CATEGORY'], 5],
            'ISODGR51',
            // 'OBSTRN01',
            ['==', ['get', 'CATEGORY'], 6],
            'OBSTRN01',
            // 'ISODGR51',
            ['==', ['get', 'CATEGORY'], 7],
            'OBSTRN03',
            ['==', ['get', 'CATEGORY'], 8],
            'OBSTRN11',
            ['==', ['get', 'CATEGORY'], 9],
            'DANGER01',
            ['==', ['get', 'CATEGORY'], 10],
            'DANGER51',
            ['==', ['get', 'CATEGORY'], 11],
            'DANGER52',
            ['==', ['get', 'CATEGORY'], 12],
            // 'DANGER53', // node: not found？？？
            'DANGER52',
            ['==', ['get', 'CATEGORY'], 13],
            'LNDARE01',
            'ACHARE02', // nothing matched use a default
        ],
    },
    paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_OBSTRN_SYMBOL]

export default {
    symbols,
}
