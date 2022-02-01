import { useCallback, useState } from 'react'

import { Icon } from 'components/Icon'

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

export const ThemeSwitch = () => {
  // TODO - real theme switching when we will have app theme context
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.Light)
  const isLight = theme === ThemeMode.Light

  const toggleTheme = useCallback(() => {
    setTheme(isLight ? ThemeMode.Dark : ThemeMode.Light)
  }, [isLight])

  return (
    <Icon
      className="transition"
      size={18}
      name={isLight ? 'sun' : 'moon'}
      onClick={toggleTheme}
    />
  )
}
