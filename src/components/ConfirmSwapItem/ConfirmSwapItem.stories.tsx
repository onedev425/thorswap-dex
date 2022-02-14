import { ComponentMeta } from '@storybook/react'
import { shortenAddress } from 'utils/shortenAddress'

import { DashedDivider } from 'views/Swap/DashedDivider'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { ConfirmSwapItem } from 'components/ConfirmSwapItem'
import { AssetDataType } from 'components/ConfirmSwapItem/types'
import { Icon } from 'components/Icon'
import { Typography } from 'components/Typography'

const swapItem = [
  {
    title: 'Send',
    amount: '1',
    assetTicker: 'RUNE',
    icon: 'RUNE',
  },
  {
    title: 'Receive',
    amount: '0.013219',
    assetTicker: 'BTC',
    icon: 'BTC',
  },
  {
    title: 'Recipent Address',
    amount: 'bc234567898765432112345',
  },

  {
    title: 'Slip',
    amount: '0.002%',
    infoIcon: 'info',
  },
  {
    title: 'Min Received',
    amount: '0.0130868',
    assetTicker: 'BTC',
    infoIcon: 'info',
  },
  {
    title: 'Network Fee',
    amount: '0.001125',
    assetTicker: 'BTC',
    infoIcon: 'info',
  },
  {
    title: 'Total Fee',
    amount: '$ 5.00',
    infoIcon: 'info',
  },
  {
    title: 'Estimated Time',
    amount: '<5s',
    infoIcon: 'info',
  },
] as AssetDataType[]

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ConfirmSwapItem',
  component: ConfirmSwapItem,
} as ComponentMeta<typeof ConfirmSwapItem>

export const Default = () => {
  {
    swapItem.map((item) => (
      <>
        <div
          key={item.title}
          className="flex justify-between items-center my-2 pb-2 px-3"
        >
          <Typography color="secondary" fontWeight="semibold" variant="body">
            {item.title}
          </Typography>
          <div className="flex justify-between items-center pl-24">
            <Typography fontWeight="semibold" className="mx-2">
              {item.title === 'Recipent Address'
                ? shortenAddress(item.amount)
                : item.amount}
              {item.assetTicker}
            </Typography>
            {item.icon && <AssetIcon name={item.icon} />}
            {item.infoIcon && <Icon color="secondary" name={item.infoIcon} />}
          </div>
        </div>
        <DashedDivider />
      </>
    ))
  }
}
