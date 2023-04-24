import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import type { StyleFunctionProps } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import { colors } from './colors';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors: {
    brand: colors,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        color: mode(colors.light.textPrimary, colors.dark.textPrimary)(props),
      },
    }),
  },
  textStyles: {
    h1: {
      fontSize: '48px',
      lineHeight: '42px',
      letterSpacing: '-0.04em',
      fontWeight: 500,
    },
    h2: {
      fontSize: '28px',
      lineHeight: '42px',
      letterSpacing: '0.02em',
      fontWeight: 600,
    },
    h3: {
      fontSize: '24px',
      lineHeight: '36px',
      letterSpacing: '0.025em',
      fontWeight: 800,
    },
    h4: {
      fontSize: '21px',
      lineHeight: '31px',
      letterSpacing: '-0.01em',
      fontWeight: 800,
    },
    h5: {
      fontSize: '21px',
      lineHeight: '17px',
      letterSpacing: '-0.01em',
      fontWeight: 800,
    },
    subtitle1: {
      fontSize: '17px',
      lineHeight: '25px',
      letterSpacing: '-0.02em',
      fontWeight: 800,
    },
    subtitle2: {
      fontSize: '17px',
      lineHeight: '25px',
      letterSpacing: '-0.01em',
      fontWeight: 600,
    },
    body: {
      fontSize: '14px',
      lineHeight: '21px',
      letterSpacing: '0.03em',
      fontWeight: 500,
    },
    caption: {
      fontSize: '12px',
      lineHeight: '18px',
      letterSpacing: '0.03em',
      fontWeight: '700',
    },
    'caption-xs': {
      fontSize: '11px',
      lineHeight: '18px',
      letterSpacing: '0.03em',
      fontWeight: 700,
    },
  },
  shadows: {
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  semanticTokens: {
    colors: {
      textPrimary: {
        default: colors.light.textPrimary,
        _dark: colors.dark.textPrimary,
      },
      textSecondary: {
        default: colors.light.textSecondary,
        _dark: colors.dark.textSecondary,
      },
      borderPrimary: {
        default: colors.light.borderPrimary,
        _dark: colors.dark.borderPrimary,
      },
      bgPrimary: {
        default: colors.light.bgPrimary,
        _dark: colors.dark.bgPrimary,
      },
      bgSecondary: {
        default: colors.light.bgSecondary,
        _dark: colors.dark.bgSecondary,
      },
      grayPrimary: {
        default: colors.light.grayPrimary,
        _dark: colors.dark.grayPrimary,
      },
      tintHoverPrimary: {
        default: colors.light.btnBorderPrimary,
        _dark: colors.dark.btnBorderPrimary,
      },
    },
  },
  components: {
    Drawer: {
      sizes: {
        sm: { dialog: { maxW: '92.5%' } },
        md: { dialog: { maxW: '365px' } },
      },
      defaultProps: {
        size: 'md',
      },
      baseStyle: {
        dialog: {
          backgroundColor: 'transparent',
        },
        body: {
          p: 0,
        },
      },
    },
    Card: {
      baseStyle: {
        dialog: {
          backgroundColor: 'transparent',
        },
        body: {
          p: 0,
        },
        container: {
          border: '1px solid transparent',
          transition: 'all 0.2s ease-in-out',
        },
      },
      variants: {
        filledContainerPrimary: () => ({
          container: {
            p: 4,
            bgColor: 'bgPrimary',
          },
        }),
        filledContainerSecondary: () => ({
          container: {
            padding: 4,
            bgColor: 'bgSecondary',
          },
        }),
        filled: () => ({
          container: {
            bgColor: 'bgPrimary',
            _hover: {
              bgColor: 'tintHoverPrimary',
              borderColor: 'grayPrimary',
            },
          },
        }),
        elevated: () => ({
          container: {
            bgColor: 'bgPrimary',
            _hover: {
              bgColor: 'tintHoverPrimary',
              borderColor: 'grayPrimary',
            },
          },
        }),
      },
    },
    Text: {
      defaultProps: {
        variant: 'primary',
      },
      baseStyle: {
        fontFamily: 'Poppins, sans-serif',
        textStyle: 'body',
        variant: 'primary',
      },
      variants: {
        primary: (props: StyleFunctionProps) => ({
          color: mode(colors.light.textPrimary, colors.dark.textPrimary)(props),
        }),
        secondary: (props: StyleFunctionProps) => ({
          color: mode(colors.light.textSecondary, colors.dark.typoGray)(props),
        }),
        purple: { color: colors.purple },
        yellow: { color: colors.yellow },
        pink: { color: colors.pink },
        blue: { color: colors.blue },
        blueLight: { color: colors.blueLight },
        greenLight: { color: colors.greenLight },
        green: { color: colors.green },
        orange: { color: colors.orange },
        cyan: { color: colors.cyan },
        gray: { color: colors.gray },
        red: { color: colors.red },
        primaryBtn: { color: colors.btnPrimary },
        secondaryBtn: { color: colors.btnSecondary },
      },
    },
    Modal: {
      sizes: {
        md: { dialog: { maxW: '520px' } },
      },
      dialog: {
        shadow: 'none',
      },
      header: {
        p: 0,
      },
      body: {
        p: 0,
      },
    },
    Button: {
      defaultProps: { size: 'sm' },
      variants: {
        outlinePrimary: {
          borderColor: colors.blueLight,
          _dark: { borderColor: colors.btnPrimary },
          _hover: {
            bgColor: colors.blueLight + '33',
            _dark: { bgColor: colors.btnPrimary + '33' },
          },
        },
        outlineSecondary: {
          borderColor: colors.btnSecondary,
          _hover: { bgColor: colors.btnSecondary + '33' },
        },
        outlineTertiary: { borderColor: colors.purple, _hover: { bgColor: colors.purple + '33' } },
        outlineWarn: { borderColor: colors.orange, _hover: { bgColor: colors.orange + '33' } },
        outlineTint: {
          borderColor: colors.light.btnBorderPrimary,
          _dark: { borderColor: colors.gray },
          _hover: {
            bgColor: colors.light.btnBorderPrimary + '33',
            _dark: { bgColor: colors.gray + '33' },
          },
        },

        borderlessPrimary: {
          _hover: {
            bgColor: colors.blueLight + '33',
            _dark: { bgColor: colors.btnPrimary + '33' },
          },
        },
        borderlessSecondary: {
          _hover: { bgColor: colors.btnSecondary + '33' },
        },
        borderlessTertiary: {
          _hover: { bgColor: colors.purple + '33' },
        },
        borderlessWarn: {
          _hover: { bgColor: colors.orange + '33' },
        },
        borderlessTint: {
          _hover: {
            bgColor: colors.bgBtnLightTintActive + '33',
            _dark: { bgColor: colors.tintHover },
          },
        },

        primary: {
          color: colors.dark.textPrimary,
          bgColor: colors.blueLight,
          _dark: { bgColor: colors.btnPrimary },
          _hover: {
            bgColor: colors.blueLight + 'CC',
            _dark: { bgColor: colors.btnPrimary + 'CC' },
          },
        },
        secondary: {
          color: colors.dark.textPrimary,
          bgColor: colors.btnSecondary,
          _hover: {
            bgColor: colors.btnSecondary + 'CC',
          },
        },
        tertiary: {
          color: colors.dark.textPrimary,
          bgColor: colors.purple,
          _hover: {
            bgColor: colors.purple + 'CC',
          },
        },
        warn: {
          color: colors.dark.textPrimary,
          bgColor: colors.orange,
          _hover: {
            bgColor: colors.orange + 'CC',
          },
        },
        tint: {
          bgColor: colors.bgLightGray,
          _dark: { bgColor: colors.gray },
          _hover: {
            bgColor: colors.bgBtnLightTintActive,
            _dark: { bgColor: colors.tintHover },
          },
        },
        fancy: {
          color: colors.white,
          border: 'none',
          bg: `linear-gradient(90deg, ${colors.btnSecondary} 0%, ${colors.blueLight} 80%)`,
          _hover: {
            bg: `linear-gradient(90deg, ${colors.btnSecondary + 'DD'} 0%, ${
              colors.blueLight + 'DD'
            } 80%)`,
            _disabled: {
              bg: `linear-gradient(90deg, ${colors.btnSecondary + 'DD'} 0%, ${
                colors.blueLight + 'DD'
              } 80%)`,
            },
          },
        },
        fancyError: {
          color: colors.white,
          border: 'none',
          bg: `linear-gradient(90deg, ${colors.fancyErrorStart} 0%, ${colors.fancyErrorStop} 80%)`,
          _hover: {
            bg: `linear-gradient(90deg, ${colors.fancyErrorStart + 'DD'} 0%, ${
              colors.fancyErrorStop + 'DD'
            } 80%)`,
            _disabled: {
              bg: `linear-gradient(90deg, ${colors.fancyErrorStart + 'DD'} 0%, ${
                colors.fancyErrorStop + 'DD'
              } 80%)`,
            },
          },
        },
      },
      sizes: {
        lg: {
          h: 14,
          px: 7,
          borderRadius: 'full',
        },
        md: {
          h: 12,
          px: 6,
          borderRadius: 24,
        },
        sm: { h: 10, px: 3, borderRadius: 16 },
        xs: { h: 7, px: 3, borderRadius: 16 },
      },
      baseStyle: (props: StyleFunctionProps) => ({
        display: 'flex',
        align: 'center',
        color: mode(colors.light.textPrimary, colors.dark.textPrimary)(props),
        justify: 'center',
        outline: 'none',
        p: 0,
        border: '1px solid',
        borderColor: 'transparent',
        fontFamily: 'Poppins, sans-serif',

        _active: { opacity: 1 },

        _disabled: {
          cursor: 'not-allowed',
          opacity: 0.75,
          _dark: {
            opacity: 0.6,
          },
        },
      }),
    },
    Spinner: {
      baseStyle: (props: StyleFunctionProps) => ({
        color: mode(colors.light.textPrimary, colors.dark.textPrimary)(props),
      }),
    },
    Switch: {
      sizes: {
        lg: { track: { h: 5, w: '42px' }, thumb: { h: 5, w: 5 } },
      },
      variants: {
        // eslint-disable-next-line prettier/prettier
        'secondary': (props: StyleFunctionProps) => ({
          track: {
            _focus: { boxShadow: 'none' },
            _checked: {
              backgroundColor: mode(colors.bgBtnLightTintActive, colors.bgDarkBgPrimary)(props),
            },
          },
        }),
      },
      baseStyle: (props: StyleFunctionProps) => ({
        track: {
          _focus: { boxShadow: 'none' },
          _checked: {
            backgroundColor: mode(colors.bgBtnLightTintActive, colors.bgDarkBgSecondary)(props),
          },
          backgroundColor: mode(colors.bgLightGrayLight, colors.bgDarkGrayPrimary)(props),
        },
        thumb: {
          _checked: { backgroundColor: colors.cyan },
        },
      }),
    },
    Tabs: {
      baseStyle: () => ({
        root: {
          borderColor: 'borderPrimary',
          color: 'textSecondary',
        },
        tab: {
          letterSpacing: '0.03em',
          fontWeight: 600,
          _selected: {
            color: 'brand.btnPrimary',
          },
        },
        tabpanel: {
          px: 0,
        },
      }),
    },
  },
});
export default theme;
