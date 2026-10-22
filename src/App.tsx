import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { findForm } from './forms/catalog';
import { Lang } from './forms/types';
import { languages } from './i18n';
import { load, save } from './lib/storage';
import FormFillView from './pages/FormFillView';
import Header from './pages/Header';
import LandingView from './pages/LandingView';
import ListView from './pages/ListView';
import OfficeMap from './pages/OfficeMap';

// ─────────────────────────────────────────────────────────────
// 화면 흐름: 언어 선택(#/) → 문서 선택(#/list) → 서식 작성(#/form/:id)
// 해시 라우팅이라 휴대폰 뒤로가기 버튼으로 이전 화면에 돌아간다.
// ─────────────────────────────────────────────────────────────

const LANG_KEY = 'gusring.lang';

type Route = { name: 'landing' } | { name: 'list' } | { name: 'map' } | { name: 'form'; id: string };

const parseRoute = (hash: string): Route => {
  const path = hash.replace(/^#/, '');
  if (path === '/list') return { name: 'list' };
  if (path === '/map') return { name: 'map' };
  const m = path.match(/^\/form\/(.+)$/);
  if (m) return { name: 'form', id: decodeURIComponent(m[1]) };
  return { name: 'landing' };
};

const detectLang = (): Lang => {
  const nav = navigator.language.slice(0, 2);
  return languages.find((l) => l.id === nav)?.id ?? 'en';
};

/** gusring-web과 같은 모바일 폭 앱 셸 */
function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="sm:flex sm:items-start sm:justify-center sm:min-h-screen">
      <div className="min-h-[100dvh] bg-gusring-bg flex flex-col w-full sm:max-w-md sm:shadow-2xl relative overflow-x-hidden">{children}</div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(location.hash));
  const [lang, setLang] = useState<Lang>(() => load<Lang>(LANG_KEY, detectLang()));
  /** 앱 안에서 이동한 횟수 — 0이면 뒤로가기 대신 목록으로 */
  const depth = useRef(0);

  useEffect(() => {
    const onHash = () => {
      setRoute(parseRoute(location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    save(LANG_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const go = useCallback((path: string) => {
    depth.current += 1;
    location.hash = path;
  }, []);

  const back = useCallback(() => {
    if (depth.current > 0) {
      depth.current -= 1;
      history.back();
    } else {
      location.replace('#/list');
    }
  }, []);

  const toLanding = () => go('/');
  const toMap = () => go('/map');

  if (route.name === 'landing') {
    return (
      <div className="min-h-[100dvh] sm:flex sm:items-start sm:justify-center">
        <div className="w-full sm:max-w-md sm:min-h-screen sm:shadow-2xl">
          <LandingView
            onSelect={(l) => {
              setLang(l);
              go('/list');
            }}
          />
        </div>
      </div>
    );
  }

  if (route.name === 'form') {
    const form = findForm(route.id);
    if (form) {
      return (
        <div className="w-full sm:max-w-md sm:mx-auto sm:shadow-2xl">
          <FormFillView key={form.id} form={form} lang={lang} onBack={back} onLanding={toLanding} onMap={toMap} />
        </div>
      );
    }
  }

  return (
    <Shell>
      <Header
        lang={lang}
        onBack={route.name === 'map' ? back : undefined}
        onLanding={toLanding}
        onMap={toMap}
        mapActive={route.name === 'map'}
      />
      <main className="flex-1">
        {route.name === 'map' ? (
          <OfficeMap lang={lang} />
        ) : (
          <ListView lang={lang} onFormSelect={(form) => go(`/form/${form.id}`)} />
        )}
      </main>
    </Shell>
  );
}
