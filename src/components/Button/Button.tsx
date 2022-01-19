import React from 'react'

import classNames from 'classnames'

import { ColorType } from 'types/global'

type ButtonProps = {
  className?: string
  bgColor?: ColorType
  textColor?: 'primary' | 'secondary'
  size?: 'small' | 'large'
  outline?: boolean

  onClick?: () => void
}

const borderClasses: Record<ColorType, string> = {
  primary: 'border-light-btn-primary dark:border-dark-btn-primary',
  secondary: 'border-light-btn-secondary dark:border-dark-btn-secondary',
  purple: 'border-purple',
  yellow: 'border-yellow',
  pink: 'border-pink',
  blue: 'border-blue',
  green: 'border-green',
  orange: 'border-orange',
  cyan: 'border-cyan',
}

const bgClasses: Record<ColorType, string[]> = {
  primary: [
    'bg-transparent hover:bg-light-btn-primary dark:hover:bg-dark-btn-primary',
    'bg-light-btn-primary dark:bg-dark-btn-primary',
  ],
  secondary: [
    'bg-transparent hover:bg-light-btn-secondary dark:hover:bg-dark-btn-secondary',
    'bg-light-btn-secondary dark:bg-dark-btn-secondary',
  ],
  purple: ['bg-transparent hover:bg-purple', 'bg-purple'],
  yellow: ['bg-transparent hover:bg-yellow', 'bg-yellow'],
  pink: ['bg-transparent hover:bg-pink', 'bg-pink'],
  blue: ['bg-transparent hover:bg-blue', 'bg-blue'],
  green: ['bg-transparent hover:bg-green', 'bg-green'],
  orange: ['bg-transparent hover:bg-orange', 'bg-orange'],
  cyan: ['bg-transparent hover:bg-cyan', 'bg-cyan'],
}

const textClasses = {
  primary: 'text-light-typo-primary dark:text-dark-typo-primary',
  secondary: 'text-light-typo-gray dark:text-dark-typo-gray',
}

export const Button: React.FC<ButtonProps> = (props): JSX.Element => {
  const {
    className = '',
    bgColor = 'primary',
    textColor = 'primary',
    size = 'small',
    outline = false,
    children,
    ...rest
  } = props

  return (
    <button
      className={classNames(
        borderClasses[bgColor],
        textClasses[textColor],
        outline ? bgClasses[bgColor][0] : bgClasses[bgColor][1],
        size === 'small' ? 'h-10' : 'h-12 min-w-[180px]',
        size === 'small' ? 'rounded-2xl' : 'rounded-3xl',
        'px-4 border border-solid font-primary outline-none cursor-pointer transition',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
