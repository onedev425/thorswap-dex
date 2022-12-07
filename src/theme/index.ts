import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
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
    },
  },
});
export default theme;
