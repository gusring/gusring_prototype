import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Eye, EyeOff, FileCheck2, List, Minus, Plus, RotateCcw, Sparkles, X } from 'lucide-react';
import FieldListSheet from './components/FieldListSheet';
import FieldSheet from './components/FieldSheet';
import FormSvg, { badgePoint } from './components/FormSvg';
import OutputModal from './components/OutputModal';
import { birthReport } from './forms/birthReport';
import { isFilled } from './forms/render';
import { FieldValue, Lang, Values } from './forms/types';
import { languages, tr, UI } from './i18n';
import { load, remove, save } from './lib/storage';

const form = birthReport;
const VALUES_KEY = `gusring.${form.id}.values`;
const LANG_KEY = 'gusring.lang';
const TIP_KEY = 'gusring.tipClosed';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
/** 휴대폰에서도 칸이 읽힐 만큼 서식을 키워서 시작한다 */
const COMFORT_WIDTH = 760;

const detectLang = (): Lang => {
  const nav = navigator.language.slice(0, 2);
  return (languages.find((l) => l.id === nav)?.id ?? 'en') as Lang;
};

export default function App() {
  const [lang, setLang] = useState<Lang>(() => load<Lang>(LANG_KEY, detectLang()));
  const [values, setValues] = useState<Values>(() => load<Values>(VALUES_KEY, {}));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGuides, setShowGuides] = useState(true);
  const [listOpen, setListOpen] = useState(false);
  const [outputOpen, setOutputOpen] = useState(false);
  const [printSrc, setPrintSrc] = useState<string | null>(null);
  const [tipOpen, setTipOpen] = useState(() => !load<boolean>(TIP_KEY, false));
  const [, setFontTick] = useState(0);

  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const zoomAnchor = useRef<{ x: number; y: number } | null>(null);

  // ── 저장 & 환경 ────────────────────────────────────────────
  useEffect(() => save(VALUES_KEY, values), [values]);
  useEffect(() => {
    save(LANG_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);
  // 웹폰트가 늦게 로드되면 글자 폭 계산을 다시 한다
  useEffect(() => {
    document.fonts?.ready.then(() => setFontTick((t) => t + 1));
  }, []);

  // ── 진행 상태 ──────────────────────────────────────────────
  const filled = useMemo(
    () => new Set(form.fields.filter((f) => isFilled(f, values[f.id])).map((f) => f.id)),
    [values],
  );
  const required = form.fields.filter((f) => f.required);
  const requiredDone = required.filter((f) => filled.has(f.id)).length;
  const activeIndex = form.fields.findIndex((f) => f.id === activeId);
  const activeField = activeIndex >= 0 ? form.fields[activeIndex] : null;

  // ── 줌 ─────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const w = viewerRef.current?.clientWidth ?? COMFORT_WIDTH;
    setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, COMFORT_WIDTH / w)));
  }, []);

  const changeZoom = (factor: number) => {
    const v = viewerRef.current;
    if (v) {
      // 화면 중앙이 같은 위치에 머물도록 비율을 기억
      zoomAnchor.current = {
        x: (v.scrollLeft + v.clientWidth / 2) / v.scrollWidth,
        y: (v.scrollTop + v.clientHeight / 2) / v.scrollHeight,
      };
    }
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z * factor).toFixed(2))));
  };

  useLayoutEffect(() => {
    const v = viewerRef.current;
    const a = zoomAnchor.current;
    if (!v || !a) return;
    v.scrollLeft = a.x * v.scrollWidth - v.clientWidth / 2;
    v.scrollTop = a.y * v.scrollHeight - v.clientHeight / 2;
    zoomAnchor.current = null;
  }, [zoom]);

  // ── 선택한 칸으로 스크롤 (바텀시트 위쪽에 보이도록) ────────
  const scrollToField = useCallback((id: string) => {
    const v = viewerRef.current;
    const c = canvasRef.current;
    const f = form.fields.find((x) => x.id === id);
    if (!v || !c || !f) return;
    const scale = c.clientWidth / form.width;
    const badge = badgePoint(f);
    const left = Math.min(f.area.x, badge.x - 20) * scale;
    const right = Math.max(f.area.x + f.area.w, badge.x + 20) * scale;
    const fits = right - left <= v.clientWidth - 24;
    v.scrollTo({
      left: fits ? (left + right) / 2 - v.clientWidth / 2 : left - 12,
      top: f.area.y * scale - 28,
      behavior: 'smooth',
    });
  }, []);

  const select = useCallback((id: string) => {
    setActiveId(id);
    setListOpen(false);
    // 시트가 열리며 하단 여백이 생긴 뒤 스크롤
    requestAnimationFrame(() => scrollToField(id));
  }, [scrollToField]);

  const goto = (index: number) => {
    const f = form.fields[index];
    if (f) select(f.id);
  };

  const nextBlank = () => {
    const start = activeIndex + 1;
    const order = [...form.fields.slice(start), ...form.fields.slice(0, start)];
    const target = order.find((f) => f.required && !filled.has(f.id)) ?? order.find((f) => !filled.has(f.id));
    if (target) select(target.id);
  };

  const updateValue = (id: string, value: FieldValue) => setValues((prev) => ({ ...prev, [id]: value }));

  const reset = () => {
    if (!window.confirm(tr(UI.resetConfirm, lang))) return;
    setValues({});
    setActiveId(null);
    remove(VALUES_KEY);
  };

  // ── 인쇄 ───────────────────────────────────────────────────
  useEffect(() => {
    if (!printSrc) return;
    const after = () => setPrintSrc(null);
    window.addEventListener('afterprint', after, { once: true });
    const img = new Image();
    img.onload = () => window.print();
    img.src = printSrc;
    return () => window.removeEventListener('afterprint', after);
  }, [printSrc]);

  return (
    <>
      <div className="no-print h-[100dvh] flex flex-col bg-white">
        {/* 헤더 */}
        <header className="shrink-0 border-b border-line bg-white/95 backdrop-blur pt-[env(safe-area-inset-top)]">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
            <img src="/gusring_logo.png" alt="Gusring" className="h-7 w-auto" style={{ mixBlendMode: 'multiply' }} />
            <div className="flex-1 min-w-0">
              <h1 className="font-black text-[15px] leading-tight truncate">
                {tr(form.title, lang)}
                {lang !== 'ko' && <span className="ml-1.5 text-[12px] font-bold text-hint">{form.title.ko}</span>}
              </h1>
              <p className="text-[10px] font-bold text-brand-700 tracking-wide">{tr(UI.appName, lang)} · {tr(UI.prototype, lang)}</p>
            </div>
            <select
              aria-label={tr(UI.language, lang)}
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="h-9 rounded-xl bg-brand-soft border border-brand/40 px-2 text-[13px] font-bold text-brand-950 outline-none"
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id}>{l.flag} {l.label}</option>
              ))}
            </select>
          </div>

          {/* 진행률 */}
          <div className="max-w-5xl mx-auto px-4 pb-2.5 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-gray-900">
                  {requiredDone === required.length ? tr(UI.allRequiredDone, lang) : tr(UI.requiredProgress, lang, { done: requiredDone, total: required.length })}
                </span>
                <span className="text-hint">{tr(UI.filledCount, lang, { done: filled.size, total: form.fields.length })}</span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden">
                <div className="h-full bg-brand transition-all duration-300" style={{ width: `${(requiredDone / required.length) * 100}%` }} />
              </div>
            </div>
            {filled.size < form.fields.length && (
              <button
                onClick={nextBlank}
                className="shrink-0 h-9 px-3 rounded-xl bg-gray-900 text-brand text-[12px] font-black flex items-center gap-1 active:scale-95 transition"
              >
                <Sparkles size={13} /> {tr(UI.nextBlank, lang)}
              </button>
            )}
          </div>
        </header>

        {/* 서식 뷰어 */}
        <div className="relative flex-1 min-h-0">
          <div ref={viewerRef} className="absolute inset-0 overflow-auto bg-gray-100">
            <div
              ref={canvasRef}
              className="mx-auto bg-white shadow-sm"
              style={{ width: `${zoom * 100}%`, maxWidth: zoom === 1 ? 900 : undefined, paddingBottom: activeField ? '70dvh' : 0 }}
            >
              <FormSvg
                form={form}
                values={values}
                className="block w-full h-auto select-none"
                guides={showGuides ? { activeId, filled, onSelect: select } : undefined}
              />
            </div>
          </div>

          {tipOpen && !activeField && (
            <div className="absolute top-3 inset-x-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[480px] flex gap-2 items-start p-3 rounded-2xl bg-gray-900/90 text-white shadow-lg animate-fade-in">
              <p className="flex-1 text-[13px] leading-relaxed font-medium">{tr(UI.intro, lang)}</p>
              <button
                onClick={() => { setTipOpen(false); save(TIP_KEY, true); }}
                className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0"
                aria-label={tr(UI.close, lang)}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* 줌 / 번호 표시 */}
          {!activeField && (
            <div className="absolute right-3 bottom-3 flex flex-col gap-2">
              <button onClick={() => setShowGuides((s) => !s)} className="w-10 h-10 rounded-full bg-white shadow-card border border-line flex items-center justify-center text-gray-700" aria-label={tr(UI.showGuides, lang)}>
                {showGuides ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <div className="rounded-full bg-white shadow-card border border-line flex flex-col overflow-hidden">
                <button onClick={() => changeZoom(1.25)} disabled={zoom >= MAX_ZOOM} className="w-10 h-10 flex items-center justify-center text-gray-700 disabled:opacity-30" aria-label={tr(UI.zoomIn, lang)}>
                  <Plus size={18} />
                </button>
                <button onClick={() => changeZoom(0.8)} disabled={zoom <= MIN_ZOOM} className="w-10 h-10 flex items-center justify-center text-gray-700 border-t border-line disabled:opacity-30" aria-label={tr(UI.zoomOut, lang)}>
                  <Minus size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 하단 바 */}
        <nav className="shrink-0 border-t border-line bg-white pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-5xl mx-auto px-4 py-2.5 flex gap-2">
            <button onClick={() => setListOpen(true)} className="h-12 px-4 rounded-2xl bg-line text-gray-800 font-bold text-[13px] flex items-center gap-1.5">
              <List size={16} /> {tr(UI.allFields, lang)}
            </button>
            <button onClick={reset} className="h-12 w-12 rounded-2xl bg-white border border-gray-200 text-sub flex items-center justify-center" aria-label={tr(UI.reset, lang)}>
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => { setActiveId(null); setOutputOpen(true); }}
              className="flex-1 h-12 rounded-2xl bg-brand text-brand-950 font-black text-[14px] flex items-center justify-center gap-1.5 shadow-[0_3px_12px_rgba(254,219,2,0.45)] active:scale-[0.97] transition"
            >
              <FileCheck2 size={17} /> {tr(UI.finish, lang)}
            </button>
          </div>
        </nav>

        {activeField && (
          <FieldSheet
            form={form}
            field={activeField}
            index={activeIndex}
            values={values}
            lang={lang}
            onChange={updateValue}
            onPrev={() => goto(activeIndex - 1)}
            onNext={() => goto(activeIndex + 1)}
            onClose={() => setActiveId(null)}
          />
        )}

        {listOpen && <FieldListSheet form={form} values={values} lang={lang} onSelect={select} onClose={() => setListOpen(false)} />}

        {outputOpen && (
          <OutputModal
            form={form}
            values={values}
            lang={lang}
            missingRequired={required.length - requiredDone}
            onClose={() => setOutputOpen(false)}
            onPrint={setPrintSrc}
          />
        )}
      </div>

      {/* 인쇄 전용 — 완성된 한국어 서식만 A4로 출력 */}
      {printSrc && <img src={printSrc} alt="" className="print-only" />}
    </>
  );
}
