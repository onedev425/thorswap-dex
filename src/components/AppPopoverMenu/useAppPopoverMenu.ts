import { useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { MenuItemType } from 'components/Menu/types'
import { useTheme } from 'components/Theme/ThemeContext'

import { useApp } from 'redux/app/hooks'

import { t } from 'services/i18n'
import { changeAppLanguage } from 'services/i18n/i18nService'

import { getFromStorage } from 'helpers/storage'

import { SupportedLanguages } from 'types/global'

type MenuType = 'main' | 'language' | 'currency'

export const useAppPopoverMenu = () => {
  const [menuType, setMenuType] = useState<MenuType>('main')

  const onBack = () => setMenuType('main')

  const menus = {
    language: useLanguageMenu(onBack),
    currency: useCurrencyMenu(onBack),
    main: useMainMenu(
      setMenuType,
      getFromStorage('language') as string,
      getFromStorage('baseCurrency') as string,
    ),
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
      label: `${t('appMenu.language')} (${language})`,
      onClick: () => setMenuType('language'),
      icon: 'language',
      hasSubmenu: true,
      value: language,
    },
    {
      label: `${t('appMenu.currency')} ($${currency})`,
      onClick: () => setMenuType('currency'),
      icon: 'currencyDollar',
      hasSubmenu: true,
      value: currency,
    },
  ]

  return mainMenu
}

const useLanguageMenu = (onBack: () => void) => {
  const { language, setLanguage } = useApp()
  const onLanguageClick = (val: SupportedLanguages) => {
    onBack()
    setLanguage(val)
    changeAppLanguage(val)
  }

  const isLanguageSelected = (val: SupportedLanguages) => val === language

  const languageMenu: MenuItemType[] = [
    {
      label: 'English 🇺🇸',
      onClick: () => onLanguageClick('en'),
      isSelected: isLanguageSelected('en'),
    },
    {
      label: 'Español 🇪🇸',
      onClick: () => onLanguageClick('es'),
      isSelected: isLanguageSelected('es'),
    },
  ]

  return languageMenu
}

const useCurrencyMenu = (onBack: () => void) => {
  const { baseCurrency, setBaseCurrency } = useApp()
  const onCurrencyClick = (val: Asset) => {
    onBack()
    setBaseCurrency(val)
  }
  const isCurrencySelected = (val: string) => val === baseCurrency

  const currencyMenu: MenuItemType[] = [
    {
      label: 'USD',
      onClick: () => onCurrencyClick(Asset.USD()),
      isSelected: isCurrencySelected('USD'),
    },
    {
      label: 'RUNE',
      onClick: () => onCurrencyClick(Asset.RUNE()),
      isSelected: isCurrencySelected('RUNE'),
    },
    {
      label: 'BTC',
      onClick: () => onCurrencyClick(Asset.BTC()),
      isSelected: isCurrencySelected('BTC'),
    },
    {
      label: 'ETH',
      onClick: () => onCurrencyClick(Asset.ETH()),
      isSelected: isCurrencySelected('ETH'),
    },
  ]

  return currencyMenu
}
