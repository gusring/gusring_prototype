import { X } from 'lucide-react';
import { isFilled, summaryKo } from '../forms/render';
import { FormDef, Lang, Values } from '../forms/types';
import { tr, UI } from '../i18n';

interface Props {
  form: FormDef;
  values: Values;
  lang: Lang;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function FieldListSheet({ form, values, lang, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <section className="relative w-full sm:max-w-lg bg-white rounded-t-[28px] shadow-sheet animate-sheet-up max-h-[80dvh] flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <h2 className="font-black text-[17px]">{tr(UI.allFields, lang)}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-line flex items-center justify-center text-sub" aria-label={tr(UI.close, lang)}>
            <X size={16} />
          </button>
        </header>
        <div className="overflow-y-auto px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-4">
          {form.sections.map((s) => {
            const items = form.fields.map((f, i) => ({ f, i })).filter(({ f }) => f.section === s.id);
            if (!items.length) return null;
            return (
              <div key={s.id}>
                <p className="px-1 mb-1.5 text-[11px] font-black text-brand-700 tracking-wide">{tr(s.label, lang)}</p>
                <div className="space-y-1.5">
                  {items.map(({ f, i }) => {
                    const filled = isFilled(f, values[f.id]);
                    return (
                      <button
                        key={f.id}
                        onClick={() => onSelect(f.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white border border-line text-left active:scale-[0.98] transition"
                      >
                        <span
                          className={`w-7 h-7 rounded-full text-[12px] font-black flex items-center justify-center shrink-0 ${
                            filled ? 'bg-green-600 text-white' : f.required ? 'bg-brand text-brand-950' : 'bg-line text-sub'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[14px] font-bold text-gray-900 truncate">
                            {tr(f.label, lang)}
                            {f.required && <span className="text-red-500"> *</span>}
                          </span>
                          <span className={`block text-[12px] truncate ${filled ? 'text-ink font-semibold' : 'text-hint'}`}>
                            {filled ? summaryKo(f, values[f.id]) : tr(UI.empty, lang)}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
