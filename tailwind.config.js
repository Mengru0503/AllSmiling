/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        craft: {
          bg: '#FAF8F5',        // 溫暖燕麥白
          card: '#FFFFFF',      // 卡片底色
          primary: '#D9C5B2',   // 莫蘭迪奶茶
          secondary: '#E8DFD8', // 柔和米粉
          text: '#4A3E3D',      // 深木棕色
          subtext: '#8C7A79',   // 淺木棕色
          border: '#E6DDD5',    // 質感邊框
          accent: '#D38B7D',    // 陶土粉紅 (強調色)
          sage: '#9BB0A5',      // 柔草綠 (標籤色)
          gold: '#D4AF37',      // 金屬光澤
        }
      },
      fontFamily: {
        sans: ['"Outfit"', '"Noto Sans TC"', 'sans-serif'],
        serif: ['"Noto Serif TC"', 'serif'],
      },
      boxShadow: {
        'craft-sm': '0 2px 8px -2px rgba(74, 62, 61, 0.06), 0 1px 4px -1px rgba(74, 62, 61, 0.04)',
        'craft-md': '0 8px 24px -4px rgba(74, 62, 61, 0.08), 0 4px 12px -2px rgba(74, 62, 61, 0.04)',
        'craft-lg': '0 16px 36px -6px rgba(74, 62, 61, 0.12), 0 6px 16px -4px rgba(74, 62, 61, 0.06)',
      }
    },
  },
  plugins: [],
}
