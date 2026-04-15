import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:39"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DAYSQR21;offset_y:-25;" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMA100;offset_y:-25;" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMA102;offset_y:-25;" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMA107;offset_y:-25;" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMA109;offset_y:-25;" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMA111;offset_y:-25;" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMA113;offset_y:-25;" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPMAR01;offset_y:-25;" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP00;offset_y:-25;" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP01;offset_y:-25;" />
    <style type="pointx.icon" style="key:11;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP02;offset_y:-25;" />
    <style type="pointx.icon" style="key:12;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP03;offset_y:-25;" />
    <style type="pointx.icon" style="key:13;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP04;offset_y:-25;" />
    <style type="pointx.icon" style="key:14;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP05;offset_y:-25;" />
    <style type="pointx.icon" style="key:15;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP08;offset_y:-25;" />
    <style type="pointx.icon" style="key:16;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP09;offset_y:-25;" />
    <style type="pointx.icon" style="key:17;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP10;offset_y:-25;" />
    <style type="pointx.icon" style="key:18;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP11;offset_y:-25;" />
    <style type="pointx.icon" style="key:19;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP12;offset_y:-25;" />
    <style type="pointx.icon" style="key:20;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP13;offset_y:-25;" />
    <style type="pointx.icon" style="key:21;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP15;offset_y:-25;" />
    <style type="pointx.icon" style="key:22;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP16;offset_y:-25;" />
    <style type="pointx.icon" style="key:23;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP17;offset_y:-25;" />
    <style type="pointx.icon" style="key:24;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP18;offset_y:-25;" />
    <style type="pointx.icon" style="key:25;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP19;offset_y:-25;" />
    <style type="pointx.icon" style="key:26;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP20;offset_y:-25;" />
    <style type="pointx.icon" style="key:27;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP21;offset_y:-25;" />
    <style type="pointx.icon" style="key:28;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP22;offset_y:-25;" />
    <style type="pointx.icon" style="key:29;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP23;offset_y:-25;" />
    <style type="pointx.icon" style="key:30;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP24;offset_y:-25;" />
    <style type="pointx.icon" style="key:31;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP25;offset_y:-25;" />
    <style type="pointx.icon" style="key:32;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP28;offset_y:-25;" />
    <style type="pointx.icon" style="key:33;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP29;offset_y:-25;" />
    <style type="pointx.icon" style="key:34;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP30;offset_y:-25;" />
    <style type="pointx.icon" style="key:35;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP31;offset_y:-25;" />
    <style type="pointx.icon" style="key:36;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP32;offset_y:-25;" />
    <style type="pointx.icon" style="key:37;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP33;offset_y:-25;" />
    <style type="pointx.icon" style="key:38;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP34;offset_y:-25;" />
    <style type="pointx.icon" style="key:39;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP35;offset_y:-25;" />
    <style type="pointx.icon" style="key:40;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP36;offset_y:-25;" />
    <style type="pointx.icon" style="key:41;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP37;offset_y:-25;" />
    <style type="pointx.icon" style="key:42;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP38;offset_y:-25;" />
    <style type="pointx.icon" style="key:43;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP40;offset_y:-25;" />
    <style type="pointx.icon" style="key:44;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP41;offset_y:-25;" />
    <style type="pointx.icon" style="key:45;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP42;offset_y:-25;" />
    <style type="pointx.icon" style="key:46;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP43;offset_y:-25;" />
    <style type="pointx.icon" style="key:47;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP44;offset_y:-25;" />
    <style type="pointx.icon" style="key:48;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP47;offset_y:-25;" />
    <style type="pointx.icon" style="key:49;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP48;offset_y:-25;" />
    <style type="pointx.icon" style="key:50;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP51;offset_y:-25;" />
    <style type="pointx.icon" style="key:51;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP55;offset_y:-25;" />
    <style type="pointx.icon" style="key:52;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP58;offset_y:-25;" />
    <style type="pointx.icon" style="key:53;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP61;offset_y:-25;" />
    <style type="pointx.icon" style="key:54;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP62;offset_y:-25;" />
    <style type="pointx.icon" style="key:55;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP63;offset_y:-25;" />
    <style type="pointx.icon" style="key:56;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP64;offset_y:-25;" />
    <style type="pointx.icon" style="key:57;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP65;offset_y:-25;" />
    <style type="pointx.icon" style="key:58;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP67;offset_y:-25;" />
    <style type="pointx.icon" style="key:59;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP69;offset_y:-25;" />
    <style type="pointx.icon" style="key:60;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP70;offset_y:-25;" />
    <style type="pointx.icon" style="key:61;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP71;offset_y:-25;" />
    <style type="pointx.icon" style="key:62;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP72;offset_y:-25;" />
    <style type="pointx.icon" style="key:63;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP73;offset_y:-25;" />
    <style type="pointx.icon" style="key:64;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP74;offset_y:-25;" />
    <style type="pointx.icon" style="key:65;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP76;offset_y:-25;" />
    <style type="pointx.icon" style="key:66;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP77;offset_y:-25;" />
    <style type="pointx.icon" style="key:67;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP78;offset_y:-25;" />
    <style type="pointx.icon" style="key:68;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP79;offset_y:-25;" />
    <style type="pointx.icon" style="key:69;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP80;offset_y:-25;" />
    <style type="pointx.icon" style="key:70;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP81;offset_y:-25;" />
    <style type="pointx.icon" style="key:71;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP82;offset_y:-25;" />
    <style type="pointx.icon" style="key:72;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP83;offset_y:-25;" />
    <style type="pointx.icon" style="key:73;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP84;offset_y:-25;" />
    <style type="pointx.icon" style="key:74;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP85;offset_y:-25;" />
    <style type="pointx.icon" style="key:75;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP87;offset_y:-25;" />
    <style type="pointx.icon" style="key:76;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP88;offset_y:-25;" />
    <style type="pointx.icon" style="key:77;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP89;offset_y:-25;" />
    <style type="pointx.icon" style="key:78;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP90;offset_y:-25;" />
    <style type="pointx.icon" style="key:79;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP91;offset_y:-25;" />
    <style type="pointx.icon" style="key:80;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP92;offset_y:-25;" />
    <style type="pointx.icon" style="key:81;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP93;offset_y:-25;" />
    <style type="pointx.icon" style="key:82;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP94;offset_y:-25;" />
    <style type="pointx.icon" style="key:83;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP95;offset_y:-25;" />
    <style type="pointx.icon" style="key:84;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP96;offset_y:-25;" />
    <style type="pointx.icon" style="key:85;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP97;offset_y:-25;" />
    <style type="pointx.icon" style="key:86;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP98;offset_y:-25;" />
    <style type="pointx.icon" style="key:87;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHP99;offset_y:-25;" />
    <style type="pointx.icon" style="key:88;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPA0;offset_y:-25;" />
    <style type="pointx.icon" style="key:89;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPA1;offset_y:-25;" />
    <style type="pointx.icon" style="key:90;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPA2;offset_y:-25;" />
    <style type="pointx.icon" style="key:91;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPA3;offset_y:-25;" />
    <style type="pointx.icon" style="key:92;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPA4;offset_y:-25;" />
    <style type="pointx.icon" style="key:93;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPA5;offset_y:-25;" />
    <style type="pointx.icon" style="key:94;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPA6;offset_y:-25;" />
    <style type="pointx.icon" style="key:95;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPA7;offset_y:-25;" />
    <style type="pointx.icon" style="key:96;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPA8;offset_y:-25;" />
    <style type="pointx.icon" style="key:97;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPA9;offset_y:-25;" />
    <style type="pointx.icon" style="key:98;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPB0;offset_y:-25;" />
    <style type="pointx.icon" style="key:99;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPD1;offset_y:-25;" />
    <style type="pointx.icon" style="key:100;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPD2;offset_y:-25;" />
    <style type="pointx.icon" style="key:101;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPD3;offset_y:-25;" />
    <style type="pointx.icon" style="key:102;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPI2;offset_y:-25;" />
    <style type="pointx.icon" style="key:103;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPS1;offset_y:-25;" />
    <style type="pointx.icon" style="key:104;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPT8;offset_y:-25;" />
    <style type="pointx.icon" style="key:105;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHPU1;offset_y:-25;" />
    <style type="pointx.icon" style="key:106;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ06;offset_y:-25;" />
    <style type="pointx.icon" style="key:107;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ07;offset_y:-25;" />
    <style type="pointx.icon" style="key:108;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ08;offset_y:-25;" />
    <style type="pointx.icon" style="key:109;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ15;offset_y:-25;" />
    <style type="pointx.icon" style="key:110;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ16;offset_y:-25;" />
    <style type="pointx.icon" style="key:111;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ17;offset_y:-25;" />
    <style type="pointx.icon" style="key:112;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ18;offset_y:-25;" />
    <style type="pointx.icon" style="key:113;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ19;offset_y:-25;" />
    <style type="pointx.icon" style="key:114;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ20;offset_y:-25;" />
    <style type="pointx.icon" style="key:115;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ21;offset_y:-25;" />
    <style type="pointx.icon" style="key:116;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ22;offset_y:-25;" />
    <style type="pointx.icon" style="key:117;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ23;offset_y:-25;" />
    <style type="pointx.icon" style="key:118;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ24;offset_y:-25;" />
    <style type="pointx.icon" style="key:119;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ25;offset_y:-25;" />
    <style type="pointx.icon" style="key:120;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ26;offset_y:-25;" />
    <style type="pointx.icon" style="key:121;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ27;offset_y:-25;" />
    <style type="pointx.icon" style="key:122;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ28;offset_y:-25;" />
    <style type="pointx.icon" style="key:123;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ29;offset_y:-25;" />
    <style type="pointx.icon" style="key:124;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ30;offset_y:-25;" />
    <style type="pointx.icon" style="key:125;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ31;offset_y:-25;" />
    <style type="pointx.icon" style="key:126;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOPSHQ32;offset_y:-25;" />
</style>

*/

// note: DAYMAR has many icons, all with offset_y:-25

const PCMMRK_DAYMAR_SYMBOL: SymbolLayerSpecification = {
    id: 'PCMMRK_DAYMAR_SYMBOL',
    type: 'symbol',
    ...SOURCE_DESC,
    filter: [
        'all',
        ['==', ['get', 'OBJL'], 39],
        [
            'match',
            ['get', 'CATEGORY'],
            [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
                29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
                55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
                81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104,
                105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125,
                126,
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
            'DAYSQR21',
            ['==', ['get', 'CATEGORY'], 2],
            'TOPMA100',
            ['==', ['get', 'CATEGORY'], 3],
            'TOPMA102',
            ['==', ['get', 'CATEGORY'], 4],
            'TOPMA107',
            ['==', ['get', 'CATEGORY'], 5],
            'TOPMA109',
            ['==', ['get', 'CATEGORY'], 6],
            'TOPMA111',
            ['==', ['get', 'CATEGORY'], 7],
            'TOPMA113',
            ['==', ['get', 'CATEGORY'], 8],
            'TOPMAR01',
            ['==', ['get', 'CATEGORY'], 9],
            'TOPSHP00',
            ['==', ['get', 'CATEGORY'], 10],
            'TOPSHP01',
            ['==', ['get', 'CATEGORY'], 11],
            'TOPSHP02',
            ['==', ['get', 'CATEGORY'], 12],
            'TOPSHP03',
            ['==', ['get', 'CATEGORY'], 13],
            'TOPSHP04',
            ['==', ['get', 'CATEGORY'], 14],
            'TOPSHP05',
            ['==', ['get', 'CATEGORY'], 15],
            'TOPSHP08',
            ['==', ['get', 'CATEGORY'], 16],
            'TOPSHP09',
            ['==', ['get', 'CATEGORY'], 17],
            'TOPSHP10',
            ['==', ['get', 'CATEGORY'], 18],
            'TOPSHP11',
            ['==', ['get', 'CATEGORY'], 19],
            'TOPSHP12',
            ['==', ['get', 'CATEGORY'], 20],
            'TOPSHP13',
            ['==', ['get', 'CATEGORY'], 21],
            'TOPSHP15',
            ['==', ['get', 'CATEGORY'], 22],
            'TOPSHP16',
            ['==', ['get', 'CATEGORY'], 23],
            'TOPSHP17',
            ['==', ['get', 'CATEGORY'], 24],
            'TOPSHP18',
            ['==', ['get', 'CATEGORY'], 25],
            'TOPSHP19',
            ['==', ['get', 'CATEGORY'], 26],
            'TOPSHP20',
            ['==', ['get', 'CATEGORY'], 27],
            'TOPSHP21',
            ['==', ['get', 'CATEGORY'], 28],
            'TOPSHP22',
            ['==', ['get', 'CATEGORY'], 29],
            'TOPSHP23',
            ['==', ['get', 'CATEGORY'], 30],
            'TOPSHP24',
            ['==', ['get', 'CATEGORY'], 31],
            'TOPSHP25',
            ['==', ['get', 'CATEGORY'], 32],
            'TOPSHP28',
            ['==', ['get', 'CATEGORY'], 33],
            'TOPSHP29',
            ['==', ['get', 'CATEGORY'], 34],
            'TOPSHP30',
            ['==', ['get', 'CATEGORY'], 35],
            'TOPSHP31',
            ['==', ['get', 'CATEGORY'], 36],
            'TOPSHP32',
            ['==', ['get', 'CATEGORY'], 37],
            'TOPSHP32',
            ['==', ['get', 'CATEGORY'], 38],
            'TOPSHP34',
            ['==', ['get', 'CATEGORY'], 39],
            'TOPSHP35',
            ['==', ['get', 'CATEGORY'], 40],
            'TOPSHP36',
            ['==', ['get', 'CATEGORY'], 41],
            'TOPSHP37',
            ['==', ['get', 'CATEGORY'], 42],
            'TOPSHP38',
            ['==', ['get', 'CATEGORY'], 43],
            'TOPSHP40',
            ['==', ['get', 'CATEGORY'], 44],
            'TOPSHP41',
            ['==', ['get', 'CATEGORY'], 45],
            'TOPSHP42',
            ['==', ['get', 'CATEGORY'], 46],
            'TOPSHP43',
            ['==', ['get', 'CATEGORY'], 47],
            'TOPSHP44',
            ['==', ['get', 'CATEGORY'], 48],
            'TOPSHP47',
            ['==', ['get', 'CATEGORY'], 49],
            'TOPSHP48',
            ['==', ['get', 'CATEGORY'], 50],
            'TOPSHP51',
            ['==', ['get', 'CATEGORY'], 51],
            'TOPSHP55',
            ['==', ['get', 'CATEGORY'], 52],
            'TOPSHP58',
            ['==', ['get', 'CATEGORY'], 53],
            'TOPSHP61',
            ['==', ['get', 'CATEGORY'], 54],
            'TOPSHP62',
            ['==', ['get', 'CATEGORY'], 55],
            'TOPSHP63',
            ['==', ['get', 'CATEGORY'], 56],
            'TOPSHP64',
            ['==', ['get', 'CATEGORY'], 57],
            'TOPSHP65',
            ['==', ['get', 'CATEGORY'], 58],
            'TOPSHP67',
            ['==', ['get', 'CATEGORY'], 59],
            'TOPSHP69',
            ['==', ['get', 'CATEGORY'], 60],
            'TOPSHP70',
            ['==', ['get', 'CATEGORY'], 61],
            'TOPSHP71',
            ['==', ['get', 'CATEGORY'], 62],
            'TOPSHP72',
            ['==', ['get', 'CATEGORY'], 63],
            'TOPSHP73',
            ['==', ['get', 'CATEGORY'], 64],
            'TOPSHP74',
            ['==', ['get', 'CATEGORY'], 65],
            'TOPSHP76',
            ['==', ['get', 'CATEGORY'], 66],
            'TOPSHP77',
            ['==', ['get', 'CATEGORY'], 67],
            'TOPSHP78',
            ['==', ['get', 'CATEGORY'], 68],
            'TOPSHP79',
            ['==', ['get', 'CATEGORY'], 69],
            'TOPSHP80',
            ['==', ['get', 'CATEGORY'], 70],
            'TOPSHP81',
            ['==', ['get', 'CATEGORY'], 71],
            'TOPSHP82',
            ['==', ['get', 'CATEGORY'], 72],
            'TOPSHP83',
            ['==', ['get', 'CATEGORY'], 73],
            'TOPSHP84',
            ['==', ['get', 'CATEGORY'], 74],
            'TOPSHP85',
            ['==', ['get', 'CATEGORY'], 75],
            'TOPSHP87',
            ['==', ['get', 'CATEGORY'], 76],
            'TOPSHP88',
            ['==', ['get', 'CATEGORY'], 77],
            'TOPSHP89',
            ['==', ['get', 'CATEGORY'], 78],
            'TOPSHP90',
            ['==', ['get', 'CATEGORY'], 79],
            'TOPSHP91',
            ['==', ['get', 'CATEGORY'], 80],
            'TOPSHP92',
            ['==', ['get', 'CATEGORY'], 81],
            'TOPSHP93',
            ['==', ['get', 'CATEGORY'], 82],
            'TOPSHP94',
            ['==', ['get', 'CATEGORY'], 83],
            'TOPSHP95',
            ['==', ['get', 'CATEGORY'], 84],
            'TOPSHP96',
            ['==', ['get', 'CATEGORY'], 85],
            'TOPSHP97',
            ['==', ['get', 'CATEGORY'], 86],
            'TOPSHP98',
            ['==', ['get', 'CATEGORY'], 87],
            'TOPSHP99',
            ['==', ['get', 'CATEGORY'], 88],
            'TOPSHPA0',
            ['==', ['get', 'CATEGORY'], 89],
            'TOPSHPA1',
            ['==', ['get', 'CATEGORY'], 90],
            'TOPSHPA2',
            ['==', ['get', 'CATEGORY'], 91],
            'TOPSHPA3',
            ['==', ['get', 'CATEGORY'], 92],
            'TOPSHPA4',
            ['==', ['get', 'CATEGORY'], 93],
            'TOPSHPA5',
            ['==', ['get', 'CATEGORY'], 94],
            'TOPSHPA6',
            ['==', ['get', 'CATEGORY'], 95],
            'TOPSHPA7',
            ['==', ['get', 'CATEGORY'], 96],
            'TOPSHPA8',
            ['==', ['get', 'CATEGORY'], 97],
            'TOPSHPA9',
            ['==', ['get', 'CATEGORY'], 98],
            'TOPSHPB0',
            ['==', ['get', 'CATEGORY'], 99],
            'TOPSHPD1',
            ['==', ['get', 'CATEGORY'], 100],
            'TOPSHPD2',
            ['==', ['get', 'CATEGORY'], 101],
            'TOPSHPD3',
            ['==', ['get', 'CATEGORY'], 102],
            'TOPSHPI2',
            ['==', ['get', 'CATEGORY'], 103],
            'TOPSHPS1',
            ['==', ['get', 'CATEGORY'], 104],
            'TOPSHPT8',
            ['==', ['get', 'CATEGORY'], 105],
            'TOPSHPU1',
            ['==', ['get', 'CATEGORY'], 106],
            'TOPSHQ06',
            ['==', ['get', 'CATEGORY'], 107],
            'TOPSHQ07',
            ['==', ['get', 'CATEGORY'], 108],
            'TOPSHQ08',
            ['==', ['get', 'CATEGORY'], 109],
            'TOPSHQ15',
            ['==', ['get', 'CATEGORY'], 110],
            'TOPSHQ16',
            ['==', ['get', 'CATEGORY'], 111],
            'TOPSHQ17',
            ['==', ['get', 'CATEGORY'], 112],
            'TOPSHQ18',
            ['==', ['get', 'CATEGORY'], 113],
            'TOPSHQ19',
            ['==', ['get', 'CATEGORY'], 114],
            'TOPSHQ20',
            ['==', ['get', 'CATEGORY'], 115],
            'TOPSHQ21',
            ['==', ['get', 'CATEGORY'], 116],
            'TOPSHQ22',
            ['==', ['get', 'CATEGORY'], 117],
            'TOPSHQ23',
            ['==', ['get', 'CATEGORY'], 118],
            'TOPSHQ24',
            ['==', ['get', 'CATEGORY'], 119],
            'TOPSHQ25',
            ['==', ['get', 'CATEGORY'], 120],
            'TOPSHQ26',
            ['==', ['get', 'CATEGORY'], 121],
            'TOPSHQ27',
            ['==', ['get', 'CATEGORY'], 122],
            'TOPSHQ28',
            ['==', ['get', 'CATEGORY'], 123],
            'TOPSHQ29',
            ['==', ['get', 'CATEGORY'], 124],
            'TOPSHQ30',
            ['==', ['get', 'CATEGORY'], 125],
            'TOPSHQ31',
            ['==', ['get', 'CATEGORY'], 126],
            'TOPSHQ32',
            'DAYSQR21',
        ],
        'icon-offset': [0, -15],
    },
    paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_DAYMAR_SYMBOL]

export default {
    symbols,
}
