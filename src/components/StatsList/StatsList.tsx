import { HorizontalSlider } from 'components/HorizontalSlider';

import { Stats } from './Stats';
import { StatsListProps } from './types';

export const StatsList = ({ list, scrollable = true, itemWidth = 225 }: StatsListProps) => {
  if (scrollable) {
    return (
      <HorizontalSlider itemWidth={itemWidth}>
        {list.map((item) => (
          <Stats key={item.label} {...item} />
        ))}
      </HorizontalSlider>
    );
  }

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {list.map((item) => (
        <Stats key={item.label} {...item} />
      ))}
    </div>
  );
};
