/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 品牌暗色体系
        ink: {
          DEFAULT: '#0C0C0C',
          900: '#0C0C0C',
          800: '#101014',
          700: '#16161B',
        },
        line: '#D7E2EA', // 主文字 / 描边
      },
      fontFamily: {
        display: ['Kanit', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        body: ['Kanit', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        latin: ['Kanit', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '1700px', // PC 版心
      },
      letterSpacing: {
        cjk: '0.08em',
      },
    },
  },
  plugins: [],
}
