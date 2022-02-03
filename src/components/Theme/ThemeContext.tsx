import { createContext, useContext, ReactNode } from 'react'

import { ThemeMode } from 'components/Theme/types'
import { useThemeState } from 'components/Theme/useThemeState'

type Props = {
  children: ReactNode
}

export type ThemeContextType = {
  theme: ThemeMode
  isLight: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: ThemeMode.Light,
  isLight: true,
  toggleTheme: () => {},
} as ThemeContextType)

export const useTheme = () => useContext(ThemeContext)

const ThemeProvider = ({ children }: Props) => {
  const theme = useThemeState()

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export { ThemeProvider }
