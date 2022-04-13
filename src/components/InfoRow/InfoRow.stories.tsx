import { ComponentMeta } from '@storybook/react'

import { Icon, Typography } from 'components/Atomic'

import { InfoRow } from './InfoRow'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/InfoRow',
  component: InfoRow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof InfoRow>

export const InformationSingle = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <InfoRow label="Slip" value="0%" />
    </div>
  )
}

export const InformationJSXValue = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <InfoRow
        label="Total Fee"
        value={<Typography color="secondary">Passed from parent</Typography>}
      />
    </div>
  )
}

export const InformationJSXValueNoBorder = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <InfoRow
        label="Total Fee"
        value={<Typography color="secondary">Passed from parent</Typography>}
        showBorder={false}
      />
    </div>
  )
}

export const InformationCustomIconValue = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <InfoRow
        label="Total Fee"
        value={
          <div className="grid grid-cols-12 items-center ml-6">
            <div className="col-span-11">
              <Typography
                className="text-ellipsis overflow-hidden whitespace-nowrap"
                color="red"
              >
                Long sentence passed from parent to test compact view
              </Typography>
            </div>
            <div className="col-span-1 ">
              <Icon className="relative top-1 " color="blue" name="ethereum" />
            </div>
          </div>
        }
      />
    </div>
  )
}

export const InformationMultiple = () => {
  return (
    <div className="flex flex-col flex-1 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <InfoRow label="Slip" value="0%" />
      <InfoRow label="Pool share estimated" value="0%" />
      <InfoRow label="ETH Fee" value="0%" />
      <InfoRow label="Rune Fee" value="0%" />
      <InfoRow label="Total Fee" value="0%" showBorder={false} />
    </div>
  )
}
