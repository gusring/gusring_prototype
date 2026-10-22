import { L } from './types';

export interface Country {
  code: string;
  /** 서식에 들어가는 한국어 국가명 */
  ko: string;
  label: L;
}

export const KOREA = 'KR';
export const OTHER_COUNTRY = 'OTHER';

// 금천구 거주 외국인 비율이 높은 국가 위주
export const countries: Country[] = [
  { code: 'CN', ko: '중국',         label: { ko: '중국',         en: 'China',         zh: '中国',       ja: '中国',           vi: 'Trung Quốc' } },
  { code: 'VN', ko: '베트남',       label: { ko: '베트남',       en: 'Vietnam',       zh: '越南',       ja: 'ベトナム',       vi: 'Việt Nam' } },
  { code: 'UZ', ko: '우즈베키스탄', label: { ko: '우즈베키스탄', en: 'Uzbekistan',    zh: '乌兹别克斯坦', ja: 'ウズベキスタン', vi: 'Uzbekistan' } },
  { code: 'PH', ko: '필리핀',       label: { ko: '필리핀',       en: 'Philippines',   zh: '菲律宾',     ja: 'フィリピン',     vi: 'Philippines' } },
  { code: 'TH', ko: '태국',         label: { ko: '태국',         en: 'Thailand',      zh: '泰国',       ja: 'タイ',           vi: 'Thái Lan' } },
  { code: 'ID', ko: '인도네시아',   label: { ko: '인도네시아',   en: 'Indonesia',     zh: '印度尼西亚', ja: 'インドネシア',   vi: 'Indonesia' } },
  { code: 'NP', ko: '네팔',         label: { ko: '네팔',         en: 'Nepal',         zh: '尼泊尔',     ja: 'ネパール',       vi: 'Nepal' } },
  { code: 'KH', ko: '캄보디아',     label: { ko: '캄보디아',     en: 'Cambodia',      zh: '柬埔寨',     ja: 'カンボジア',     vi: 'Campuchia' } },
  { code: 'MN', ko: '몽골',         label: { ko: '몽골',         en: 'Mongolia',      zh: '蒙古',       ja: 'モンゴル',       vi: 'Mông Cổ' } },
  { code: 'MM', ko: '미얀마',       label: { ko: '미얀마',       en: 'Myanmar',       zh: '缅甸',       ja: 'ミャンマー',     vi: 'Myanmar' } },
  { code: 'KZ', ko: '카자흐스탄',   label: { ko: '카자흐스탄',   en: 'Kazakhstan',    zh: '哈萨克斯坦', ja: 'カザフスタン',   vi: 'Kazakhstan' } },
  { code: 'RU', ko: '러시아',       label: { ko: '러시아',       en: 'Russia',        zh: '俄罗斯',     ja: 'ロシア',         vi: 'Nga' } },
  { code: 'LK', ko: '스리랑카',     label: { ko: '스리랑카',     en: 'Sri Lanka',     zh: '斯里兰卡',   ja: 'スリランカ',     vi: 'Sri Lanka' } },
  { code: 'BD', ko: '방글라데시',   label: { ko: '방글라데시',   en: 'Bangladesh',    zh: '孟加拉国',   ja: 'バングラデシュ', vi: 'Bangladesh' } },
  { code: 'JP', ko: '일본',         label: { ko: '일본',         en: 'Japan',         zh: '日本',       ja: '日本',           vi: 'Nhật Bản' } },
  { code: 'TW', ko: '대만',         label: { ko: '대만',         en: 'Taiwan',        zh: '台湾',       ja: '台湾',           vi: 'Đài Loan' } },
  { code: 'US', ko: '미국',         label: { ko: '미국',         en: 'United States', zh: '美国',       ja: 'アメリカ',       vi: 'Hoa Kỳ' } },
];

export const koreaLabel: L = {
  ko: '대한민국 (한국인)',
  en: 'Republic of Korea (Korean national)',
  zh: '大韩民国（韩国人）',
  ja: '大韓民国（韓国人）',
  vi: 'Hàn Quốc (người Hàn)',
};

export const findCountry = (code: string) => countries.find((c) => c.code === code);
