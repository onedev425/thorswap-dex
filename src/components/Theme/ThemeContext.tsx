import { createContext, useContext, ReactNode } from 'react'

import { ThemeMode } from 'components/Theme/types'
import { useThemeState } from 'components/Theme/useThemeState'

type Props = {
  children: ReactNode
}

export type ThemeContextType = {
  theme: ThemeMode | null
  isLight: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  isLight: false,
} as ThemeContextType)

export const useTheme = () => useContext(ThemeContext)

const ThemeProvider = ({ children }: Props) => {
  const theme = useThemeState()

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export { ThemeProvider }
