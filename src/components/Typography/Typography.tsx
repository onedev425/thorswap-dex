import classNames from 'classnames'

import {
  Props,
  colorClasses,
  variantClasses,
  transformClasses,
  weightClasses,
  defaultWeightClasses,
} from './types'

export const Typography = (props: Props) => {
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
        fontWeight ? weightClasses[fontWeight] : defaultWeightClasses[variant],
        className,
        'font-primary',
      )}
    >
      {children}
    </Component>
  )
}
