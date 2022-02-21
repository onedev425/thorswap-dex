import { useState } from 'react'

import { MenuItemType } from 'components/Menu/types'
import { useTheme } from 'components/Theme/ThemeContext'

import { t } from 'services/i18n'

type MenuType = 'main' | 'language' | 'currency'

export const useAppPopovermenu = () => {
  const [menuType, setMenuType] = useState<MenuType>('main')

  const onBack = () => setMenuType('main')

  const { language, languageMenu } = useLanguageMenu()
  const { currency, currencyMenu } = useCurrencyMenu()

  const menus = {
    main: useMainMenu(setMenuType, language, currency),
    language: languageMenu,
    currency: currencyMenu,
  }

  return {
    menus,
    menuType,
    onBack,
  }
}

const useMainMenu = (
  setMenuType: (val: MenuType) => void,
  language: string,
  currency: string,
) => {
  const { isLight, toggleTheme } = useTheme()

  const mainMenu: MenuItemType[] = [
    {
      label: t('appMenu.refresh'),
      icon: 'refresh',
      onClick: () => {},
    },
    {
      label: isLight ? t('appMenu.darkTheme') : t('appMenu.lightTheme'),
      icon: isLight ? 'moon' : 'sun',
      onClick: toggleTheme,
    },
    {
      label: t('appMenu.language'),
      onClick: () => setMenuType('language'),
      icon: 'language',
      hasSubmenu: true,
      value: language,
    },
    {
      label: t('appMenu.currency'),
      onClick: () => setMenuType('currency'),
      icon: 'currencyDollar',
      hasSubmenu: true,
      value: currency,
    },
  ]

  return mainMenu
}

const useLanguageMenu = () => {
  const [language, setLanguage] = useState('EN')
  const onLanguageClick = (val: string) => () => setLanguage(val)
  const isLanguageSelected = (val: string) => val === language

  const languageMenu: MenuItemType[] = [
    {
      label: 'English',
      onClick: onLanguageClick('EN'),
      isSelected: isLanguageSelected('EN'),
    },
  ]

  return { languageMenu, language }
}

const useCurrencyMenu = () => {
  const [currency, setCurrency] = useState('USDT')
  const onCurrencyClick = (val: string) => () => setCurrency(val)
  const isCurrencySelected = (val: string) => val === currency

  const currencyMenu: MenuItemType[] = [
    {
      label: 'USDT',
      onClick: onCurrencyClick('USDT'),
      isSelected: isCurrencySelected('USDT'),
    },
    {
      label: 'RUNE',
      onClick: onCurrencyClick('RUNE'),
      isSelected: isCurrencySelected('RUNE'),
    },
    {
      label: 'BTC',
      onClick: onCurrencyClick('BTC'),
      isSelected: isCurrencySelected('BTC'),
    },
    {
      label: 'ETH',
      onClick: onCurrencyClick('ETH'),
      isSelected: isCurrencySelected('ETH'),
    },
  ]

  return { currencyMenu, currency }
}
