import { ArrowLeft, Map } from 'lucide-react';
import { Lang } from '../forms/types';
import { tr, UI } from '../i18n';

// gusring-web Header 기반 (로고/뒤로가기 + 지도)

interface Props {
  lang: Lang;
  /** 있으면 로고 대신 뒤로가기 버튼 */
  onBack?: () => void;
  onLanding: () => void;
  onMap: () => void;
  mapActive?: boolean;
}

export default function Header({ lang, onBack, onLanding, onMap, mapActive }: Props) {
  return (
    <header className="sticky top-0 z-30 glass border-b border-gusring-border safe-top shrink-0">
      <div className="px-5 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {onBack ? (
            <button
              onClick={onBack}
              className="btn-press p-2 -ml-2 rounded-2xl hover:bg-gusring-yellow-soft text-gusring-brand-600 transition-colors shrink-0"
              aria-label={tr(UI.back, lang)}
            >
              <ArrowLeft size={22} />
            </button>
          ) : (
            <button onClick={onLanding} className="btn-press shrink-0" aria-label={tr(UI.home, lang)}>
              <img src="/gusring_icon.png" alt="Gusring" className="h-9 w-9 object-contain" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onMap}
            className={`btn-press h-9 w-9 flex items-center justify-center rounded-xl border border-gusring-brand-100 shadow-card active:scale-95 transition-all ${
              mapActive ? 'bg-gusring-brand-600 text-white' : 'bg-gusring-yellow-soft text-gusring-brand-700'
            }`}
            aria-label={tr(UI.officeMap, lang)}
          >
            <Map size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
