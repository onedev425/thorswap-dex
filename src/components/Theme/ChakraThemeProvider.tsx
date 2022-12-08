import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { useTheme } from 'components/Theme/ThemeContext';
import { ReactNode } from 'react';

import theme from '../../theme/index';

type Props = {
  children: ReactNode;
};

export const ChakraThemeProvider = ({ children }: Props) => {
  // Chakra color mode is based on tailwind / theme value stored in redux
  const { isLight } = useTheme();

  return (
    <ChakraProvider resetCSS={false} theme={theme}>
      <ColorModeProvider value={isLight ? 'light' : 'dark'}>{children}</ColorModeProvider>
    </ChakraProvider>
  );
};
