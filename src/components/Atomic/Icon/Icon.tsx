import classNames from 'classnames'

import IconList from './iconList'

export type IconName = keyof typeof IconList
export type IconColor = keyof typeof colorClasses

export const colorClasses = {
  primary: 'text-light-typo-primary dark:text-dark-typo-primary',
  light: 'text-dark-typo-primary',
  secondary: 'text-light-typo-gray dark:text-dark-typo-gray',
  tertiary: 'text-light-typo-primary dark:text-dark-typo-gray',
  purple: 'text-purple',
  yellow: 'text-yellow',
  pink: 'text-pink',
  blue: 'text-blue',
  blueLight: 'text-blue-light',
  greenLight: 'text-green-light',
  green: 'text-green',
  orange: 'text-orange',
  cyan: 'text-cyan',
  gray: 'text-gray',
  red: 'text-red',
  white: 'text-white',
  primaryBtn: 'text-btn-primary dark:text-btn-primary',
} as const

export type IconProps = {
  className?: string
  color?: keyof typeof colorClasses
  name: IconName
  size?: number
  onClick?: () => void
}

export const Icon = (props: IconProps) => {
  const { className, color = 'primary', name, size = 24, onClick } = props
  const IconComp = IconList[name]

  return (
    <IconComp
      className={classNames(
        className,
        colorClasses[color],
        onClick ? 'cursor-pointer' : '',
      )}
      size={size}
      onClick={onClick}
    />
  )
}
