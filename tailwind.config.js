module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [],
  theme: {
    extend: {
      colors: {
        brand: {
          midnight: '#0b1d2a',
          ink: '#1a2a36',
          denim: '#274c77',
          mist: '#e7eef6',
          blush: '#f7f3ef',
          sand: '#f0e6dd',
          sky: '#dbe8f6',
          accent: '#f9735b',
          lime: '#5fc49b',
        },
        neutral: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#e4e7ec',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1d2939',
          900: '#101828',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at 0% 0%, rgba(39,76,119,0.12), rgba(247,243,239,0.9))',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
