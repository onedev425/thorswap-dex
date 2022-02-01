const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

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
      'blue-light': '#3397F2',
      green: '#5DD39B',
      orange: '#E98566',
      cyan: '#2AC6DB',
      gray: '#273855',
      red: '#ff2357',
      white: '#fff',

      // light mode
      light: {
        'bg-primary': '#F7F8FA',
        'bg-secondary': '#FCFCFC',
        'typo-primary': '#121526',
        'typo-gray': '#7C859F',
        'btn-primary': '#39BBF3',
        'btn-secondary': '#4DC5B8',
        'chart-bg': '#39BBF3',
        'border-primary': '#E6E9F5',
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
        'border-primary': '#273855',
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
          lineHeight: '42px',
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
          letterSpacing: '0.025em',
          lineHeight: '36px',
          fontWeight: 800,
        },
      ],
      h4: [
        '21px',
        {
          letterSpacing: '-0.01em',
          lineHeight: '31px',
          fontWeight: 800,
        },
      ],
      h5: [
        '21px',
        {
          letterSpacing: '-0.01em',
          lineHeight: '17px',
          fontWeight: 800,
        },
      ],
      h5: [
        '17px',
        {
          letterSpacing: '-0.02em',
          lineHeight: '24px',
        },
      ],
      subtitle1: [
        '17px',
        {
          letterSpacing: '-0.02em',
          lineHeight: '25px',
          fontWeight: 800,
        },
      ],
      subtitle2: [
        '17px',
        {
          letterSpacing: '-0.01em',
          lineHeight: '25px',
          fontWeight: 600,
        },
      ],
      body: [
        '14px',
        {
          letterSpacing: '0.03em',
          lineHeight: '21px',
          fontWeight: 500,
        },
      ],
      caption: [
        '12px',
        {
          letterSpacing: '0.03em',
          lineHeight: '18px',
          fontWeight: 700,
        },
      ],
      'caption-xs': [
        '11px',
        {
          letterSpacing: '0.03em',
          lineHeight: '18px',
          fontWeight: 700,
        },
      ],
    },
    maxWidth: {
      ...defaultTheme.maxWidth,
      '8xl': '90rem',
    },
    extend: {
      transitionDuration: {
        DEFAULT: '300ms',
      },
      borderRadius: {
        box: '2rem',
        'box-lg': '2.5rem',
      },
      dropShadow: {
        box: '0 5px 15px rgba(0,0,0,.05)',
      },
      borderSpacing: ({ theme }) => ({
        ...theme('spacing'),
      }),
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    plugin(function ({ addDefaults, addUtilities, matchUtilities, theme }) {
      addDefaults('borderSpacing', {
        '--tw-border-spacing-x': '0',
        '--tw-border-spacing-y': '0',
      })
      addUtilities({
        '.border-collapse': { 'border-collapse': 'collapse' },
        '.border-separate': {
          'border-collapse': 'separate',
          'border-spacing':
            'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
        },
      })
      matchUtilities(
        {
          'border-spacing': (value) => {
            value = value === '0' ? '0px' : value

            return {
              '--tw-border-spacing-x': value,
              '--tw-border-spacing-y': value,
            }
          },
          'border-spacing-x': (value) => {
            value = value === '0' ? '0px' : value

            return { '--tw-border-spacing-x': value }
          },
          'border-spacing-y': (value) => {
            value = value === '0' ? '0px' : value

            return { '--tw-border-spacing-y': value }
          },
        },
        { values: theme('borderSpacing') },
      )
    }),
  ],
}
