import { useCallback } from 'react'

import { actions } from 'redux/app/slice'
import { useAppDispatch, useAppSelector } from 'redux/store'

import { ThemeType } from 'types/global'

export const useApp = () => {
  const dispatch = useAppDispatch()
  const themeType = useAppSelector(({ app }) => app.themeType)

  const isLightTheme = themeType === ThemeType.LIGHT

  const setTheme = useCallback(
    (theme: ThemeType) => {
      dispatch(actions.setThemeType(theme))
    },
    [dispatch],
  )

  const toggleTheme = useCallback(() => {
    setTheme(isLightTheme ? ThemeType.DARK : ThemeType.LIGHT)
  }, [isLightTheme, setTheme])

  return {
    isLightTheme,
    toggleTheme,
  }
}
