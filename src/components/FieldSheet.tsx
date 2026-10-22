import { ChevronLeft, ChevronRight, Copy, Info, X } from 'lucide-react';
import { isFilled } from '../forms/render';
import { Box, FieldDef, FieldValue, FormDef, Lang, Values } from '../forms/types';
import { tr, UI } from '../i18n';
import FieldInputs from './FieldInputs';
import FormSvg from './FormSvg';

interface Props {
  form: FormDef;
  field: FieldDef;
  index: number;
  values: Values;
  lang: Lang;
  onChange: (id: string, value: FieldValue) => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

/** 미리보기로 잘라낼 영역: 칸 + (좁은 칸이면) 왼쪽의 한국어 라벨 */
function previewCrop(field: FieldDef, form: FormDef): Box {
  const a = field.area;
  const left = a.w < 420 ? 120 : 16;
  const right = field.badge === 'margin' ? 0 : 16;
  let x = Math.max(0, a.x - left);
  let w = Math.min(form.width, a.x + a.w + right) - x;
  const h = a.h + 20;
  // 세로로 긴 칸은 미리보기가 너무 커지지 않도록 가로 폭을 넓힌다
  if (w < h * 3) {
    const grow = h * 3 - w;
    x = Math.max(0, Math.min(form.width - h * 3, x - grow / 2));
    w = h * 3;
  }
  return { x, y: a.y - 10, w, h };
}

export default function FieldSheet({ form, field, index, values, lang, onChange, onPrev, onNext, onClose }: Props) {
  const value = values[field.id] ?? {};
  const isLast = index === form.fields.length - 1;
  const crop = previewCrop(field, form);
  const sources = (field.copyFrom ?? []).filter((c) => isFilled(form.fields.find((f) => f.id === c.field)!, values[c.field]));

  const copy = (sourceId: string, map: Record<string, string>) => {
    const src = values[sourceId] ?? {};
    const next = { ...value };
    for (const [from, to] of Object.entries(map)) next[to] = src[from] ?? '';
    onChange(field.id, next);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center pointer-events-none">
      <section
        className="pointer-events-auto w-full sm:max-w-lg bg-white rounded-t-[28px] shadow-sheet animate-sheet-up flex flex-col max-h-[68dvh]"
        aria-label={tr(field.label, lang)}
      >
        {/* 핸들 + 헤더 */}
        <div className="pt-2.5 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <header className="flex items-start gap-3 px-5 pt-3 pb-2 shrink-0">
          <span className="w-8 h-8 rounded-full bg-gray-900 text-brand text-sm font-black flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-black text-[17px] leading-tight text-gray-900">{tr(field.label, lang)}</h2>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${field.required ? 'bg-brand text-brand-950' : 'bg-line text-sub'}`}>
                {tr(field.required ? UI.required : UI.optional, lang)}
              </span>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-hint truncate">
              {tr(UI.onKoreanForm, lang)}: <span className="text-sub">{field.koLabel}</span>
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 -mr-1 rounded-full bg-line flex items-center justify-center text-sub shrink-0" aria-label={tr(UI.close, lang)}>
            <X size={16} />
          </button>
        </header>

        <div className="overflow-y-auto px-5 pb-4 space-y-4">
          {/* 모국어 안내 */}
          <div className="flex gap-2.5 p-3.5 rounded-2xl bg-brand-soft border border-brand/30">
            <Info size={16} className="text-brand-700 shrink-0 mt-0.5" />
            <p className="text-[13.5px] leading-relaxed text-gray-800 font-medium">{tr(field.help, lang)}</p>
          </div>

          {/* 다른 항목에서 복사 */}
          {sources.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sources.map((s) => (
                <button
                  key={s.field}
                  type="button"
                  onClick={() => copy(s.field, s.map)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-[12px] font-bold text-gray-700 active:scale-95 transition"
                >
                  <Copy size={12} /> {tr(s.label, lang)}
                </button>
              ))}
            </div>
          )}

          <FieldInputs
            key={field.id}
            field={field}
            value={value}
            lang={lang}
            onChange={(v) => onChange(field.id, v)}
            onSubmit={isLast ? onClose : onNext}
          />

          {/* 한국어 서식 미리보기 */}
          <div>
            <p className="text-[11px] font-black text-brand-700 uppercase tracking-wide mb-1.5">{tr(UI.preview, lang)}</p>
            <div className="rounded-xl border border-line overflow-x-auto bg-white">
              <FormSvg
                form={form}
                values={values}
                crop={crop}
                highlightId={field.id}
                className="block"
                style={{ width: `max(100%, ${Math.round(crop.w * 0.6)}px)` }}
              />
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <footer className="shrink-0 flex gap-2 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-line">
          <button
            onClick={onPrev}
            disabled={index === 0}
            className="h-12 px-4 rounded-2xl bg-line text-gray-700 font-bold text-sm flex items-center gap-1 disabled:opacity-40"
          >
            <ChevronLeft size={16} /> {tr(UI.prev, lang)}
          </button>
          <button
            onClick={() => onChange(field.id, {})}
            className="h-12 px-4 rounded-2xl bg-white border border-gray-200 text-sub font-bold text-sm"
          >
            {tr(UI.clear, lang)}
          </button>
          <button
            onClick={isLast ? onClose : onNext}
            className="flex-1 h-12 rounded-2xl bg-brand text-brand-950 font-black text-sm flex items-center justify-center gap-1 shadow-[0_3px_12px_rgba(254,219,2,0.45)] active:scale-[0.97] transition"
          >
            {isLast ? tr(UI.save, lang) : tr(UI.saveNext, lang)} {!isLast && <ChevronRight size={16} />}
          </button>
        </footer>
      </section>
    </div>
  );
}
