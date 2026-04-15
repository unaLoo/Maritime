import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:144">
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TMARDEF1;offset_y:-25;" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TMARDEF2;offset_y:-25;" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMA114;offset_y:-25;" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMA115;offset_y:-25;" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMA116;offset_y:-25;" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMA117;offset_y:-25;" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR01;offset_y:-25;" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR02;offset_y:-25;" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR04;offset_y:-25;" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR05;offset_y:-25;" />
    <style type="pointx.icon" style="key:11;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR06;offset_y:-25;" />
    <style type="pointx.icon" style="key:12;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR07;offset_y:-25;" />
    <style type="pointx.icon" style="key:13;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR08;offset_y:-25;" />
    <style type="pointx.icon" style="key:14;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR10;offset_y:-25;" />
    <style type="pointx.icon" style="key:15;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR12;offset_y:-25;" />
    <style type="pointx.icon" style="key:16;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR13;offset_y:-25;" />
    <style type="pointx.icon" style="key:17;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR14;offset_y:-25;" />
    <style type="pointx.icon" style="key:18;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR16;offset_y:-25;" />
    <style type="pointx.icon" style="key:19;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR17;offset_y:-25;" />
    <style type="pointx.icon" style="key:20;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR18;offset_y:-25;" />
    <style type="pointx.icon" style="key:21;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR22;offset_y:-25;" />
    <style type="pointx.icon" style="key:22;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR24;offset_y:-25;" />
    <style type="pointx.icon" style="key:23;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR25;offset_y:-25;" />
    <style type="pointx.icon" style="key:24;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR26;offset_y:-25;" />
    <style type="pointx.icon" style="key:25;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR27;offset_y:-25;" />
    <style type="pointx.icon" style="key:26;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR28;offset_y:-25;" />
    <style type="pointx.icon" style="key:27;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR30;offset_y:-25;" />
    <style type="pointx.icon" style="key:28;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR32;offset_y:-25;" />
    <style type="pointx.icon" style="key:29;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR33;offset_y:-25;" />
    <style type="pointx.icon" style="key:30;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR34;offset_y:-25;" />
    <style type="pointx.icon" style="key:31;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR36;offset_y:-25;" />
    <style type="pointx.icon" style="key:32;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR65;offset_y:-25;" />
    <style type="pointx.icon" style="key:33;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR85;offset_y:-25;" />
    <style type="pointx.icon" style="key:34;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR86;offset_y:-25;" />
    <style type="pointx.icon" style="key:35;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR87;offset_y:-25;" />
    <style type="pointx.icon" style="key:36;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR88;offset_y:-25;" />
    <style type="pointx.icon" style="key:37;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR89;offset_y:-25;" />
    <style type="pointx.icon" style="key:38;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR90;offset_y:-25;" />
    <style type="pointx.icon" style="key:39;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR91;offset_y:-25;" />
    <style type="pointx.icon" style="key:40;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR92;offset_y:-25;" />
    <style type="pointx.icon" style="key:41;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR93;offset_y:-25;" />
    <style type="pointx.icon" style="key:42;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR98;offset_y:-25;" />
    <style type="pointx.icon" style="key:43;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR99;offset_y:-25;" />
    <style type="pointx.icon" style="key:44;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP07;offset_y:-25;" />
    <style type="pointx.icon" style="key:45;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP10;offset_y:-25;" />
    <style type="pointx.icon" style="key:46;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP20;offset_y:-25;" />
    <style type="pointx.icon" style="key:47;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP23;offset_y:-25;" />
    <style type="pointx.icon" style="key:48;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP48;offset_y:-25;" />
    <style type="pointx.icon" style="key:49;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP51;offset_y:-25;" />
    <style type="pointx.icon" style="key:50;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP52;offset_y:-25;" />
    <style type="pointx.icon" style="key:51;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP53;offset_y:-25;" />
    <style type="pointx.icon" style="key:52;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP54;offset_y:-25;" />
    <style type="pointx.icon" style="key:53;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPI1;offset_y:-25;" />
    <style type="pointx.icon" style="key:54;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPI2;offset_y:-25;" />
    <style type="pointx.icon" style="key:55;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPI3;offset_y:-25;" />
    <style type="pointx.icon" style="key:56;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPJ1;offset_y:-25;" />
    <style type="pointx.icon" style="key:57;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPJ3;offset_y:-25;" />
    <style type="pointx.icon" style="key:58;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPP2;offset_y:-25;" />
    <style type="pointx.icon" style="key:59;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPR1;offset_y:-25;" />
    <style type="pointx.icon" style="key:60;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPT1;offset_y:-25;" />
    <style type="pointx.icon" style="key:61;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPT2;offset_y:-25;" />
    <style type="pointx.icon" style="key:62;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPT3;offset_y:-25;" />
    <style type="pointx.icon" style="key:63;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPT4;offset_y:-25;" />
    <style type="pointx.icon" style="key:64;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPT5;offset_y:-25;" />
    <style type="pointx.icon" style="key:65;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPT6;offset_y:-25;" />
    <style type="pointx.icon" style="key:66;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPT7;offset_y:-25;" />
    <style type="pointx.icon" style="key:67;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPU2;offset_y:-25;" />
    <style type="pointx.icon" style="key:68;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ06;offset_y:-25;" />
    <style type="pointx.icon" style="key:69;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ07;offset_y:-25;" />
    <style type="pointx.icon" style="key:70;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ08;offset_y:-25;" />
    <style type="pointx.icon" style="key:71;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ17;offset_y:-25;" />
    <style type="pointx.icon" style="key:72;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ19;offset_y:-25;" />
    <style type="pointx.icon" style="key:73;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ20;offset_y:-25;" />
    <style type="pointx.icon" style="key:74;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ21;offset_y:-25;" />
    <style type="pointx.icon" style="key:75;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ22;offset_y:-25;" />
    <style type="pointx.icon" style="key:76;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ23;offset_y:-25;" />
    <style type="pointx.icon" style="key:77;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ24;offset_y:-25;" />
    <style type="pointx.icon" style="key:78;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ25;offset_y:-25;" />
    <style type="pointx.icon" style="key:79;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ26;offset_y:-25;" />
    <style type="pointx.icon" style="key:80;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ27;offset_y:-25;" />
    <style type="pointx.icon" style="key:81;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ28;offset_y:-25;" />
    <style type="pointx.icon" style="key:82;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ29;offset_y:-25;" />
    <style type="pointx.icon" style="key:83;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ30;offset_y:-25;" />
    <style type="pointx.icon" style="key:84;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ31;offset_y:-25;" />
    <style type="pointx.icon" style="key:85;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ32;offset_y:-25;" />
    <style type="pointx.icon" style="key:86;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:ZZZZZZ01;offset_y:-25;" />

</style>
*/

// TOPMAR has many icons, all with offset_y:-25

const PCMMRK_TOPMAR_SYMBOL: SymbolLayerSpecification = {
    id: 'PCMMRK_TOPMAR_SYMBOL',
    type: 'symbol',
    ...SOURCE_DESC,
    filter:
        [
            'all',
            ['==', ['get', 'OBJL'], 144],
            [
                'match',
                ['get', 'CATEGORY'],
                [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
                    29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
                    55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
                    81, 82, 83, 84, 85, 86,
                ],
                true,
                false,
            ],
        ],
    layout: {
        'icon-allow-overlap': true,
        'icon-image':
            [
                'case',
                ['==', ['get', 'CATEGORY'], 1],
                'TMARDEF1',
                ['==', ['get', 'CATEGORY'], 2],
                'TMARDEF2',
                ['==', ['get', 'CATEGORY'], 3],
                'TOPMA114',
                ['==', ['get', 'CATEGORY'], 4],
                'TOPMA115',
                ['==', ['get', 'CATEGORY'], 5],
                'TOPMA116',
                ['==', ['get', 'CATEGORY'], 6],
                'TOPMA117',
                ['==', ['get', 'CATEGORY'], 7],
                'TOPMAR01',
                ['==', ['get', 'CATEGORY'], 8],
                'TOPMAR02',
                ['==', ['get', 'CATEGORY'], 9],
                'TOPMAR04',
                ['==', ['get', 'CATEGORY'], 10],
                'TOPMAR05',
                ['==', ['get', 'CATEGORY'], 11],
                'TOPMAR06',
                ['==', ['get', 'CATEGORY'], 12],
                'TOPMAR07',
                ['==', ['get', 'CATEGORY'], 13],
                'TOPMAR08',
                ['==', ['get', 'CATEGORY'], 14],
                'TOPMAR10',
                ['==', ['get', 'CATEGORY'], 15],
                'TOPMAR12',
                ['==', ['get', 'CATEGORY'], 16],
                'TOPMAR13',
                ['==', ['get', 'CATEGORY'], 17],
                'TOPMAR14',
                ['==', ['get', 'CATEGORY'], 18],
                'TOPMAR16',
                ['==', ['get', 'CATEGORY'], 19],
                'TOPMAR17',
                ['==', ['get', 'CATEGORY'], 20],
                'TOPMAR18',
                ['==', ['get', 'CATEGORY'], 21],
                'TOPMAR22',
                ['==', ['get', 'CATEGORY'], 22],
                'TOPMAR24',
                ['==', ['get', 'CATEGORY'], 23],
                'TOPMAR25',
                ['==', ['get', 'CATEGORY'], 24],
                'TOPMAR26',
                ['==', ['get', 'CATEGORY'], 25],
                'TOPMAR27',
                ['==', ['get', 'CATEGORY'], 26],
                'TOPMAR28',
                ['==', ['get', 'CATEGORY'], 27],
                'TOPMAR30',
                ['==', ['get', 'CATEGORY'], 28],
                'TOPMAR32',
                ['==', ['get', 'CATEGORY'], 29],
                'TOPMAR33',
                ['==', ['get', 'CATEGORY'], 30],
                'TOPMAR34',
                ['==', ['get', 'CATEGORY'], 31],
                'TOPMAR36',
                ['==', ['get', 'CATEGORY'], 32],
                'TOPMAR65',
                ['==', ['get', 'CATEGORY'], 33],
                'TOPMAR85',
                ['==', ['get', 'CATEGORY'], 34],
                'TOPMAR86',
                ['==', ['get', 'CATEGORY'], 35],
                'TOPMAR87',
                ['==', ['get', 'CATEGORY'], 36],
                'TOPMAR88',
                ['==', ['get', 'CATEGORY'], 37],
                'TOPMAR89',
                ['==', ['get', 'CATEGORY'], 38],
                'TOPMAR90',
                ['==', ['get', 'CATEGORY'], 39],
                'TOPMAR91',
                ['==', ['get', 'CATEGORY'], 40],
                'TOPMAR92',
                ['==', ['get', 'CATEGORY'], 41],
                'TOPMAR93',
                ['==', ['get', 'CATEGORY'], 42],
                'TOPMAR98',
                ['==', ['get', 'CATEGORY'], 43],
                'TOPMAR99',
                ['==', ['get', 'CATEGORY'], 44],
                'TOPSHP07',
                ['==', ['get', 'CATEGORY'], 45],
                'TOPSHP10',
                ['==', ['get', 'CATEGORY'], 46],
                'TOPSHP20',
                ['==', ['get', 'CATEGORY'], 47],
                'TOPSHP23',
                ['==', ['get', 'CATEGORY'], 48],
                'TOPSHP48',
                ['==', ['get', 'CATEGORY'], 49],
                'TOPSHP51',
                ['==', ['get', 'CATEGORY'], 50],
                'TOPSHP52',
                ['==', ['get', 'CATEGORY'], 51],
                'TOPSHP53',
                ['==', ['get', 'CATEGORY'], 52],
                'TOPSHP54',
                ['==', ['get', 'CATEGORY'], 53],
                'TOPSHPI1',
                ['==', ['get', 'CATEGORY'], 54],
                'TOPSHPI2',
                ['==', ['get', 'CATEGORY'], 55],
                'TOPSHPI3',
                ['==', ['get', 'CATEGORY'], 56],
                'TOPSHPJ1',
                ['==', ['get', 'CATEGORY'], 57],
                'TOPSHPJ3',
                ['==', ['get', 'CATEGORY'], 58],
                'TOPSHPP2',
                ['==', ['get', 'CATEGORY'], 59],
                'TOPSHPR1',
                ['==', ['get', 'CATEGORY'], 60],
                'TOPSHPT1',
                ['==', ['get', 'CATEGORY'], 61],
                'TOPSHPT2',
                ['==', ['get', 'CATEGORY'], 62],
                'TOPSHPT3',
                ['==', ['get', 'CATEGORY'], 63],
                'TOPSHPT4',
                ['==', ['get', 'CATEGORY'], 64],
                'TOPSHPT5',
                ['==', ['get', 'CATEGORY'], 65],
                'TOPSHPT6',
                ['==', ['get', 'CATEGORY'], 66],
                'TOPSHPT7',
                ['==', ['get', 'CATEGORY'], 67],
                'TOPSHPU2',
                ['==', ['get', 'CATEGORY'], 68],
                'TOPSHQ06',
                ['==', ['get', 'CATEGORY'], 69],
                'TOPSHQ07',
                ['==', ['get', 'CATEGORY'], 70],
                'TOPSHQ08',
                ['==', ['get', 'CATEGORY'], 71],
                'TOPSHQ17',
                ['==', ['get', 'CATEGORY'], 72],
                'TOPSHQ19',
                ['==', ['get', 'CATEGORY'], 73],
                'TOPSHQ20',
                ['==', ['get', 'CATEGORY'], 74],
                'TOPSHQ21',
                ['==', ['get', 'CATEGORY'], 75],
                'TOPSHQ22',
                ['==', ['get', 'CATEGORY'], 76],
                'TOPSHQ23',
                ['==', ['get', 'CATEGORY'], 77],
                'TOPSHQ24',
                ['==', ['get', 'CATEGORY'], 78],
                'TOPSHQ25',
                ['==', ['get', 'CATEGORY'], 79],
                'TOPSHQ26',
                ['==', ['get', 'CATEGORY'], 80],
                'TOPSHQ27',
                ['==', ['get', 'CATEGORY'], 81],
                'TOPSHQ28',
                ['==', ['get', 'CATEGORY'], 82],
                'TOPSHQ29',
                ['==', ['get', 'CATEGORY'], 83],
                'TOPSHQ30',
                ['==', ['get', 'CATEGORY'], 84],
                'TOPSHQ31',
                ['==', ['get', 'CATEGORY'], 85],
                'TOPSHQ32',
                ['==', ['get', 'CATEGORY'], 86],
                'ZZZZZZ01',
                'TMARDEF1',
            ],
        'icon-offset': [0, -25],
        'icon-size': 100
    },
    paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_TOPMAR_SYMBOL]

export default {
    symbols,
}
