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
  },
});
export default theme;
