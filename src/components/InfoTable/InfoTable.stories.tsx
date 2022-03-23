import { ComponentMeta } from '@storybook/react'
import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Icon, Typography } from 'components/Atomic'

import { InfoTable } from './InfoTable'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/InfoTable',
  component: InfoTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof InfoTable>

const items = [
  {
    label: 'Slip',
    value: <Typography color="red">5%</Typography>,
  },
  {
    label: 'Pool share estimated',
    value: (
      <Box className="gap-2" center>
        <Typography>13%</Typography>
        <Icon name="info" />
      </Box>
    ),
  },
  {
    label: 'ETH Fee',
    value: (
      <Box className="gap-2" center>
        <Typography variant="caption">0.01 ETH</Typography>
        <AssetIcon asset={Asset.ETH()} size={24} />
      </Box>
    ),
  },
  {
    label: 'Rune Fee',
    value: (
      <Box className="gap-2" center>
        <Typography variant="caption">0.2 RUNE</Typography>
        <AssetIcon asset={Asset.RUNE()} size={24} />
      </Box>
    ),
  },
  { label: 'Total Fee', value: '0%' },
]

export const SizeSm = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <InfoTable items={items} size="sm" />
    </div>
  )
}

export const SizeMd = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <InfoTable items={items} size="md" />
    </div>
  )
}

export const SizeLg = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <InfoTable items={items} size="lg" />
    </div>
  )
}
