import { ComponentMeta } from '@storybook/react'

import { Card, Typography } from 'components/Atomic'
import { StatsType } from 'components/Stats'

import { HorizontalSlider } from './HorizontalSlider'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/HorizontalSlider',
  component: HorizontalSlider,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof HorizontalSlider>

const STATS_LIST: StatsType[] = [
  {
    iconName: 'chartPie',
    color: 'yellow',
    label: '24h Volume',
    value: '$46,82.56',
  },
  {
    iconName: 'chartArea',
    color: 'purple',
    label: 'Total Liquidity',
    value: '$509,82b',
  },
  {
    iconName: 'chartCandle',
    color: 'blue',
    label: 'Liquidity APY',
    value: '100,50%',
  },
  {
    iconName: 'refresh',
    color: 'blueLight',
    label: 'Transactions',
    value: '$46,82.3',
  },
  { iconName: 'wifi', color: 'red', label: 'Total Fees', value: '$46,82.56' },
  {
    iconName: 'chartArea2',
    color: 'green',
    label: 'IL Paid',
    value: '$46,82.56',
  },
  {
    iconName: 'lightning',
    color: 'pink',
    label: 'Total Vol',
    value: '$46,82.3',
  },
  {
    iconName: 'fire',
    color: 'blueLight',
    label: 'Funds Cap (i)',
    value: '100.2%',
  },
]

export const Default = () => {
  return (
    <div className="flex flex-row bg-light-bg-primary dark:bg-dark-bg-primary p-4 gap-3">
      <HorizontalSlider itemWidth={300} fadeOut>
        {STATS_LIST.map((item) => (
          <Card className="flex-grow" key={item.value}>
            <Typography>{item.label}</Typography>
          </Card>
        ))}
      </HorizontalSlider>
    </div>
  )
}
