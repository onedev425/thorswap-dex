import classNames from 'classnames'

import { baseBorderClass } from 'components/constants'

import { CardProps, CardSize } from './types'

const sizeVariants: Record<CardSize, string> = {
  md: 'p-4 rounded-box',
  lg: 'p-8 md:p-10 rounded-box-lg',
}

export const Card = ({
  className,
  size = 'md',
  stretch = false,
  children,
  shadow = true,
  onClick,
  withBorder,
}: CardProps) => {
  return (
    <div
      className={classNames(
        'bg-light-bg-secondary dark:bg-dark-bg-secondary',
        { 'drop-shadow-box box-border': shadow },
        { [baseBorderClass]: withBorder },
        stretch ? 'flex flex-1' : 'inline-flex',
        sizeVariants[size],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
