import { useRef } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { countries, findCountry, KOREA, koreaLabel, OTHER_COUNTRY } from '../forms/countries';
import { partWarning } from '../forms/render';
import { FieldDef, FieldValue, Lang, Part } from '../forms/types';
import { tr, UI } from '../i18n';

// ─────────────────────────────────────────────────────────────
// 입력 종류(InputSpec.kind)별 입력 UI
// 값은 입력 즉시 onChange로 올라가 서식에 바로 반영된다.
// ─────────────────────────────────────────────────────────────

interface Props {
  field: FieldDef;
  value: FieldValue;
  lang: Lang;
  onChange: (next: FieldValue) => void;
  /** 마지막 입력칸에서 Enter */
  onSubmit: () => void;
}

const inputCls =
  'w-full rounded-2xl px-4 py-3.5 text-[15px] font-semibold bg-line text-gray-900 placeholder:text-hint outline-none border-2 border-transparent focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/30 transition';

const labelCls = 'block text-[12px] font-bold text-sub mb-1.5';

function Warning({ kind, lang }: { kind: 'hangul' | 'korean'; lang: Lang }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-amber-700">
      <AlertCircle size={13} /> {tr(kind === 'hangul' ? UI.hangulWarn : UI.koreanWarn, lang)}
    </p>
  );
}

function PartInput({ part, value, lang, onChange, onEnter, autoFocus, fallbackLabel }: {
  part: Part;
  value: string;
  lang: Lang;
  onChange: (v: string) => void;
  onEnter?: () => void;
  autoFocus?: boolean;
  fallbackLabel?: string;
}) {
  const label = part.label ? tr(part.label, lang) : fallbackLabel;
  const warn = partWarning(part, value);

  return (
    <div>
      {label && <label className={labelCls}>{label}</label>}
      {part.options ? (
        <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">{tr(UI.selectPlease, lang)}</option>
          {part.options.map((o) => (
            <option key={o.value} value={o.value}>{tr(o.label, lang)}</option>
          ))}
        </select>
      ) : (
        <input
          className={inputCls}
          value={value}
          placeholder={part.placeholder}
          inputMode={part.inputMode}
          type={part.inputMode === 'email' ? 'email' : part.inputMode === 'tel' ? 'tel' : 'text'}
          autoFocus={autoFocus}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && onEnter) { e.preventDefault(); onEnter(); } }}
        />
      )}
      {warn && <Warning kind={warn} lang={lang} />}
    </div>
  );
}

export default function FieldInputs({ field, value, lang, onChange, onSubmit }: Props) {
  const input = field.input;
  const set = (patch: FieldValue) => onChange({ ...value, ...patch });
  const backRef = useRef<HTMLInputElement>(null);

  switch (input.kind) {
    case 'text':
      return (
        <div className={input.parts.length > 1 ? 'grid grid-cols-2 gap-3' : ''}>
          {input.parts.map((p, i) => (
            <PartInput
              key={p.key}
              part={p}
              lang={lang}
              value={value[p.key] ?? ''}
              autoFocus={i === 0}
              onChange={(v) => set({ [p.key]: v })}
              onEnter={i === input.parts.length - 1 ? onSubmit : undefined}
            />
          ))}
        </div>
      );

    case 'date':
      return (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className={labelCls}>{tr(UI.date, lang)}</label>
            <input type="date" className={inputCls} value={value.date ?? ''} onChange={(e) => set({ date: e.target.value })} />
          </div>
          <button
            type="button"
            className="shrink-0 h-[52px] px-4 rounded-2xl bg-brand-soft text-brand-950 font-bold text-sm border border-brand/40 active:scale-95 transition"
            onClick={() => set({ date: localToday() })}
          >
            {tr(UI.today, lang)}
          </button>
        </div>
      );

    case 'datetime':
      return (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{tr(UI.date, lang)}</label>
            <input type="date" className={inputCls} value={value.date ?? ''} onChange={(e) => set({ date: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>{tr(UI.time24, lang)}</label>
            <input type="time" className={inputCls} value={value.time ?? ''} onChange={(e) => set({ time: e.target.value })} />
          </div>
        </div>
      );

    case 'choice': {
      const extraShown = input.extra && (!input.extra.when || (value.choice && input.extra.when.includes(value.choice)));
      return (
        <div className="space-y-3">
          <div className="grid gap-2">
            {input.options.map((o) => {
              const selected = value.choice === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => set({ choice: selected ? '' : o.value })}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition active:scale-[0.98] ${
                    selected ? 'border-brand bg-brand-soft' : 'border-line bg-white'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-brand-950 bg-brand' : 'border-gray-300'}`}>
                    {selected && <Check size={12} strokeWidth={3} className="text-brand-950" />}
                  </span>
                  <span className="flex-1 font-bold text-[15px] text-gray-900">{tr(o.label, lang)}</span>
                  {lang !== 'ko' && <span className="text-[12px] font-semibold text-hint">{o.ko}</span>}
                </button>
              );
            })}
          </div>
          {extraShown && input.extra && (
            <PartInput
              part={input.extra}
              lang={lang}
              value={value[input.extra.key] ?? ''}
              onChange={(v) => set({ [input.extra!.key]: v })}
              onEnter={onSubmit}
            />
          )}
        </div>
      );
    }

    case 'country': {
      const code = value.country ?? '';
      const country = findCountry(code);
      return (
        <div className="space-y-3">
          <select className={inputCls} value={code} onChange={(e) => set({ country: e.target.value, text: '' })}>
            <option value="">{tr(UI.selectCountry, lang)}</option>
            {input.allowKorea && <option value={KOREA}>{tr(koreaLabel, lang)}</option>}
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{tr(c.label, lang)}{lang !== 'ko' ? ` · ${c.ko}` : ''}</option>
            ))}
            <option value={OTHER_COUNTRY}>{tr(UI.otherCountry, lang)}</option>
          </select>
          {country && (
            <p className="text-[13px] font-semibold text-sub">{tr(UI.writtenAs, lang, { ko: country.ko })}</p>
          )}
          {(code === KOREA || code === OTHER_COUNTRY) && (
            <PartInput
              part={{ key: 'text', box: input.box, korean: true, placeholder: code === KOREA ? '예) 서울시 금천구 독산로93길 7' : '예) 파키스탄' }}
              lang={lang}
              fallbackLabel={tr(code === KOREA ? UI.originAddress : UI.countryNameKo, lang)}
              value={value.text ?? ''}
              autoFocus
              onChange={(v) => set({ text: v })}
              onEnter={onSubmit}
            />
          )}
        </div>
      );
    }

    case 'idnum':
      return (
        <div className="flex items-end gap-2">
          <div className="flex-[6]">
            <label className={labelCls}>{tr(UI.idFront, lang)}</label>
            <input
              className={`${inputCls} tracking-widest text-center`}
              inputMode="numeric"
              maxLength={6}
              value={value.front ?? ''}
              autoFocus
              autoComplete="off"
              onChange={(e) => {
                const front = e.target.value.replace(/\D/g, '').slice(0, 6);
                set({ front });
                if (front.length === 6) backRef.current?.focus();
              }}
            />
          </div>
          <span className="pb-3.5 font-black text-hint">–</span>
          <div className="flex-[7]">
            <label className={labelCls}>{tr(UI.idBack, lang)}</label>
            <input
              ref={backRef}
              className={`${inputCls} tracking-widest text-center`}
              inputMode="numeric"
              maxLength={7}
              value={value.back ?? ''}
              autoComplete="off"
              onChange={(e) => set({ back: e.target.value.replace(/\D/g, '').slice(0, 7) })}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSubmit(); } }}
            />
          </div>
        </div>
      );
  }
}

function localToday() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
