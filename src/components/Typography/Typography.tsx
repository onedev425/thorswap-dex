import React from 'react'

import classNames from 'classnames'

import {
  Props,
  colorClasses,
  variantClasses,
  transformClasses,
  weightClasses,
} from './types'

export const Typography: React.FC<Props> = (props: Props) => {
  const {
    component: Component = 'div',
    className = '',
    color = 'primary',
    variant = 'body',
    transform = 'none',
    fontWeight,
    children,
  } = props

  return (
    <Component
      className={classNames(
        colorClasses[color],
        variantClasses[variant],
        transformClasses[transform],
        fontWeight ? weightClasses[fontWeight] : '',
        className,
        'font-primary',
      )}
    >
      {children}
    </Component>
  )
}
