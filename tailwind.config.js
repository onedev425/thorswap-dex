const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      // common colors
      transparent: 'transparent',
      purple: '#7B48E8',
      yellow: '#FFB359',
      pink: '#ED6B82',
      blue: '#2A7DFA',
      green: '#5DD39B',
      orange: '#E98566',
      cyan: '#2AC6DB',

      // light mode
      light: {
        'bg-primary': '#F7F8FA',
        'bg-secondary': '#FCFCFC',
        'typo-primary': '#121526',
        'typo-gray': '#7C859F',
        'btn-primary': '#39BBF3',
        'btn-secondary': '#4DC5B8',
        'chart-bg': '#39BBF3',
      },

      // dark
      dark: {
        'bg-primary': '#121526',
        'bg-secondary': '#232E42',
        'typo-primary': '#E2EBFB',
        'typo-gray': '#75849D',
        'btn-primary': '#4DBAD6',
        'btn-secondary': '#46B2A7',
        'chart-bg': '#348CF4',
      },
    },
    fontFamily: {
      primary: ['Poppins', 'sans-serif'],
    },
    fontSize: {
      ...defaultTheme.fontSize,
      h1: [
        '48px',
        {
          letterSpacing: '-0.04em',
          fontWeight: 500,
        },
      ],
      h2: [
        '28px',
        {
          letterSpacing: '0.02em',
          lineHeight: '42px',
          fontWeight: 600,
        },
      ],
      h3: [
        '24px',
        {
          letterSpacing: '0.02em',
          lineHeight: '36px',
          fontWeight: 600,
        },
      ],
      h4: [
        '21px',
        {
          letterSpacing: '-0.01em',
          lineHeight: '24px',
        },
      ],
      h5: [
        '17px',
        {
          letterSpacing: '-0.02em',
          lineHeight: '24px',
        },
      ],
      body: [
        '14px',
        {
          letterSpacing: '0.03em',
          lineHeight: '16px',
        },
      ],
      caption: [
        '11px',
        {
          letterSpacing: '0.03em',
          lineHeight: '18px',
          fontWeight: 700,
        },
      ],
    },
    extend: {
      transitionDuration: {
        DEFAULT: '300ms',
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
