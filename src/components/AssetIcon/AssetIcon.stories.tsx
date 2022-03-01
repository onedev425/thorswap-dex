import { ComponentMeta } from '@storybook/react'
import { Asset } from '@thorswap-lib/multichain-sdk'

import { Typography } from 'components/Atomic'

import { AssetIcon } from './AssetIcon'
import { AssetLpIcon } from './AssetLpIcon'
import { AssetIconProps } from './types'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/AssetIcon',
  component: AssetIcon,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof AssetIcon>

const ICON_MD = 40
const ICON_LG = 60

export const All = () => {
  return (
    <div className="flex flex-col p-4 space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="flex space-x-2">
        <AssetIcon asset={Asset.BNB()} bgColor="yellow" size={ICON_MD} />
        <AssetIcon asset={Asset.BTC()} bgColor="orange" size={ICON_MD} />
        <AssetIcon asset={Asset.ETH()} bgColor="purple" size={ICON_MD} />
        <AssetIcon asset={Asset.BCH()} bgColor="green" size={ICON_MD} />
        <AssetIcon asset={Asset.RUNE()} bgColor="blue" size={ICON_MD} />
      </div>

      <div className="flex space-x-2">
        <AssetIcon asset={Asset.BNB()} bgColor="yellow" size={ICON_LG} />
        <AssetIcon asset={Asset.BTC()} bgColor="orange" size={ICON_LG} />
        <AssetIcon asset={Asset.ETH()} bgColor="purple" size={ICON_LG} />
        <AssetIcon asset={Asset.BCH()} bgColor="green" size={ICON_LG} />
        <AssetIcon asset={Asset.RUNE()} bgColor="blue" size={ICON_LG} />
      </div>

      <Typography variant="h5">With secondary icon:</Typography>
      <div className="flex gap-3 space-x-2">
        <AssetIcon
          asset={Asset.ETH()}
          chainAsset={Asset.BNB()}
          bgColor="yellow"
          size={ICON_LG}
        />
        <AssetIcon
          asset={Asset.BTC()}
          chainAsset={Asset.ETH()}
          secondaryIconPlacement="tl"
          bgColor="purple"
          size={ICON_LG}
        />
        <AssetIcon
          asset={Asset.BTC()}
          chainAsset={Asset.ETH()}
          secondaryIconPlacement="tr"
          bgColor="purple"
          size={ICON_LG}
        />
        <AssetIcon
          asset={Asset.ETH()}
          chainAsset={Asset.BNB()}
          secondaryIconPlacement="br"
          bgColor="yellow"
          size={ICON_LG}
        />
      </div>
    </div>
  )
}

export const AssetLPIcon = () => {
  return (
    <div className="flex flex-col gap-5 p-4 space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary">
      <Typography variant="h4">Lp icons:</Typography>
      <div className="flex">
        <AssetLpIcon
          asset1={Asset.RUNE()}
          asset2={Asset.LUNA()}
          asset1BgColor="green"
          asset2BgColor="blue"
          size={ICON_MD}
        />
      </div>

      <div className="flex">
        <AssetLpIcon
          asset1={Asset.RUNE()}
          asset2={Asset.BTC()}
          asset1BgColor="orange"
          asset2BgColor="purple"
          size={ICON_LG}
        />
      </div>

      <Typography variant="h4">Lp icons inlined:</Typography>

      <div className="flex">
        <AssetLpIcon
          asset1={Asset.RUNE()}
          asset2={Asset.BNB()}
          asset1BgColor="yellow"
          asset2BgColor="blue"
          size={ICON_MD}
          inline
        />
      </div>

      <div className="flex">
        <AssetLpIcon
          asset1={Asset.RUNE()}
          asset2={Asset.BCH()}
          asset1BgColor="orange"
          asset2BgColor="green"
          size={ICON_LG}
          inline
        />
      </div>
    </div>
  )
}

export const Random = (args: AssetIconProps) => {
  return (
    <div className="flex flex-col p-4 space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary">
      <AssetIcon {...args} />
    </div>
  )
}

Random.args = {
  name: 'BTC',
  bgColor: 'orange',
}
