module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      // common colors
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
        'typo-secondary': '#7C859F',
        'btn-primary': '#39BBF3',
        'btn-secondary': '#4DC5B8',
        'chart-bg': '#39BBF3',
      },

      // dark
      dark: {
        'bg-primary': '#121526',
        'bg-secondary': '#232E42',
        'typo-primary': '#E2EBFB',
        'typo-secondary': '#75849D',
        'btn-primary': '#4DBAD6',
        'btn-secondary': '#46B2A7',
        'chart-bg': '#348CF4',
      },
    },
    fontFamily: {
      primary: ['Poppins', 'sans-serif'],
    },
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
