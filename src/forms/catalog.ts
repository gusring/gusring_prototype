import { birthReport } from './birthReport';
import { FormDef, L } from './types';

// 문서 선택 화면에 보이는 서식 목록. 카테고리·제목·설명은 gusring-web과 동일.

export type CategoryKey = 'FAMILY' | 'CERT' | 'RESIDENCE' | 'ID_SEAL' | 'VEHICLE';

export const categories: Record<CategoryKey, L> = {
  FAMILY:    { ko: '가족관계',   en: 'Family',       zh: '家庭', ja: '家族', vi: 'Gia đình' },
  CERT:      { ko: '증명서',     en: 'Certificates', zh: '证明', ja: '証明', vi: 'Giấy chứng nhận' },
  RESIDENCE: { ko: '체류/주거',  en: 'Residence',    zh: '居住', ja: '居住', vi: 'Cư trú' },
  ID_SEAL:   { ko: '신분/인감',  en: 'ID/Seal',      zh: '身份', ja: '身分', vi: 'Căn cước/con dấu' },
  VEHICLE:   { ko: '차량/이륜차', en: 'Vehicle',     zh: '车辆', ja: '車両', vi: 'Xe cộ' },
};

export interface CatalogItem {
  cat: CategoryKey;
  desc: L;
  form: FormDef;
}

export const catalog: CatalogItem[] = [
  {
    cat: 'FAMILY',
    desc: {
      ko: '자녀가 태어난 후 법적 등록을 위해 작성하는 신고서입니다.',
      en: 'A report to legally register a child after birth.',
      zh: '孩子出生后为了法律登记而填写的申报书。',
      ja: '子供が生まれた後、法的登録のために作成する届出書です。',
      vi: 'Đơn đăng ký hợp pháp cho trẻ sau khi sinh.',
    },
    form: birthReport,
  },
];

export const findForm = (id: string) => catalog.find((c) => c.form.id === id)?.form;
