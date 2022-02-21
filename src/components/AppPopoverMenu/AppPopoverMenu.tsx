import { useAppPopovermenu } from 'components/AppPopoverMenu/useAppPopovermenu'
import { Menu } from 'components/Menu'

export const AppPopoverMenu = () => {
  const { menus, menuType, onBack } = useAppPopovermenu()

  return (
    <Menu
      items={menus[menuType]}
      onBack={menuType !== 'main' ? onBack : undefined}
      onClose={onBack}
    />
  )
}
