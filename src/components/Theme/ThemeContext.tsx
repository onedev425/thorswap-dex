import { ThemeMode } from 'components/Theme/types';
import { useThemeState } from 'components/Theme/useThemeState';
import { createContext, ReactNode, useContext } from 'react';

type Props = {
  children: ReactNode;
};

export type ThemeContextType = {
  theme: ThemeMode | null;
  isLight: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  isLight: false,
} as ThemeContextType);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: Props) => {
  const theme = useThemeState();

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
