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
    },
  },
  components: {
    Drawer: {
      sizes: {
        sm: { dialog: { maxW: '380px' } },
      },
      defaultProps: {
        size: 'sm',
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
