import { ComponentMeta } from '@storybook/react'

import { Card } from 'components/Card'

import { Chart } from './Chart'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Chart',
  component: Chart,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Chart>

export const BarChart = () => {
  const sampleData = [
    { x: 'Sep 1', y: 0 },
    { x: 'Sep 2', y: 30 },
    { x: 'Sep 3', y: 25 },
    { x: 'Sep 4', y: 40 },
    { x: 'Sep 5', y: 60 },
    { x: 'Sep 6', y: 55 },
    { x: 'Sep 7', y: 50 },
    { x: 'Sep 8', y: 40 },
    { x: 'Sep 9', y: 20 },
    { x: 'Sep 10', y: 60 },
    { x: 'Sep 11', y: 90 },
    { x: 'Sep 12', y: 100 },
    { x: 'Sep 13', y: 95 },
    { x: 'Sep 14', y: 75 },
    { x: 'Sep 15', y: 60 },
    { x: 'Sep 16', y: 35 },
    { x: 'Sep 17', y: 80 },
    { x: 'Sep 18', y: 110 },
    { x: 'Sep 19', y: 100 },
    { x: 'Sep 20', y: 90 },
    { x: 'Sep 21', y: 40 },
    { x: 'Sep 22', y: 30 },
    { x: 'Sep 23', y: 10 },
    { x: 'Sep 24', y: 20 },
    { x: 'Sep 26', y: 30 },
    { x: 'Sep 27', y: 28 },
    { x: 'Sep 28', y: 26 },
    { x: 'Sep 29', y: 20 },
    { x: 'Sep 30', y: 10 },
    { x: 'Oct 1', y: 30 },
    { x: 'Oct 2', y: 40 },
    { x: 'Oct 3', y: 80 },
    { x: 'Oct 4', y: 90 },
    { x: 'Oct 5', y: 40 },
    { x: 'Oct 6', y: 50 },
    { x: 'Oct 7', y: 30 },
    { x: 'Oct 8', y: 60 },
    { x: 'Oct 9', y: 20 },
    { x: 'Oct 10', y: 10 },
  ]

  return (
    <Card className="w-full">
      <Chart type="bar" data={sampleData} />
    </Card>
  )
}

export const AreaChart = () => {
  const sampleData = [
    { x: 'Sep 1', y: 0 },
    { x: 'Sep 2', y: 30 },
    { x: 'Sep 3', y: 25 },
    { x: 'Sep 4', y: 40 },
    { x: 'Sep 5', y: 60 },
    { x: 'Sep 6', y: 55 },
    { x: 'Sep 7', y: 50 },
    { x: 'Sep 8', y: 40 },
    { x: 'Sep 9', y: 20 },
    { x: 'Sep 10', y: 60 },
    { x: 'Sep 11', y: 90 },
    { x: 'Sep 12', y: 100 },
    { x: 'Sep 13', y: 95 },
    { x: 'Sep 14', y: 75 },
    { x: 'Sep 15', y: 60 },
    { x: 'Sep 16', y: 35 },
    { x: 'Sep 17', y: 80 },
    { x: 'Sep 18', y: 110 },
    { x: 'Sep 19', y: 100 },
    { x: 'Sep 20', y: 90 },
    { x: 'Sep 21', y: 40 },
    { x: 'Sep 22', y: 30 },
    { x: 'Sep 23', y: 10 },
    { x: 'Sep 24', y: 20 },
    { x: 'Sep 26', y: 30 },
    { x: 'Sep 27', y: 28 },
    { x: 'Sep 28', y: 26 },
    { x: 'Sep 29', y: 20 },
    { x: 'Sep 30', y: 10 },
    { x: 'Oct 1', y: 30 },
    { x: 'Oct 2', y: 40 },
    { x: 'Oct 3', y: 80 },
    { x: 'Oct 4', y: 90 },
    { x: 'Oct 5', y: 40 },
    { x: 'Oct 6', y: 50 },
    { x: 'Oct 7', y: 30 },
    { x: 'Oct 8', y: 60 },
    { x: 'Oct 9', y: 20 },
    { x: 'Oct 10', y: 10 },
  ]

  return (
    <Card className="w-full">
      <Chart type="area" data={sampleData} />
    </Card>
  )
}

export const LineChart = () => {
  const sampleData = [
    { x: 'January', y: 90 },
    { x: 'February', y: 100 },
    { x: 'March', y: 40 },
    { x: 'April', y: 60 },
    { x: 'May', y: 180 },
    { x: 'June', y: 100 },
    { x: 'July', y: 50 },
    { x: 'August', y: 70 },
    { x: 'September', y: 80 },
    { x: 'October', y: 90 },
    { x: 'November', y: 0 },
    { x: 'December', y: 100 },
  ]

  return (
    <Card className="w-full">
      <Chart type="line" data={sampleData} />
    </Card>
  )
}

export const CurvedLineChart = () => {
  const sampleData = [
    { x: 'January', y: 90 },
    { x: 'February', y: 100 },
    { x: 'March', y: 40 },
    { x: 'April', y: 60 },
    { x: 'May', y: 180 },
    { x: 'June', y: 100 },
    { x: 'July', y: 50 },
    { x: 'August', y: 70 },
    { x: 'September', y: 80 },
    { x: 'October', y: 90 },
    { x: 'November', y: 140 },
    { x: 'December', y: 100 },
  ]

  return (
    <Card className="w-full">
      <Chart type="curved-line" data={sampleData} />
    </Card>
  )
}
