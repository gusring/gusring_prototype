import { findCountry, KOREA, OTHER_COUNTRY } from './countries';
import { Box, FieldDef, FieldValue, Mark, Part } from './types';

// ─────────────────────────────────────────────────────────────
// 입력값 → 서식 위 표시(Mark) 변환
// 화면(SVG)과 출력(Canvas)이 같은 Mark를 그리므로 결과가 일치한다.
// ─────────────────────────────────────────────────────────────

export const FORM_FONT = '"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
export const FORM_FONT_WEIGHT = 600;
export const INK = '#1d3c9c';

const BASE_SIZE = 19;
const MIN_SIZE = 8;

let measureCtx: CanvasRenderingContext2D | null = null;
const measure = (text: string, size: number) => {
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
  if (!measureCtx) return text.length * size;
  measureCtx.font = `${FORM_FONT_WEIGHT} ${size}px ${FORM_FONT}`;
  return measureCtx.measureText(text).width;
};

/** 칸 너비에 맞게 글자 크기를 줄인다 */
export const fitSize = (text: string, box: Box) => {
  let size = Math.min(BASE_SIZE, box.h * 0.68);
  while (size > MIN_SIZE && measure(text, size) > box.w - 4) size -= 0.5;
  return size;
};

const text = (box: Box, value: string | undefined): Mark[] => {
  const v = value?.trim();
  return v ? [{ kind: 'text', box, text: v, size: fitSize(v, box) }] : [];
};

const splitDate = (date?: string) => {
  const [y, m, d] = (date ?? '').split('-');
  return { y, m: m && String(Number(m)), d: d && String(Number(d)) };
};

const extraVisible = (extra: Part & { when?: string[] }, choice?: string) =>
  !extra.when || (!!choice && extra.when.includes(choice));

export function marksFor(field: FieldDef, value: FieldValue | undefined): Mark[] {
  if (!value) return [];
  const input = field.input;
  switch (input.kind) {
    case 'text':
      return input.parts.flatMap((p) => text(p.box, value[p.key]));
    case 'date': {
      const { y, m, d } = splitDate(value.date);
      return [...text(input.boxes.y, y), ...text(input.boxes.m, m), ...text(input.boxes.d, d)];
    }
    case 'datetime': {
      const { y, m, d } = splitDate(value.date);
      const [h, min] = (value.time ?? '').split(':');
      return [
        ...text(input.boxes.y, y), ...text(input.boxes.m, m), ...text(input.boxes.d, d),
        ...text(input.boxes.h, h), ...text(input.boxes.min, min),
      ];
    }
    case 'choice': {
      const opt = input.options.find((o) => o.value === value.choice);
      const marks: Mark[] = opt ? [{ kind: input.mark, at: opt.mark }] : [];
      if (input.extra && extraVisible(input.extra, value.choice)) marks.push(...text(input.extra.box, value[input.extra.key]));
      return marks;
    }
    case 'country':
      return text(input.box, countryKo(value));
    case 'idnum':
      return [...text(input.front, value.front), ...text(input.back, value.back)];
  }
}

const countryKo = (value: FieldValue) => {
  if (value.country === KOREA || value.country === OTHER_COUNTRY) return value.text;
  return findCountry(value.country)?.ko;
};

export function isFilled(field: FieldDef, value: FieldValue | undefined): boolean {
  if (!value) return false;
  const has = (k: string) => !!value[k]?.trim();
  const input = field.input;
  switch (input.kind) {
    case 'text':
      return input.parts.some((p) => has(p.key));
    case 'date':
      return has('date');
    case 'datetime':
      return has('date') && has('time');
    case 'choice':
      return has('choice') && (!input.extra?.when || !extraVisible(input.extra, value.choice) || has(input.extra.key));
    case 'country':
      return has('country') && !!countryKo(value)?.trim();
    case 'idnum':
      return has('front');
  }
}

/** 목록에 보여줄 한국어 요약 (서식에 실제로 들어가는 내용) */
export function summaryKo(field: FieldDef, value: FieldValue | undefined): string {
  if (!value || !isFilled(field, value)) return '';
  const input = field.input;
  switch (input.kind) {
    case 'text':
      return input.parts.map((p) => value[p.key]?.trim()).filter(Boolean).join(' · ');
    case 'date': {
      const { y, m, d } = splitDate(value.date);
      return `${y}년 ${m}월 ${d}일`;
    }
    case 'datetime': {
      const { y, m, d } = splitDate(value.date);
      const [h, min] = value.time.split(':');
      return `${y}년 ${m}월 ${d}일 ${h}시 ${min}분`;
    }
    case 'choice': {
      const opt = input.options.find((o) => o.value === value.choice);
      const extra = input.extra && extraVisible(input.extra, value.choice) ? value[input.extra.key]?.trim() : '';
      return [opt?.ko, extra].filter(Boolean).join(' · ');
    }
    case 'country':
      return countryKo(value) ?? '';
    case 'idnum':
      // 목록에서는 뒷자리를 가린다
      return `${value.front}-${'*'.repeat(value.back?.length ?? 0)}`;
  }
}

const HANGUL_ONLY = /^[\s가-힣ㄱ-ㅎㅏ-ㅣ]*$/;
const HAS_HANGUL = /[가-힣]/;
const HAS_LETTER = /\p{L}/u;

export type PartWarning = 'hangul' | 'korean';

export function partWarning(part: Part, v: string | undefined): PartWarning | null {
  const s = v?.trim();
  if (!s) return null;
  if (part.hangul && !HANGUL_ONLY.test(s)) return 'hangul';
  if (part.korean && HAS_LETTER.test(s) && !HAS_HANGUL.test(s)) return 'korean';
  return null;
}
