import { BrowserRouter } from 'react-router-dom'

import { ComponentMeta } from '@storybook/react'

import { Icon } from 'components/Atomic'

import { ViewHeader } from './ViewHeader'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ViewHeader',
  component: ViewHeader,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ViewHeader>

export const Default = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col flex-wrap gap-3 p-4 bg-gray">
        <ViewHeader title="Title only" />
        <ViewHeader withBack title="Title with back" />
        <ViewHeader
          withBack
          title="Title with back and right actions"
          actionsComponent={
            <>
              <Icon color="secondary" name="chart" />
              <Icon color="secondary" name="cog" className="ml-6" />
            </>
          }
        />
      </div>
    </BrowserRouter>
  )
}
