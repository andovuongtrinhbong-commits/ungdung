import { StampAsset } from './types';

export const MIN_SCALE = 0.1;
export const MAX_SCALE = 10;
export const BRUSH_TEXTURE_URLS = [
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenda.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nendatbt.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nendatnut.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nendanham.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nendaxam.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nendavang.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenbang1.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenbang2.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenbang3.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenbang4.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/brushtexturemap2d/nenbang5.png'
];
const FOLDER_1_ASSETS = [
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%201.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%202.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%203.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%204.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%205.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%206.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%207.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%208.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%209.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2010.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2011.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2012.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2013.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2014.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2015.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2016.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2017.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2018.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2019.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2020.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2021.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2022.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2023.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2024.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2025.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2026.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2027.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2028.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2029.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2030.png','https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap1/Moutains%2031.png'
].map(src => ({ src, category: '1' }));

const FOLDER_2_ASSETS = [
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap2/cayda.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap2/caytre.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap2/caydua.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap2/caysen.png',
    'https://raw.githubusercontent.com/tttkvn/Upanh/main/stamptoolmap2/chuoi.png'
].map(src => ({ src, category: '2' }));

export const INITIAL_STAMP_ASSETS: {src: string, category: string}[] = [...FOLDER_1_ASSETS, ...FOLDER_2_ASSETS];
