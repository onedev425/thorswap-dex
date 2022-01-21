import React from 'react'

import classNames from 'classnames'

import { CardProps, CardSize } from './types'

const sizeVariants: Record<CardSize, string> = {
  md: 'p-4 rounded-box',
  lg: 'p-10 rounded-box-lg',
}

export const Card = (props: CardProps) => {
  const { size = 'md', stretch = false, children, className } = props

  return (
    <div
      className={classNames(
        'rounded-box bg-light-bg-secondary dark:bg-dark-bg-secondary drop-shadow-box',
        stretch ? 'flex flex-1' : 'inline-flex',
        sizeVariants[size],
        className,
      )}
    >
      {children}
    </div>
  )
}
