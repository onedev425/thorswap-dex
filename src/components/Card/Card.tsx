import classNames from 'classnames'

import { CardProps, CardSize } from './types'

const sizeVariants: Record<CardSize, string> = {
  md: 'p-4 rounded-box',
  lg: 'p-10 rounded-box-lg',
}

export const Card = (props: CardProps) => {
  const { className, size = 'md', stretch = false, children, onClick } = props

  return (
    <div
      className={classNames(
        'rounded-box bg-light-bg-secondary dark:bg-dark-bg-secondary drop-shadow-box box-border',
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
