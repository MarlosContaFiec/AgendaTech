/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tb: {
          bg:       '#080a0f',
          surface:  '#0e1118',
          surface2: '#141820',
          surface3: '#1b2030',
          border:   '#232840',
          border2:  '#2e3550',
          accent:   '#4f8cff',
          violet:   '#a78bfa',
          green:    '#22d48a',
          red:      '#ff5c7a',
          amber:    '#ffa94d',
          text:     '#dde2f0',
          muted:    '#6b7294',
          muted2:   '#8890b0',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        girar: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.55)' },
          '65%': { transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.3s cubic-bezier(.22,1,.36,1)',
        girar: 'girar 0.75s linear infinite',
        bounceIn: 'bounceIn 0.5s cubic-bezier(.22,1,.36,1)',
        slideIn: 'slideIn 0.3s ease',
      },
    },
  },
  plugins: [],
};
