import { HorizontalSlider } from 'components/HorizontalSlider'
import { Stats } from 'components/Stats'
import { statsWidth } from 'components/Stats/types'

import { StatsListProps } from './types'

export const StatsList = ({ list, scrollable = true }: StatsListProps) => {
  if (scrollable) {
    return (
      <HorizontalSlider itemWidth={statsWidth} fadeOut>
        {list.map((item) => (
          <Stats key={item.label} {...item} />
        ))}
      </HorizontalSlider>
    )
  }

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {list.map((item) => (
        <Stats key={item.label} {...item} />
      ))}
    </div>
  )
}
