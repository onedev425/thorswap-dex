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
      navy: '#348CF4',
      green: '#5DD39B',
      'green-light': '#4CC920',
      orange: '#E98566',
      cyan: '#2AC6DB',
      gray: '#273855',
      red: '#ff2357',
      white: '#fff',
      black: '#000',

      'youtube-red': '#FF0100',
      'discord-purple': '#5E6BFF',
      'twitter-blue': '#55B6FF',
      'telegram-blue': '#42C8FD',

      chain: {
        btc: '#E98566',
        eth: '#7B48E8',
        bch: '#76C85A',
        doge: '#CE935C',
        cos: '#CE935C',
        terra: '#5493F7',
        ltc: '#346FC6',
        bnb: '#DCAC50',
        thor: '#5DD39B',
      },

      btn: {
        // TODO: check if those are correct because design does not include them
        light: {
          tint: '#edeef2',
          'tint-active': '#dfe3f5',
        },
        dark: {
          tint: '#273855',
          'tint-active': '#475875',
        },
        primary: '#4DBAD6',
        'primary-light': '#3397F2',
        'primary-translucent': '#4DBAD6aa',
        'primary-active': '#46B2A7',
        secondary: '#46B2A7',
        'secondary-translucent': '#46B2A7aa',
        'secondary-active': '#4DBAD6',
        tertiary: '#7B48E8',
        'tertiary-active': '#348CF4',
        azure: '#348CF4',
        'accent-active': '#7B48E8',
        alert: '#ED6B82',
        'alert-active': '#7B48E8',

        fancy: {
          'primary-start': '#46B2A7',
          'primary-end': '#3B82F6',
          'primary-start-hover': '#46B2A7DD',
          'primary-end-hover': '#3B82F6DD',
          'error-start': '#3B82F6',
          'error-end': '#F537C3',
          'error-start-hover': '#3B82F6DD',
          'error-end-hover': '#F537C3DD',
        },
      },

      // light mode
      light: {
        'asset-select': '#202a3d',
        'layout-primary': '#F7F8FA',
        'bg-primary': '#F0F1F3',
        'bg-secondary': '#FCFCFC',
        'border-primary': '#afb6cc',
        'gray-light': '#E5E5E5',
        'gray-primary': '#7C859F',
        'dark-gray': 'rgba(247, 247, 252, 0.72)',
        'typo-gray': '#7C859F',
        'typo-primary': '#1F1F41',
        'green-light': '#6A8E8B',
        'green-lighter': '#46b2a71f',
      },

      // dark
      dark: {
        'asset-select': '#202a3d',
        'bg-primary': '#121526',
        'bg-secondary': '#232E42',
        'border-primary': '#273855',
        'gray-light': '#2E3C56',
        'gray-primary': '#75849D',
        'dark-gray': '#29354a',
        'typo-gray': '#75849D',
        'typo-primary': '#E2EBFB',
        'green-light': '#6A8E8B',
        'green-lighter': '#46b2a71f',
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
      animation: {
        'drawer-slide': 'drawer-keyframe 0.3s ease-in-out',
        'slide-left': 'fade-in-left 0.5s ease-in-out',
      },
      keyframes: {
        'fade-in-left': {
          '0%': { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        'drawer-keyframe': {
          '0%': { opacity: 0, transform: 'translateX(-240px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      borderRadius: {
        box: '2rem',
        'box-lg': '2.5rem',
      },
      dropShadow: {
        box: '0 5px 15px rgba(0,0,0,.05)',
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
        '4xl': [
          '0 35px 35px rgba(0, 0, 0, 0.25)',
          '0 45px 65px rgba(0, 0, 0, 0.15)',
        ],
      },
      boxShadow: {
        leftTicker: '10px 20px 50px 0px rgb(255 255 255 / 35%)',
        rightTicker: '-10px 20px 50px 0px rgba(255 255 255 / 35%)',
      },
      backgroundImage: {
        'gradient-primary-dark':
          'linear-gradient(180deg, rgba(45, 58, 82, 0) 0%, #2A374D 48.2%)',
        'gradient-primary-light':
          'linear-gradient(180deg, rgba(45, 58, 82, 0) 0%, #f1f1f1 48.2%)',
        elliptical:
          'radial-gradient(ellipse at 50% 50%, rgba(46, 92, 106, 30%) 0%, rgba(18, 21, 38, 1) 60%)',
        'elliptical-light':
          'radial-gradient(ellipse at 50% 50%, rgba(45, 58, 82, 10%) 0%, #f1f1f1 60%)',
        'card-before':
          'radial-gradient(100% 6920.83% at 35.19% 0%, #12324F 0%, rgba(35, 46, 66, 0) 100%)',
        'card-after':
          ' radial-gradient(100% 13612.5% at 50% 100%, #005A2F 0%, rgba(18, 22, 39, 0) 100%)',
      },
      borderSpacing: ({ theme }) => ({
        ...theme('spacing'),
      }),
      height: {
        sidebar: 'calc(100vh - 32px)',
        'sidebar-content': 'calc(100vh - 192px)',
      },
    },
  },
  variants: {
    extend: {
      scrollbar: ['dark'],
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.faded-horizontal': {
          'mask-image':
            'linear-gradient(to left, transparent 0%, rgba(0,0,0,1) 4%, rgba(0,0,0,1) 96%, transparent 100%)',
        },
      })
    }),
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
    plugin(function ({ addUtilities, matchUtilities, theme }) {
      const scrollbarTrackColorValue = (value) => ({
        '--scrollbar-track': value,
        '&::-webkit-scrollbar-track': {
          'background-color': value,
        },
      })
      const scrollbarTrackRoundedValue = (value) => ({
        '&::-webkit-scrollbar-track': {
          'border-radius': value,
        },
      })
      const scrollbarThumbColorValue = (value) => ({
        '--scrollbar-thumb': value,
        '&::-webkit-scrollbar-thumb': {
          'background-color': value,
        },
      })
      const scrollbarThumbRoundedValue = (value) => ({
        '&::-webkit-scrollbar-thumb': {
          'border-radius': value,
        },
      })
      addUtilities({
        '.scrollbar': {
          '&::-webkit-scrollbar': {
            width: 'var(--scrollbar-width)',
          },
        },
        '.scrollbar-thin': {
          '--scrollbar-width': '8px',
          'scrollbar-width': 'thin',
        },
        '.light-elliptical-bg': {
          background: '#008ECC',
          opacity: 0.08,
          'backdrop-filter': 'blur(460px)',
        },
      })
      Object.entries(theme('colors')).forEach(([colorName, color]) => {
        switch (typeof color) {
          case 'object':
            matchUtilities(
              {
                [`scrollbar-track-${colorName}`]: (value) =>
                  scrollbarTrackColorValue(value),
                [`scrollbar-thumb-${colorName}`]: (value) =>
                  scrollbarThumbColorValue(value),
              },
              {
                values: color,
              },
            )
            break
          case 'function':
            addUtilities({
              [`.scrollbar-track-${colorName}`]: scrollbarTrackColorValue(
                color({}),
              ),
              [`.scrollbar-thumb-${colorName}`]: scrollbarThumbColorValue(
                color({}),
              ),
            })
            break
          case 'string':
            addUtilities({
              [`.scrollbar-track-${colorName}`]:
                scrollbarTrackColorValue(color),
              [`.scrollbar-thumb-${colorName}`]:
                scrollbarThumbColorValue(color),
            })
            break
        }
      })
      matchUtilities(
        {
          'scrollbar-track-rounded': (value) =>
            scrollbarTrackRoundedValue(value),
          'scrollbar-thumb-rounded': (value) =>
            scrollbarThumbRoundedValue(value),
        },
        {
          values: theme('borderRadius'),
        },
      )
    }),
  ],
}
