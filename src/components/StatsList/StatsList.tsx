import React from 'react'

import { Stats } from '../Stats'
import { StatsListScrollable } from './StatsListScrollable'
import { StatsListProps } from './types'

export const StatsList = (props: StatsListProps) => {
  const { list, scrollable } = props

  if (scrollable) {
    return <StatsListScrollable {...props} />
  }

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {list.map((item) => (
        <Stats {...item} key={item.label} />
      ))}
    </div>
  )
}
