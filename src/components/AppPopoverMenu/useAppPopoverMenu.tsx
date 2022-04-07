import { useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { IconName } from 'components/Atomic'
import { MenuItemType } from 'components/Menu/types'
import { useTheme } from 'components/Theme/ThemeContext'

import { useApp } from 'store/app/hooks'

import { t, changeAppLanguage, getLanguageFlag } from 'services/i18n'

import { SupportedLanguages, ThemeType, ThousandSeparator } from 'types/app'

type MenuType = 'main' | 'language' | 'currency' | 'theme' | 'thousandSeparator'

const separatorIcons: Record<ThousandSeparator, IconName> = {
  [ThousandSeparator.Space]: 'spaceBar',
  [ThousandSeparator.Comma]: 'comma',
  [ThousandSeparator.None]: 'blocked',
}

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
  const currencyAsset = Asset.fromAssetString(baseCurrency)

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
      icon: 'languageLetters',
      hasSubmenu: true,
      value: language,
    },
    {
      label: getSeparatorLabel(thousandSeparator),
      desc: t('appMenu.separatorDesc'),
      onClick: () => setMenuType('thousandSeparator'),
      icon: separatorIcons[thousandSeparator],
      hasSubmenu: true,
      value: thousandSeparator,
    },
    {
      label: currencyAsset?.currencySymbol() || t('appMenu.currency'),
      desc: t('appMenu.currencyDesc'),
      onClick: () => setMenuType('currency'),
      icon: 'dollarOutlined',
      iconComponent:
        !currencyAsset || currencyAsset?.name === 'USD' ? null : (
          <AssetIcon asset={currencyAsset} hasChainIcon size={25} />
        ),
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
      label: `${getLanguageFlag('en')} English (US)`,
      onClick: () => onLanguageClick('en'),
      isSelected: isLanguageSelected('en'),
    },
    {
      label: `${getLanguageFlag('es')} Español (ESP)`,
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
      icon: 'currencyDollar',
      onClick: () => onCurrencyClick(Asset.USD()),
      isSelected: isCurrencySelected(Asset.USD()),
    },
    {
      label: 'RUNE',
      icon: 'thor',
      onClick: () => onCurrencyClick(Asset.RUNE()),
      isSelected: isCurrencySelected(Asset.RUNE()),
    },
    {
      label: 'BTC',
      icon: 'btc',
      onClick: () => onCurrencyClick(Asset.BTC()),
      isSelected: isCurrencySelected(Asset.BTC()),
    },
    {
      label: 'ETH',
      icon: 'eth',
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
      icon: 'sun',
      label: t('appMenu.lightTheme'),
      onClick: () => onThemeClick(ThemeType.Light),
      isSelected: isThemeSelected(ThemeType.Light),
    },
    {
      icon: 'moon',
      label: t('appMenu.darkTheme'),
      onClick: () => onThemeClick(ThemeType.Dark),
      isSelected: isThemeSelected(ThemeType.Dark),
    },
    {
      icon: 'auto',
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
      icon: 'spaceBar',
      label: t('appMenu.separatorSpace'),
      onClick: () => onClick(ThousandSeparator.Space),
      isSelected: isThemeSelected(ThousandSeparator.Space),
    },
    {
      icon: 'comma',
      label: t('appMenu.separatorComma'),
      onClick: () => onClick(ThousandSeparator.Comma),
      isSelected: isThemeSelected(ThousandSeparator.Comma),
    },
    {
      icon: 'blocked',
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
      return 'English (US)'
    case 'es':
      return 'Español (ESP)'
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
      return t('appMenu.separatorComma')
  }
}
