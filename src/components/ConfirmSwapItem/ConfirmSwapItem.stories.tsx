import { ComponentMeta } from '@storybook/react'
import { shortenAddress } from 'utils/shortenAddress'

import { DashedDivider } from 'views/Swap/DashedDivider'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Icon, Typography } from 'components/Atomic'
import { ConfirmSwapItem } from 'components/ConfirmSwapItem'

import { swapItem } from './SwapAssetsData'

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
          className="flex items-center justify-between px-3 pb-2 my-2"
        >
          <Typography color="secondary" fontWeight="semibold" variant="body">
            {item.title}
          </Typography>
          <div className="flex items-center justify-between pl-24">
            <Typography fontWeight="semibold" className="mx-2">
              {item.title === 'Recipent Address'
                ? shortenAddress(item.amount)
                : item.amount}
              {item.asset.symbol}
            </Typography>
            {item.asset && <AssetIcon asset={item.asset} />}
            {item.infoIcon && <Icon color="secondary" name={item.infoIcon} />}
          </div>
        </div>
        <DashedDivider />
      </>
    ))
  }
}
