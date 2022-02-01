import { ComponentMeta } from '@storybook/react'

import { Button } from 'components/Button'

import { Tooltip, TooltipPortal } from './Tooltip'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Tooltip>

export const All = () => {
  return (
    <div className="flex bg-light-bg-primary dark:bg-dark-bg-primary p-10">
      <div className="p-5">
        <Tooltip place="top" content="Tooltip" iconName="search" />
      </div>
      <div className="p-5">
        <Tooltip place="left" content="Tooltip" iconName="discord" />
      </div>
      <div className="p-5">
        <Tooltip place="right" content="Tooltip" iconName="telegram" />
      </div>
      <div className="p-5">
        <Tooltip place="bottom" content="Tooltip" iconName="twitter" />
      </div>

      <div className="p-5">
        <Tooltip place="bottom" content="Tooltip for button">
          <Button>Button</Button>
        </Tooltip>
      </div>

      <TooltipPortal />
    </div>
  )
}
