import { useMemo, useState } from 'react';
import { ChevronRight, FileText, Search } from 'lucide-react';
import { catalog, categories, CategoryKey } from '../forms/catalog';
import { FormDef, Lang } from '../forms/types';
import { tr, UI } from '../i18n';

// gusring-web ListView 그대로 (검색 + 카테고리 칩 + 서식 카드)

interface Props {
  lang: Lang;
  onFormSelect: (form: FormDef) => void;
}

export default function ListView({ lang, onFormSelect }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return catalog.filter(({ cat, form }) => {
      const matchesSearch = tr(form.title, lang).toLowerCase().includes(q) || form.title.ko.includes(searchTerm);
      return matchesSearch && (selectedCategory === 'ALL' || cat === selectedCategory);
    });
  }, [searchTerm, selectedCategory, lang]);

  return (
    <div className="px-4 py-5 sm:px-5 space-y-5">
      {/* 페이지 타이틀 */}
      <div className="py-1 animate-slide-up">
        <h2 className="text-xl sm:text-2xl font-black text-gusring-text leading-tight mb-1">{tr(UI.welcome, lang)}</h2>
        <p className="text-gusring-text-sub text-[13px] font-medium">{tr(UI.subWelcome, lang)}</p>
      </div>

      {/* 검색 + 카테고리 (sticky) */}
      <div className="sticky z-20 bg-gusring-bg/90 backdrop-blur-sm pt-1 pb-4 space-y-3" style={{ top: 'var(--header-h)' }}>
        <div className="relative group animate-slide-up" style={{ animationDelay: '60ms' }}>
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gusring-text-hint group-focus-within:text-gusring-yellow transition-colors" size={18} />
          <input
            type="text"
            placeholder={tr(UI.searchPlaceholder, lang)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="toss-input pl-14"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <button onClick={() => setSelectedCategory('ALL')} className={`toss-chip ${selectedCategory === 'ALL' ? 'active' : ''}`}>
            {tr(UI.catAll, lang)}
          </button>
          {(Object.keys(categories) as CategoryKey[]).map((key) => (
            <button key={key} onClick={() => setSelectedCategory(key)} className={`toss-chip ${selectedCategory === key ? 'active' : ''}`}>
              {tr(categories[key], lang)}
            </button>
          ))}
        </div>
      </div>

      {/* 서식 목록 */}
      <div className="grid grid-cols-1 gap-3 pb-28">
        <div className="text-[10px] text-gusring-brand-600 font-black px-1 uppercase tracking-[0.15em]">
          {selectedCategory === 'ALL' ? tr(UI.catAll, lang) : tr(categories[selectedCategory], lang)} ({filtered.length})
        </div>

        {filtered.map(({ cat, desc, form }, idx) => (
          <button
            key={form.id}
            onClick={() => onFormSelect(form)}
            className="toss-card btn-press flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-4xl text-left group animate-slide-up"
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <div className="w-12 h-12 bg-gusring-yellow-soft group-hover:bg-gusring-yellow rounded-[18px] flex items-center justify-center text-gusring-brand-600 group-hover:text-gusring-brand-950 shrink-0 transition-all duration-200 shadow-inset-sm">
              <FileText size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-gusring-brand-500 uppercase mb-1 tracking-wider">{tr(categories[cat], lang)}</p>
              <h3 className="font-bold text-gusring-text text-[15px] leading-snug truncate">{tr(form.title, lang)}</h3>
              <p className="text-[11px] text-gusring-text-hint truncate mt-0.5 leading-relaxed font-medium group-hover:text-gusring-text-sub transition-colors">
                {tr(desc, lang)}
              </p>
            </div>
            <ChevronRight size={16} className="text-gusring-border-strong group-hover:text-gusring-brand-500 shrink-0 transition-colors" />
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center gap-2 animate-fade-in">
            <img src="/sign.png" alt="no result" className="w-36 h-auto object-contain" />
            <p className="font-black text-gusring-text text-base">{tr(UI.noResult, lang)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
