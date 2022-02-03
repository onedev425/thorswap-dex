import { useEffect, useState, useCallback } from 'react'

import { ThemeMode } from 'components/Theme/types'

export const useThemeState = () => {
  const getTheme = () => {
    const isDark =
      localStorage.theme === ThemeMode.Dark ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)

    return isDark ? ThemeMode.Dark : ThemeMode.Light
  }
  const [theme, setTheme] = useState<ThemeMode>(getTheme)
  const isLight = theme === ThemeMode.Light

  const activateTheme = (updatedTheme: ThemeMode) => {
    if (updatedTheme === ThemeMode.Light) {
      document.documentElement.classList.remove(ThemeMode.Dark)
    } else if (!document.documentElement.classList.contains(ThemeMode.Dark)) {
      document.documentElement.classList.add(ThemeMode.Dark)
    }

    localStorage.theme = updatedTheme
  }

  const toggleTheme = useCallback(() => {
    setTheme(isLight ? ThemeMode.Dark : ThemeMode.Light)
  }, [isLight])

  useEffect(() => {
    activateTheme(theme)
  }, [theme])

  return { theme, isLight, toggleTheme }
}
