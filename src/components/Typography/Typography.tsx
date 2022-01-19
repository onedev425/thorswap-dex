import React from 'react'

import classNames from 'classnames'

import { Props, colorClasses, variantClasses, weightClasses } from './types'

export const Typography: React.FC<Props> = (props: Props) => {
  const {
    component: Component = 'div',
    className = '',
    color = 'primary',
    variant = 'body',
    fontWeight = 'normal',
    children,
  } = props

  return (
    <Component
      className={classNames(
        colorClasses[color],
        variantClasses[variant],
        weightClasses[fontWeight],
        className,
        'font-primary',
      )}
    >
      {children}
    </Component>
  )
}
