import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:74"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BUIREL01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BUIREL13" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BUIREL15" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:CAIRNS01" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:CAIRNS11" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:CHIMNY01" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:CHIMNY11" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DOMES001" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DOMES011" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DSHAER01" />
    <style type="pointx.icon" style="key:11;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DSHAER11" />
    <style type="pointx.icon" style="key:12;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:FLASTK01" />
    <style type="pointx.icon" style="key:13;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:FLASTK11" />
    <style type="pointx.icon" style="key:14;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:FLGSTF01" />
    <style type="pointx.icon" style="key:15;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:MONUMT02" />
    <style type="pointx.icon" style="key:16;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:MONUMT12" />
    <style type="pointx.icon" style="key:17;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:MSTCON04" />
    <style type="pointx.icon" style="key:18;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:MSTCON14" />
    <style type="pointx.icon" style="key:19;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:POSGEN01" />
    <style type="pointx.icon" style="key:20;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:POSGEN03" />
    <style type="pointx.icon" style="key:21;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:RASCAN01" />
    <style type="pointx.icon" style="key:22;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:RASCAN11" />
    <style type="pointx.icon" style="key:23;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS01" />
    <style type="pointx.icon" style="key:24;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS03" />
    <style type="pointx.icon" style="key:25;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS05" />
    <style type="pointx.icon" style="key:26;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS15" />
    <style type="pointx.icon" style="key:27;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS48" />
    <style type="pointx.icon" style="key:28;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS49" />
    <style type="pointx.icon" style="key:29;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS50" />
    <style type="pointx.icon" style="key:30;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS51" />
    <style type="pointx.icon" style="key:31;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS52" />
    <style type="pointx.icon" style="key:32;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS53" />
    <style type="pointx.icon" style="key:33;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS59" />
    <style type="pointx.icon" style="key:34;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS60" />
    <style type="pointx.icon" style="key:35;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS61" />
    <style type="pointx.icon" style="key:36;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS62" />
    <style type="pointx.icon" style="key:37;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS65" />
    <style type="pointx.icon" style="key:38;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS66" />
    <style type="pointx.icon" style="key:39;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS67" />
    <style type="pointx.icon" style="key:40;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS72" />
    <style type="pointx.icon" style="key:41;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS73" />
    <style type="pointx.icon" style="key:42;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS79" />
    <style type="pointx.icon" style="key:43;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS83" />
    <style type="pointx.icon" style="key:44;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS85" />
    <style type="pointx.icon" style="key:45;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS88" />
    <style type="pointx.icon" style="key:46;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS92" />
    <style type="pointx.icon" style="key:47;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS93" />
    <style type="pointx.icon" style="key:48;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS94" />
    <style type="pointx.icon" style="key:49;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS96" />
    <style type="pointx.icon" style="key:50;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS97" />
    <style type="pointx.icon" style="key:51;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS98" />
    <style type="pointx.icon" style="key:52;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:WIMCON01" />
    <style type="pointx.icon" style="key:53;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:WIMCON11" />
    <style type="pointx.icon" style="key:54;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:WNDMIL02" />
    <style type="pointx.icon" style="key:55;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:WNDMIL12" />
</style>
*/

const PCMMRK_LNDMRK_SYMBOL: SymbolLayerSpecification = {
    id: 'PCMMRK_LNDMRK_SYMBOL',
    type: 'symbol',
    ...SOURCE_DESC,
    filter: [
        'all',
        ['==', ['get', 'OBJL'], 74],
        [
            'match',
            ['get', 'CATEGORY'],
            [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
                29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
                55,
            ],
            true,
            false,
        ],
    ],
    layout: {
        'icon-allow-overlap': true,
        'icon-image': [
            'case',
            ['==', ['get', 'CATEGORY'], 1],
            'BUIREL01',
            ['==', ['get', 'CATEGORY'], 2],
            'BUIREL13',
            ['==', ['get', 'CATEGORY'], 3],
            'BUIREL15',
            ['==', ['get', 'CATEGORY'], 4],
            'CAIRNS01',
            ['==', ['get', 'CATEGORY'], 5],
            'CAIRNS11',
            ['==', ['get', 'CATEGORY'], 6],
            'CHIMNY01',
            ['==', ['get', 'CATEGORY'], 7],
            'CHIMNY11',
            ['==', ['get', 'CATEGORY'], 8],
            'DOMES001',
            ['==', ['get', 'CATEGORY'], 9],
            'DOMES011',
            ['==', ['get', 'CATEGORY'], 10],
            'DSHAER01',
            ['==', ['get', 'CATEGORY'], 11],
            'DSHAER11',
            ['==', ['get', 'CATEGORY'], 12],
            'FLASTK01',
            ['==', ['get', 'CATEGORY'], 13],
            'FLASTK11',
            ['==', ['get', 'CATEGORY'], 14],
            'FLGSTF01',
            ['==', ['get', 'CATEGORY'], 15],
            'MONUMT02',
            ['==', ['get', 'CATEGORY'], 16],
            'MONUMT12',
            ['==', ['get', 'CATEGORY'], 17],
            'MSTCON04',
            ['==', ['get', 'CATEGORY'], 18],
            'MSTCON14',
            ['==', ['get', 'CATEGORY'], 19],
            'POSGEN01',
            ['==', ['get', 'CATEGORY'], 20],
            'POSGEN03',
            ['==', ['get', 'CATEGORY'], 21],
            'RASCAN01',
            ['==', ['get', 'CATEGORY'], 22],
            'RASCAN11',
            ['==', ['get', 'CATEGORY'], 23],
            'TOWERS01',
            ['==', ['get', 'CATEGORY'], 24],
            'TOWERS03',
            ['==', ['get', 'CATEGORY'], 25],
            'TOWERS05',
            ['==', ['get', 'CATEGORY'], 26],
            'TOWERS15',
            ['==', ['get', 'CATEGORY'], 27],
            'TOWERS48',
            ['==', ['get', 'CATEGORY'], 28],
            'TOWERS49',
            ['==', ['get', 'CATEGORY'], 29],
            'TOWERS50',
            ['==', ['get', 'CATEGORY'], 30],
            'TOWERS51',
            ['==', ['get', 'CATEGORY'], 31],
            'TOWERS52',
            ['==', ['get', 'CATEGORY'], 32],
            'TOWERS53',
            ['==', ['get', 'CATEGORY'], 33],
            'TOWERS59',
            ['==', ['get', 'CATEGORY'], 34],
            'TOWERS60',
            ['==', ['get', 'CATEGORY'], 35],
            'TOWERS61',
            ['==', ['get', 'CATEGORY'], 36],
            'TOWERS62',
            ['==', ['get', 'CATEGORY'], 37],
            'TOWERS65',
            ['==', ['get', 'CATEGORY'], 38],
            'TOWERS66',
            ['==', ['get', 'CATEGORY'], 39],
            'TOWERS67',
            ['==', ['get', 'CATEGORY'], 40],
            'TOWERS72',
            ['==', ['get', 'CATEGORY'], 41],
            'TOWERS73',
            ['==', ['get', 'CATEGORY'], 42],
            'TOWERS79',
            ['==', ['get', 'CATEGORY'], 43],
            'TOWERS83',
            ['==', ['get', 'CATEGORY'], 44],
            'TOWERS85',
            ['==', ['get', 'CATEGORY'], 45],
            'TOWERS88',
            ['==', ['get', 'CATEGORY'], 46],
            'TOWERS92',
            ['==', ['get', 'CATEGORY'], 47],
            'TOWERS93',
            ['==', ['get', 'CATEGORY'], 48],
            'TOWERS94',
            ['==', ['get', 'CATEGORY'], 49],
            'TOWERS96',
            ['==', ['get', 'CATEGORY'], 50],
            'TOWERS97',
            ['==', ['get', 'CATEGORY'], 51],
            'TOWERS98',
            ['==', ['get', 'CATEGORY'], 52],
            'WIMCON01',
            ['==', ['get', 'CATEGORY'], 53],
            'WIMCON11',
            ['==', ['get', 'CATEGORY'], 54],
            'WNDMIL02',
            ['==', ['get', 'CATEGORY'], 55],
            'WNDMIL12',
            'BUIREL01', // nothing matched use a default
        ],
    },
    paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_LNDMRK_SYMBOL]

export default {
    symbols,
}
