import React from 'react'

import classNames from 'classnames'

import { ColorType } from 'types/global'

import IconList, { IconName } from './iconList'

export const colorClasses: Record<ColorType, string> = {
  primary: 'text-light-typo-primary dark:text-dark-typo-primary',
  secondary: 'text-light-typo-gray dark:text-dark-typo-gray',
  purple: 'text-purple',
  yellow: 'text-yellow',
  pink: 'text-pink',
  blue: 'text-blue',
  green: 'text-green',
  orange: 'text-orange',
  cyan: 'text-cyan',
  gray: 'text-gray',
}

export type Props = {
  className?: string
  color?: ColorType
  name: IconName
  size?: number
  onClick?: () => void
}

export const Icon = (props: Props) => {
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
