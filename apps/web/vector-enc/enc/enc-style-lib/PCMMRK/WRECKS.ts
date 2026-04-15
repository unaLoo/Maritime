import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:159"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:FOULGND1" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:ISODGR51" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DANGER51" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DANGER52" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:WRECKS01" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:WRECKS04" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:WRECKS05" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:WRECKS07" />
</style>
*/

const PCMMRK_WRECKS_SYMBOL: SymbolLayerSpecification = {
    id: 'PCMMRK_WRECKS_SYMBOL',
    type: 'symbol',
    ...SOURCE_DESC,
    filter: [
        'all',
        ['==', ['get', 'OBJL'], 159],
        ['match', ['get', 'CATEGORY'], [1, 2, 3, 4, 5, 6, 7, 8], true, false],
    ],
    layout: {
        'icon-allow-overlap': true,
        'icon-image': [
            'case',
            ['==', ['get', 'CATEGORY'], 1],
            'FOULGND1',
            ['==', ['get', 'CATEGORY'], 2],
            'ISODGR51',
            ['==', ['get', 'CATEGORY'], 3],
            'DANGER51',
            ['==', ['get', 'CATEGORY'], 4],
            'DANGER52',
            ['==', ['get', 'CATEGORY'], 5],
            'WRECKS01',
            ['==', ['get', 'CATEGORY'], 6],
            'WRECKS04',
            ['==', ['get', 'CATEGORY'], 7],
            'WRECKS05',
            ['==', ['get', 'CATEGORY'], 8],
            'WRECKS07',
            'FOULGND1',
        ],
    },
    paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_WRECKS_SYMBOL]

export default {
    symbols,
}
