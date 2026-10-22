/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', '"Apple SD Gothic Neo"', '"Noto Sans KR"', 'sans-serif'],
      },
      // Gusring 브랜드 토큰 (gusring-web과 동일)
      colors: {
        brand: { DEFAULT: '#fedb02', press: '#e5c400', soft: '#fffbe6', 700: '#a08800', 950: '#2e2800' },
        ink: '#1d3c9c',
        line: '#F0F1F5',
        sub: '#6B7280',
        hint: '#9CA3AF',
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(0,0,0,0.06)',
        sheet: '0 -8px 32px 0 rgba(0,0,0,0.12)',
      },
      keyframes: {
        sheetUp: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        'sheet-up': 'sheetUp 0.28s cubic-bezier(0.4,0,0.2,1) both',
        'fade-in': 'fadeIn 0.2s ease-out both',
      },
    },
  },
  plugins: [],
};
