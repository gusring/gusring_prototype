import { useEffect, useState } from 'react';
import { Lang } from '../forms/types';
import { languages } from '../i18n';

// gusring-web LandingView 그대로 (언어 선택 + 스플래시)

interface Props {
  onSelect: (lang: Lang) => void;
}

export default function LandingView({ onSelect }: Props) {
  const [isSplash, setIsSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplash(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-[100dvh] bg-gusring-bg flex flex-col items-center overflow-hidden safe-top safe-bottom">
      {/* 배경 데코 */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(254,219,2,0.12) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-20 w-56 h-56 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(254,219,2,0.08) 0%, transparent 70%)' }}
      />

      {/* ── 로고 및 마스코트 ── */}
      <div
        className={`flex flex-col items-center justify-center transition-all duration-[1000ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] px-8 w-full
          ${isSplash ? 'flex-[10] h-full scale-110' : 'flex-[3] pt-6 pb-2 scale-100'}`}
      >
        <div className="animate-scale-in">
          <img src="/gusring_logo.png" alt="Gusring" className="w-36 sm:w-44 h-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
        </div>

        <div className="animate-scale-in" style={{ animationDelay: '150ms' }}>
          <img src="/waving.png" alt="mascot" className="w-20 sm:w-28 h-auto object-contain animate-bounce-soft" />
        </div>

        <p
          className={`mt-2 text-[11px] sm:text-[12px] font-black text-gusring-yellow tracking-[0.12em] uppercase transition-all duration-700
            ${isSplash ? 'opacity-80' : 'opacity-100'}`}
        >
          Administrative Guide Platform
        </p>

        <div className={`mt-3 w-10 h-[3px] rounded-full bg-[#fedb02] transition-opacity duration-500 ${isSplash ? 'opacity-0' : 'opacity-100'}`} />
      </div>

      {/* ── 언어 선택 ── */}
      <div
        className={`w-full px-5 pb-6 flex flex-col justify-start transition-all duration-1000
          ${isSplash ? 'flex-[0.001] opacity-0 translate-y-10 pointer-events-none' : 'flex-[7] opacity-100 translate-y-0 pointer-events-auto'}`}
      >
        <div className="space-y-2.5">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className="w-full bg-gusring-surface rounded-2xl px-5 py-3.5 flex items-center gap-4 btn-press shadow-card hover:-translate-y-0.5 hover:shadow-card-md transition-all duration-200"
            >
              <span className="text-[26px] leading-none shrink-0">{lang.flag}</span>
              <span className="font-black text-gusring-text text-[15px] tracking-tight">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {!isSplash && (
        <p className="text-[9px] text-gusring-text-hint font-medium pb-4 tracking-wide animate-fade-in shrink-0">
          © 2026 Team EL · Geumcheon-gu Living Lab
        </p>
      )}
    </div>
  );
}
