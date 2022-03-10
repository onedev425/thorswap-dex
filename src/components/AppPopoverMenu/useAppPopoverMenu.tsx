import { useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { MenuItemType } from 'components/Menu/types'
import { useTheme } from 'components/Theme/ThemeContext'

import { useApp } from 'redux/app/hooks'

import { t, changeAppLanguage, getLanguageFlag } from 'services/i18n'

import { SupportedLanguages, ThemeType, ThousandSeparator } from 'types/global'

type MenuType = 'main' | 'language' | 'currency' | 'theme' | 'thousandSeparator'

export const useAppPopoverMenu = () => {
  const [menuType, setMenuType] = useState<MenuType>('main')

  const onBack = () => setMenuType('main')

  const menus = {
    language: {
      title: t('appMenu.language'),
      items: useLanguageMenu(onBack),
    },
    currency: {
      title: t('appMenu.currency'),
      items: useCurrencyMenu(onBack),
    },
    main: {
      title: t('common.settings'),
      items: useMainMenu(setMenuType),
    },
    theme: {
      title: t('appMenu.theme'),
      items: useThemeMenu(onBack),
    },
    thousandSeparator: {
      title: t('appMenu.thousandSeparator'),
      items: useThousandSeparatorMenu(onBack),
    },
  }

  return {
    menus,
    menuType,
    onBack,
  }
}

const useMainMenu = (setMenuType: (val: MenuType) => void) => {
  const { isLight } = useTheme()
  const { themeType, thousandSeparator, language, baseCurrency } = useApp()

  const mainMenu: MenuItemType[] = [
    {
      label: getThemeLabel(themeType),
      desc: t('appMenu.themeDesc'),
      icon: isLight ? 'sun' : 'moon',
      onClick: () => setMenuType('theme'),
    },
    {
      label: getLanguageLabel(language),
      desc: t('appMenu.languageDesc'),
      onClick: () => setMenuType('language'),
      icon: 'language',
      iconComponent: (
        <span className="text-2xl leading-6">{getLanguageFlag(language)}</span>
      ),
      hasSubmenu: true,
      value: language,
    },
    {
      label: getSeparatorLabel(thousandSeparator),
      desc: t('appMenu.separatorDesc'),
      onClick: () => setMenuType('thousandSeparator'),
      icon: 'spaceBar',
      hasSubmenu: true,
      value: thousandSeparator,
    },
    {
      label:
        Asset.fromAssetString(baseCurrency)?.currencySymbol() ||
        t('appMenu.currency'),
      desc: t('appMenu.currencyDesc'),
      onClick: () => setMenuType('currency'),
      icon: 'currencyDollar',
      hasSubmenu: true,
      value: baseCurrency,
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
      label: `${getLanguageFlag('en')} English`,
      onClick: () => onLanguageClick('en'),
      isSelected: isLanguageSelected('en'),
    },
    {
      label: `${getLanguageFlag('es')} Español`,
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
  const isCurrencySelected = (val: Asset) => val.toString() === baseCurrency

  const currencyMenu: MenuItemType[] = [
    {
      label: 'USD',
      onClick: () => onCurrencyClick(Asset.USD()),
      isSelected: isCurrencySelected(Asset.USD()),
    },
    {
      label: 'RUNE',
      onClick: () => onCurrencyClick(Asset.RUNE()),
      isSelected: isCurrencySelected(Asset.RUNE()),
    },
    {
      label: 'BTC',
      onClick: () => onCurrencyClick(Asset.BTC()),
      isSelected: isCurrencySelected(Asset.BTC()),
    },
    {
      label: 'ETH',
      onClick: () => onCurrencyClick(Asset.ETH()),
      isSelected: isCurrencySelected(Asset.ETH()),
    },
  ]

  return currencyMenu
}

const useThemeMenu = (onBack: () => void) => {
  const { themeType, setTheme } = useApp()
  const onThemeClick = (val: ThemeType) => {
    onBack()
    setTheme(val)
  }

  const isThemeSelected = (val: ThemeType) => val === themeType

  const menu: MenuItemType[] = [
    {
      label: t('appMenu.lightTheme'),
      onClick: () => onThemeClick(ThemeType.Light),
      isSelected: isThemeSelected(ThemeType.Light),
    },
    {
      label: t('appMenu.darkTheme'),
      onClick: () => onThemeClick(ThemeType.Dark),
      isSelected: isThemeSelected(ThemeType.Dark),
    },
    {
      label: t('appMenu.automaticTheme'),
      onClick: () => onThemeClick(ThemeType.Auto),
      isSelected: isThemeSelected(ThemeType.Auto),
    },
  ]

  return menu
}

const useThousandSeparatorMenu = (onBack: () => void) => {
  const { thousandSeparator, setThousandSeparator } = useApp()
  const onClick = (val: ThousandSeparator) => {
    onBack()
    setThousandSeparator(val)
  }

  const isThemeSelected = (val: ThousandSeparator) => val === thousandSeparator

  const menu: MenuItemType[] = [
    {
      label: t('appMenu.separatorSpace'),
      onClick: () => onClick(ThousandSeparator.Space),
      isSelected: isThemeSelected(ThousandSeparator.Space),
    },
    {
      label: t('appMenu.separatorComma'),
      onClick: () => onClick(ThousandSeparator.Comma),
      isSelected: isThemeSelected(ThousandSeparator.Comma),
    },
    {
      label: t('appMenu.separatorNone'),
      onClick: () => onClick(ThousandSeparator.None),
      isSelected: isThemeSelected(ThousandSeparator.None),
    },
  ]

  return menu
}

const getThemeLabel = (val: ThemeType) => {
  switch (val) {
    case ThemeType.Auto:
      return t('appMenu.automaticTheme')
    case ThemeType.Dark:
      return t('appMenu.darkTheme')
    case ThemeType.Light:
      return t('appMenu.lightTheme')
    default:
      return t('appMenu.theme')
  }
}

const getLanguageLabel = (val: SupportedLanguages) => {
  switch (val) {
    case 'en':
      return 'English'
    case 'es':
      return 'Español'
    default:
      return t('appMenu.language')
  }
}

const getSeparatorLabel = (val: ThousandSeparator) => {
  switch (val) {
    case ThousandSeparator.Space:
      return `${t('appMenu.separatorSpace')} (1 000)`
    case ThousandSeparator.Comma:
      return `${t('appMenu.separatorComma')} (1,000)`
    case ThousandSeparator.None:
      return `${t('appMenu.separatorNone')} (1000)`
    default:
      return t('appMenu.thousandSeparator')
  }
}
