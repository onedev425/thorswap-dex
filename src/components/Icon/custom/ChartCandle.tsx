import React from 'react'

import { ReactComponent as Icon } from './chartCandle.svg'

type Props = {
  size?: number
  className?: string
}

export const ChartCandle = (props: Props) => {
  const { size, className } = props
  return <Icon className={className} width={size} height={size} />
}
