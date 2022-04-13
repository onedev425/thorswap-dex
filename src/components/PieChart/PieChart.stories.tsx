import { ComponentMeta } from '@storybook/react'

import { PieChartData } from 'components/PieChart/types'

import tailwindConfig from '../../../tailwind.config'
import { PieChart } from './PieChart'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/PieChart',
  component: PieChart,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PieChart>

export const All = () => {
  const data: PieChartData[] = [
    {
      value: 25,
      backgroundColor: tailwindConfig.theme.colors.yellow,
      hoverBackgroundColor: '#cca445',
      themeBg: 'bg-yellow',
      iconName: 'bitcoin',
      iconColor: 'yellow',
    },
    {
      value: 40,
      backgroundColor: tailwindConfig.theme.colors.blue,
      hoverBackgroundColor: '#2671a5',
      themeBg: 'bg-blue',
      iconName: 'lightning',
      iconColor: 'blue',
    },
    {
      value: 35,
      backgroundColor: tailwindConfig.theme.colors.purple,
      hoverBackgroundColor: '#52309b',
      themeBg: 'bg-purple',
      iconName: 'lightning',
      iconColor: 'purple',
    },
  ]
  return (
    <div className="flex bg-light-bg-primary dark:bg-dark-bg-primary px-10 py-80">
      <PieChart data={data} />
    </div>
  )
}
