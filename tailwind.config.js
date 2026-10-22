/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', '"Apple SD Gothic Neo"', '"Noto Sans KR"', 'sans-serif'],
      },
      colors: {
        // ── gusring-web 토큰 (랜딩·목록 화면에서 그대로 사용) ──
        gusring: {
          bg: '#FFFFFF',
          surface: '#FFFFFF',
          yellow: '#fedb02',
          'yellow-press': '#e5c400',
          'yellow-soft': '#fffbe6',
          text: '#111827',
          'text-sub': '#6B7280',
          'text-hint': '#9CA3AF',
          border: '#F0F1F5',
          'border-strong': '#E5E7EB',
          brand: {
            50: '#fffde6', 100: '#fff9bf', 200: '#fff480', 300: '#ffee40', 400: '#fee810',
            500: '#fedb02', 600: '#d4b500', 700: '#a08800', 800: '#7a6800', 900: '#4d4200', 950: '#2e2800',
          },
        },
        // ── 서식 작성 화면 토큰 ──
        brand: { DEFAULT: '#fedb02', press: '#e5c400', soft: '#fffbe6', 700: '#a08800', 950: '#2e2800' },
        ink: '#1d3c9c',
        line: '#F0F1F5',
        sub: '#6B7280',
        hint: '#9CA3AF',
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(0,0,0,0.06)',
        'card-md': '0 4px 20px 0 rgba(0,0,0,0.09)',
        'card-lg': '0 8px 32px 0 rgba(0,0,0,0.12)',
        yellow: '0 6px 24px 0 rgba(254,219,2,0.55)',
        'yellow-sm': '0 3px 12px 0 rgba(254,219,2,0.45)',
        'inset-sm': 'inset 0 1px 3px rgba(0,0,0,0.06)',
        sheet: '0 -8px 32px 0 rgba(0,0,0,0.12)',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3.5xl': '1.75rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      keyframes: {
        slideUpFade: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        bounceSoft: { '0%, 100%': { transform: 'translateY(-5px)' }, '50%': { transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.94)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        sheetUp: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
      },
      animation: {
        'slide-up': 'slideUpFade 0.35s cubic-bezier(0.34,1.2,0.64,1) both',
        'slide-right': 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) both',
        'fade-in': 'fadeIn 0.25s ease-out both',
        'bounce-soft': 'bounceSoft 2.4s ease-in-out infinite',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.34,1.2,0.64,1) both',
        'sheet-up': 'sheetUp 0.28s cubic-bezier(0.4,0,0.2,1) both',
      },
      transitionTimingFunction: {
        toss: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
