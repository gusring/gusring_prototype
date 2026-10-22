import type { CSSProperties } from 'react';
import { FORM_FONT, FORM_FONT_WEIGHT, INK, marksFor } from '../forms/render';
import { Box, FieldDef, FormDef, Mark, Point, Values } from '../forms/types';

// ─────────────────────────────────────────────────────────────
// 한국어 원본 서식 이미지 + 입력값(Mark) + 번호 토글(가이드)
// viewBox를 바꾸면 같은 컴포넌트로 특정 칸만 잘라 보여줄 수 있다.
// ─────────────────────────────────────────────────────────────

const BADGE_R = 16;
/** 칸 안에 번호를 넣으면 선택지와 겹치는 항목은 표 오른쪽 여백에 표시 */
const MARGIN_X = 1072;

export function badgePoint(field: FieldDef): Point {
  const a = field.area;
  const cy = a.h > 50 ? a.y + BADGE_R + 2 : a.y + a.h / 2;
  if (field.badge === 'margin') return { x: MARGIN_X, y: a.y + a.h / 2 };
  return { x: a.x + BADGE_R + 2, y: cy };
}

export function MarkView({ mark }: { mark: Mark }) {
  switch (mark.kind) {
    case 'text': {
      const { box } = mark;
      const align = box.align ?? 'left';
      const x = align === 'left' ? box.x : align === 'center' ? box.x + box.w / 2 : box.x + box.w;
      return (
        <text
          x={x}
          y={box.y + box.h / 2}
          fontSize={mark.size}
          fontFamily={FORM_FONT}
          fontWeight={FORM_FONT_WEIGHT}
          fill={INK}
          dominantBaseline="central"
          textAnchor={align === 'left' ? 'start' : align === 'center' ? 'middle' : 'end'}
        >
          {mark.text}
        </text>
      );
    }
    case 'circle':
      return <circle cx={mark.at.x} cy={mark.at.y} r={15} fill="none" stroke={INK} strokeWidth={2.8} />;
    case 'check':
      return (
        <path
          d={`M${mark.at.x - 8} ${mark.at.y} L${mark.at.x - 2} ${mark.at.y + 7} L${mark.at.x + 10} ${mark.at.y - 10}`}
          fill="none"
          stroke={INK}
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
  }
}

interface Guides {
  activeId: string | null;
  filled: Set<string>;
  onSelect: (id: string) => void;
}

interface Props {
  form: FormDef;
  values: Values;
  /** 잘라서 보여줄 영역 (없으면 서식 전체) */
  crop?: Box;
  guides?: Guides;
  /** 강조 테두리만 그릴 항목 (미리보기용) */
  highlightId?: string;
  className?: string;
  style?: CSSProperties;
}

export default function FormSvg({ form, values, crop, guides, highlightId, className, style }: Props) {
  const vb = crop ?? { x: 0, y: 0, w: form.width, h: form.height };

  return (
    <svg
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      className={className}
      style={style}
      role="img"
      aria-label={form.title.ko}
    >
      <image href={form.image} x={0} y={0} width={form.width} height={form.height} />

      {/* 영역 하이라이트 */}
      {guides &&
        form.fields.map((f) => {
          const active = guides.activeId === f.id;
          const filled = guides.filled.has(f.id);
          const fill = active
            ? 'rgba(254,219,2,0.32)'
            : filled
              ? 'rgba(22,163,74,0.06)'
              : f.required
                ? 'rgba(254,219,2,0.22)'
                : 'rgba(148,163,184,0.14)';
          return (
            <rect
              key={`area-${f.id}`}
              x={f.area.x + 1}
              y={f.area.y + 1}
              width={f.area.w - 2}
              height={f.area.h - 2}
              fill={fill}
              stroke={active ? '#d4b500' : 'none'}
              strokeWidth={active ? 4 : 0}
              rx={4}
              style={{ cursor: 'pointer' }}
              onClick={() => guides.onSelect(f.id)}
            />
          );
        })}

      {highlightId && (() => {
        const f = form.fields.find((x) => x.id === highlightId);
        return f ? (
          <rect x={f.area.x} y={f.area.y} width={f.area.w} height={f.area.h} fill="rgba(254,219,2,0.18)" stroke="#d4b500" strokeWidth={3} rx={4} />
        ) : null;
      })()}

      {/* 입력값 */}
      <g pointerEvents="none">
        {form.fields.flatMap((f) => marksFor(f, values[f.id]).map((m, i) => <MarkView key={`${f.id}-${i}`} mark={m} />))}
      </g>

      {/* 번호 토글 */}
      {guides &&
        form.fields.map((f, idx) => {
          const p = badgePoint(f);
          const active = guides.activeId === f.id;
          const filled = guides.filled.has(f.id);
          const bg = active ? '#111827' : filled ? '#16a34a' : f.required ? '#fedb02' : '#ffffff';
          const fg = active ? '#fedb02' : filled ? '#ffffff' : '#2e2800';
          return (
            <g
              key={`badge-${f.id}`}
              onClick={() => guides.onSelect(f.id)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label={`${idx + 1}`}
            >
              <circle cx={p.x} cy={p.y} r={BADGE_R + (active ? 3 : 0)} fill={bg} stroke={filled || active ? 'none' : '#a08800'} strokeWidth={1.5} />
              <text
                x={p.x}
                y={p.y + 0.5}
                fontSize={idx + 1 >= 10 ? 15 : 17}
                fontWeight={800}
                fontFamily={FORM_FONT}
                fill={fg}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {idx + 1}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
