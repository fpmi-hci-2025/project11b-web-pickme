/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          pink: '#EF79B4',
          soft: '#EBA0C5',
        },
        background: {
          light: '#FFF0F5',
        },
        neutral: {
          light: '#333333',
          dark: '#333333',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#666666',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '100' }],
        'h2': ['32px', { lineHeight: '1.3', fontWeight: '300' }],
        'h3': ['28px', { lineHeight: '1.4', fontWeight: '400' }],
        'h4': ['20px', { lineHeight: '1.5', fontWeight: '500' }],
        'h5': ['18px', { lineHeight: '1.5', fontWeight: '700' }],
        'h6': ['16px', { lineHeight: '1.5', fontWeight: '700' }],
        'body1': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body2': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
      }
    },
  },
  plugins: [],
}
