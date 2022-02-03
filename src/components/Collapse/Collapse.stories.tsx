import { ComponentMeta } from '@storybook/react'

import { Information } from 'components/Information'
import { Typography } from 'components/Typography'

import { Collapse } from './Collapse'
import { CollapseIconTitle } from './CollapseIconTitle'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Collapse',
  component: Collapse,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Collapse>

const InnerData = (
  <>
    <Information
      label="Expected Output"
      value="12117 USDT"
      showBorder={false}
    />
    <Information
      label="Price Impact"
      value={
        <Typography
          className="text-right"
          variant="caption-xs"
          fontWeight="bold"
          color="red"
        >
          -0.1%
        </Typography>
      }
    />
    <Information
      label="Minimum received after slippage (0.50%)"
      showBorder={false}
      value={
        <Typography variant="caption-xs" fontWeight="bold" color="secondary">
          12110 USDT
        </Typography>
      }
    />
  </>
)

export const All = () => {
  return (
    <div className="flex flex-row gap-x-6 bg-light-bg-primary dark:bg-dark-bg-primary p-2">
      <Collapse title="This is a string title">{InnerData}</Collapse>
      <Collapse
        title={
          <CollapseIconTitle
            iconName="infoCircle"
            title="1 USDT = 0.0003795 ETH"
            subTitle="$1.00225"
          />
        }
      >
        {InnerData}
      </Collapse>
    </div>
  )
}

export const StringTitle = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-2 ">
      <Collapse title="This is a string title">{InnerData}</Collapse>
    </div>
  )
}

export const JSXTitle = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-2 ">
      <Collapse
        title={
          <CollapseIconTitle
            iconName="xCircle"
            title="1 USDT = 0.0003795 ETH"
            subTitle="$1.00225"
          />
        }
      >
        {InnerData}
      </Collapse>
    </div>
  )
}
