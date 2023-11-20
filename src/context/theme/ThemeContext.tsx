import { useThemeState } from 'context/theme/useThemeState';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { ThemeType } from 'types/app';

type Props = {
  children: ReactNode;
};

export type ThemeContextType = {
  theme: ThemeType;
  isLight: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: ThemeType.Dark,
  isLight: false,
} as ThemeContextType);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: Props) => {
  const theme = useThemeState();

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
