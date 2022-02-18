import { useState } from 'react'

import { Menu } from 'components/Menu'
import { MenuItemType } from 'components/Menu/types'
import { useTheme } from 'components/Theme/ThemeContext'

import { t } from 'services/i18n'

type MenuType = 'main' | 'language' | 'currency'

export const AppPopoverMenu = () => {
  const [menuType, setMenuType] = useState<MenuType>('main')
  const { isLight, toggleTheme } = useTheme()

  const onBack = () => setMenuType('main')

  const mainMenu: MenuItemType[] = [
    {
      label: t('appMenu.refresh'),
      icon: 'refresh',
      onClick: () => {},
    },
    {
      label: isLight ? t('appMenu.lightTheme') : t('appMenu.darkTheme'),
      icon: isLight ? 'sun' : 'moon',
      onClick: toggleTheme,
    },
    {
      label: t('appMenu.language'),
      onClick: () => setMenuType('language'),
      icon: 'language',
    },
    {
      label: t('appMenu.currency'),
      onClick: () => setMenuType('currency'),
      icon: 'currencyDollar',
    },
  ]

  const languageMenu: MenuItemType[] = [{ label: 'English' }]

  const currencyMenu: MenuItemType[] = [
    { label: 'USDT', onClick: () => {} },
    { label: 'RUNE', onClick: () => {} },
    { label: 'BTC', onClick: () => {} },
    { label: 'ETH', onClick: () => {} },
  ]

  const menus = {
    main: mainMenu,
    language: languageMenu,
    currency: currencyMenu,
  }

  return (
    <Menu
      items={menus[menuType]}
      onBack={menuType !== 'main' ? onBack : undefined}
    />
  )
}
