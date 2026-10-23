import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, FileCheck2, Menu, Minus, Plus, RotateCcw, X } from 'lucide-react';
import FieldListSheet from '../components/FieldListSheet';
import FieldSheet from '../components/FieldSheet';
import FormSvg, { fieldCrop } from '../components/FormSvg';
import OutputModal from '../components/OutputModal';
import { isFilled } from '../forms/render';
import { Box, FieldValue, FormDef, Lang, Values } from '../forms/types';
import { tr, UI } from '../i18n';
import { load, remove, save } from '../lib/storage';
import Header from './Header';

const TIP_KEY = 'gusring.tipClosed';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

interface Props {
  form: FormDef;
  /** 언어 선택 화면에서 고른 언어. 안내·라벨이 모두 이 언어로 나온다. */
  lang: Lang;
  onBack: () => void;
  onLanding: () => void;
  onMap: () => void;
}

export default function FormFillView({ form, lang, onBack, onLanding, onMap }: Props) {
  const VALUES_KEY = `gusring.${form.id}.values`;
  const [values, setValues] = useState<Values>(() => load<Values>(VALUES_KEY, {}));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGuides, setShowGuides] = useState(true);
  const [listOpen, setListOpen] = useState(false);
  const [outputOpen, setOutputOpen] = useState(false);
  const [printSrc, setPrintSrc] = useState<string | null>(null);
  const [tipOpen, setTipOpen] = useState(() => !load<boolean>(TIP_KEY, false));
  const [, setFontTick] = useState(0);
  /** 열려 있는 바텀시트 높이 (px) */
  const [sheetH, setSheetH] = useState(0);
  /** 줌을 바꾼 뒤 이 영역(서식 픽셀 좌표)이 보이도록 스크롤 */
  const [scrollTick, setScrollTick] = useState(0);
  const pendingFocus = useRef<{ box: Box; visibleH: number } | null>(null);
  const lastActive = useRef<string | null>(null);
  /** 확대 영역 계산용 — 값이 바뀔 때마다 다시 확대하지 않도록 ref로 읽는다 */
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const zoomAnchor = useRef<{ x: number; y: number } | null>(null);

  // ── 저장 & 환경 ────────────────────────────────────────────
  useEffect(() => save(VALUES_KEY, values), [VALUES_KEY, values]);
  // 웹폰트가 늦게 로드되면 글자 폭 계산을 다시 한다
  useEffect(() => {
    document.fonts?.ready.then(() => setFontTick((t) => t + 1));
  }, []);

  // ── 진행 상태 ──────────────────────────────────────────────
  const filled = useMemo(
    () => new Set(form.fields.filter((f) => isFilled(f, values[f.id])).map((f) => f.id)),
    [form, values],
  );
  const required = form.fields.filter((f) => f.required);
  const requiredDone = required.filter((f) => filled.has(f.id)).length;
  const activeIndex = form.fields.findIndex((f) => f.id === activeId);
  const activeField = activeIndex >= 0 ? form.fields[activeIndex] : null;

  // ── 줌 (서식 전체 폭이 화면에 맞는 100%에서 시작) ─────────
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
    const c = canvasRef.current;
    if (!v || !c) return;

    const focus = pendingFocus.current;
    if (focus) {
      // 확대된 칸을 가로 가운데, 시트 위 남은 공간의 세로 가운데에 놓는다
      const scale = c.clientWidth / form.width;
      const w = focus.box.w * scale;
      const h = focus.box.h * scale;
      v.scrollLeft = w <= v.clientWidth ? focus.box.x * scale - (v.clientWidth - w) / 2 : focus.box.x * scale - 12;
      v.scrollTop = focus.box.y * scale - Math.max(12, (focus.visibleH - h) / 2);
      pendingFocus.current = null;
      return;
    }

    const a = zoomAnchor.current;
    if (!a) return;
    v.scrollLeft = a.x * v.scrollWidth - v.clientWidth / 2;
    v.scrollTop = a.y * v.scrollHeight - v.clientHeight / 2;
    zoomAnchor.current = null;
  }, [zoom, scrollTick, form]);

  /** 작성 중인 칸을 바텀시트 위 공간에 꽉 차게 확대 */
  const focusField = useCallback((id: string, sheetPx: number) => {
    const v = viewerRef.current;
    const f = form.fields.find((x) => x.id === id);
    if (!v || !f) return;
    const box = fieldCrop(f, form, valuesRef.current[id]);
    const vw = v.clientWidth;
    const visibleH = Math.max(100, window.innerHeight - sheetPx - v.getBoundingClientRect().top);
    const byWidth = ((vw - 24) / vw) * (form.width / box.w);
    const byHeight = (visibleH * 0.85) / ((box.h / form.width) * vw);
    pendingFocus.current = { box, visibleH };
    setZoom(+Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.min(byWidth, byHeight))).toFixed(3));
    setScrollTick((t) => t + 1);
  }, [form]);

  // 시트가 열리거나 높이가 바뀌면 작성 중인 칸으로 확대
  useEffect(() => {
    if (activeId && sheetH) focusField(activeId, sheetH);
  }, [activeId, sheetH, focusField]);

  // 시트를 닫으면 100%로 돌아가며 방금 쓴 칸 근처를 보여준다
  useEffect(() => {
    if (activeId) {
      lastActive.current = activeId;
      return;
    }
    const f = form.fields.find((x) => x.id === lastActive.current);
    lastActive.current = null;
    setSheetH(0);
    if (!f || !viewerRef.current) return;
    pendingFocus.current = { box: { x: 0, y: f.area.y, w: form.width, h: f.area.h }, visibleH: viewerRef.current.clientHeight };
    setZoom(1);
    setScrollTick((t) => t + 1);
  }, [activeId, form]);

  /** 마지막으로 작성한 칸 — 시트를 닫아도 이전/다음 이동의 기준이 된다 */
  const [cursor, setCursor] = useState(-1);

  const select = useCallback((id: string) => {
    setActiveId(id);
    setCursor(form.fields.findIndex((f) => f.id === id));
    setListOpen(false);
  }, [form]);

  const goto = (index: number) => {
    const f = form.fields[index];
    if (f) select(f.id);
  };

  const updateValue = (id: string, value: FieldValue) => setValues((prev) => ({ ...prev, [id]: value }));

  const reset = () => {
    if (!window.confirm(tr(UI.resetConfirm, lang))) return;
    setValues({});
    setActiveId(null);
    setCursor(-1);
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
        <Header
          lang={lang}
          onBack={onBack}
          onLanding={onLanding}
          onMap={onMap}
        />

        {/* 전체 항목 · 서류 이름 · 이전 · 다음 */}
        <div className="relative shrink-0 h-12 px-3 flex items-center gap-1 bg-white border-b border-line">
          <div className="absolute left-1/2 -translate-x-1/2 max-w-[calc(100%-200px)] text-center pointer-events-none">
            <h1 className="font-black text-[15px] leading-tight truncate text-gusring-text">{tr(form.title, lang)}</h1>
            {lang !== 'ko' && <p className="text-[10px] font-bold leading-tight truncate text-hint">{form.title.ko}</p>}
          </div>
          <button onClick={() => setListOpen(true)} className="h-10 w-10 rounded-xl text-gusring-text flex items-center justify-center active:bg-line transition" aria-label={tr(UI.allFields, lang)}>
            <Menu size={20} />
          </button>
          <button
            onClick={() => goto(cursor - 1)}
            disabled={cursor <= 0}
            className="ml-auto h-9 w-9 rounded-xl bg-line text-gray-800 flex items-center justify-center active:scale-95 transition disabled:opacity-40"
            aria-label={tr(UI.prev, lang)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => goto(cursor + 1)}
            disabled={cursor >= form.fields.length - 1}
            className="h-9 w-9 rounded-xl bg-line text-gray-800 flex items-center justify-center active:scale-95 transition disabled:opacity-40"
            aria-label={tr(UI.next, lang)}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* 서식 뷰어 */}
        <div className="relative flex-1 min-h-0">
          <div ref={viewerRef} className="absolute inset-0 overflow-auto bg-gray-100">
            <div
              ref={canvasRef}
              className="mx-auto bg-white shadow-sm"
              style={{ width: `${zoom * 100}%`, paddingBottom: activeField ? '70dvh' : 0 }}
            >
              <FormSvg
                form={form}
                values={values}
                className="block w-full h-auto select-none"
                guides={showGuides ? { activeId, filled, onSelect: select } : undefined}
                highlightId={showGuides ? null : activeId}
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
          <div className="px-4 py-2.5 flex gap-1">
            <button onClick={reset} className="h-12 w-12 rounded-2xl text-sub flex items-center justify-center active:bg-line transition" aria-label={tr(UI.reset, lang)}>
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
            onHeight={setSheetH}
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
