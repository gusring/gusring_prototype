import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Copy, Info, X } from 'lucide-react';
import { isFilled } from '../forms/render';
import { FieldDef, FieldValue, FormDef, Lang, Values } from '../forms/types';
import { tr, UI } from '../i18n';
import FieldInputs from './FieldInputs';

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
  /** 시트 높이가 바뀔 때 — 서식을 시트 위 남은 공간에 맞춰 확대하는 데 쓴다 */
  onHeight: (px: number) => void;
}

export default function FieldSheet({ form, field, index, values, lang, onChange, onPrev, onNext, onClose, onHeight }: Props) {
  const value = values[field.id] ?? {};
  const isLast = index === form.fields.length - 1;
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => onHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [onHeight]);
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
        ref={sheetRef}
        className="pointer-events-auto w-full sm:max-w-md bg-white rounded-t-[28px] shadow-sheet animate-sheet-up flex flex-col max-h-[68dvh]"
        aria-label={tr(field.label, lang)}
      >
        {/* 핸들 + 헤더 */}
        <div className="pt-2.5 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <header className="flex items-center gap-3 px-5 pt-3 pb-2 shrink-0">
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
