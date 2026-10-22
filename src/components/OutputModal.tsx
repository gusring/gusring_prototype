import { useEffect, useState } from 'react';
import { AlertTriangle, Download, PenLine, Printer, ShieldCheck, UserCheck, X } from 'lucide-react';
import { FormDef, Lang, Values } from '../forms/types';
import { tr, UI } from '../i18n';
import { downloadDataUrl, renderFormPng } from '../lib/exportImage';

interface Props {
  form: FormDef;
  values: Values;
  lang: Lang;
  missingRequired: number;
  onClose: () => void;
  onPrint: (dataUrl: string) => void;
}

export default function OutputModal({ form, values, lang, missingRequired, onClose, onPrint }: Props) {
  const [png, setPng] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    renderFormPng(form, values).then((url) => alive && setPng(url));
    return () => { alive = false; };
  }, [form, values]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col animate-fade-in sm:max-w-md sm:mx-auto">
      <header className="flex items-center justify-between px-4 py-3 bg-white shrink-0">
        <h2 className="font-black text-[16px]">{tr(UI.outputTitle, lang)}</h2>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-line flex items-center justify-center text-sub" aria-label={tr(UI.close, lang)}>
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-auto p-4">
        {png ? (
          <img src={png} alt={form.title.ko} className="mx-auto w-full max-w-[720px] bg-white shadow-xl" />
        ) : (
          <div className="mx-auto w-full max-w-[720px] aspect-[1190/1682] bg-white/80 animate-pulse" />
        )}
      </div>

      <footer className="shrink-0 bg-white px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-3 rounded-t-3xl">
        {missingRequired > 0 && (
          <p className="flex items-center gap-2 text-[13px] font-bold text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
            <AlertTriangle size={15} /> {tr(UI.missingRequired, lang, { n: missingRequired })}
          </p>
        )}
        <ul className="space-y-1.5 text-[12.5px] text-gray-700 font-medium">
          <li className="flex gap-2"><PenLine size={14} className="shrink-0 mt-0.5 text-brand-700" /> {tr(UI.noteSign, lang)}</li>
          <li className="flex gap-2"><UserCheck size={14} className="shrink-0 mt-0.5 text-brand-700" /> {tr(UI.noteCheck, lang)}</li>
          <li className="flex gap-2"><ShieldCheck size={14} className="shrink-0 mt-0.5 text-brand-700" /> {tr(UI.notePrivacy, lang)}</li>
        </ul>
        <div className="flex gap-2">
          <button
            disabled={!png}
            onClick={() => png && downloadDataUrl(png, `${form.title.ko}.png`)}
            className="flex-1 h-12 rounded-2xl bg-line text-gray-900 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download size={16} /> {tr(UI.saveImage, lang)}
          </button>
          <button
            disabled={!png}
            onClick={() => png && onPrint(png)}
            className="flex-1 h-12 rounded-2xl bg-brand text-brand-950 font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Printer size={16} /> {tr(UI.print, lang)}
          </button>
        </div>
      </footer>
    </div>
  );
}
