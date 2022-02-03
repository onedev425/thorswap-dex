import { Icon } from 'components/Icon'
import { useTheme } from 'components/Theme/ThemeContext'

export const ThemeSwitch = () => {
  const { toggleTheme, isLight } = useTheme()

  return (
    <Icon
      className="transition"
      size={18}
      name={isLight ? 'sun' : 'moon'}
      onClick={toggleTheme}
    />
  )
}
