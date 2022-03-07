import { BrowserRouter } from 'react-router-dom'

import { ComponentMeta } from '@storybook/react'

import { Typography } from 'components/Atomic/Typography/Typography'

import { Tabs as TabsComponent } from './Tabs'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/TabsComponent',
  component: TabsComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TabsComponent>

const tabs = [
  { label: 'Tab 1', panel: <Typography>{'Panel 1'}</Typography> },
  { label: 'Tab 2', panel: <Typography>{'Panel 2'}</Typography> },
  { label: 'Tab 3', panel: <Typography>{'Panel 3'}</Typography> },
]

export const Tabs = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col flex-wrap gap-3 p-4 bg-gray">
        <TabsComponent tabs={tabs} />
      </div>
    </BrowserRouter>
  )
}
