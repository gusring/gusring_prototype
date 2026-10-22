// ─────────────────────────────────────────────────────────────
// 서식 정의 타입
// 좌표(Box, Point)는 모두 원본 서식 이미지의 픽셀 단위다.
// ─────────────────────────────────────────────────────────────

export type Lang = 'ko' | 'en' | 'zh' | 'ja' | 'vi';

/** 다국어 문자열 */
export type L = Record<Lang, string>;

export type Align = 'left' | 'center' | 'right';

/** 서식 위 사각형 영역 (값을 써 넣을 자리) */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  align?: Align;
}

export interface Point {
  x: number;
  y: number;
}

/** 텍스트 입력 한 칸 */
export interface Part {
  key: string;
  box: Box;
  label?: L;
  placeholder?: string;
  /** 한글로만 써야 하는 칸 (이름 등) */
  hangul?: boolean;
  /** 한국어로 써야 하는 칸 (주소 등) — 한글이 하나도 없으면 경고 */
  korean?: boolean;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
  /** 있으면 셀렉트로 입력. value가 서식에 그대로 들어간다(한국어). */
  options?: { value: string; label: L }[];
}

export interface ChoiceOption {
  value: string;
  label: L;
  /** 서식에 표시되는 한국어 (요약/미리보기용) */
  ko: string;
  /** ○ 또는 ✓를 그릴 위치 */
  mark: Point;
}

export type InputSpec =
  | { kind: 'text'; parts: Part[] }
  | { kind: 'date'; boxes: { y: Box; m: Box; d: Box } }
  | { kind: 'datetime'; boxes: { y: Box; m: Box; d: Box; h: Box; min: Box } }
  | {
      kind: 'choice';
      /** circle: 번호에 영표(○), check: □에 ✓ */
      mark: 'circle' | 'check';
      options: ChoiceOption[];
      /** 추가 입력칸. when이 있으면 해당 선택일 때만 보인다. */
      extra?: Part & { when?: string[] };
    }
  | { kind: 'country'; box: Box; allowKorea?: boolean }
  | { kind: 'idnum'; front: Box; back: Box };

/** 다른 항목 값을 복사해 오는 단축 버튼 */
export interface CopySource {
  field: string;
  label: L;
  /** 원본 key → 대상 key */
  map: Record<string, string>;
}

export interface FieldDef {
  id: string;
  section: string;
  required?: boolean;
  /** 원본 한국어 서식의 칸 이름 */
  koLabel: string;
  label: L;
  help: L;
  /** 서식 위에서 탭할 수 있는 영역 */
  area: Box;
  input: InputSpec;
  copyFrom?: CopySource[];
  /** 'margin': 번호 토글을 칸 안이 아닌 표 오른쪽 여백에 표시 */
  badge?: 'margin';
}

export interface FormDef {
  id: string;
  title: L;
  image: string;
  width: number;
  height: number;
  sections: { id: string; label: L }[];
  fields: FieldDef[];
}

/** 항목 하나의 입력값. key는 InputSpec 종류별로 다르다. */
export type FieldValue = Record<string, string>;
export type Values = Record<string, FieldValue>;

/** 서식 위에 그려지는 요소 */
export type Mark =
  | { kind: 'text'; box: Box; text: string; size: number }
  | { kind: 'circle'; at: Point }
  | { kind: 'check'; at: Point };
