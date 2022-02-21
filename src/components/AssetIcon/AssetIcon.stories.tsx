import { ComponentMeta } from '@storybook/react'

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
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <div className="flex space-x-2">
        <AssetIcon name="BNB" bgColor="yellow" size={ICON_MD} />
        <AssetIcon name="BTC" bgColor="orange" size={ICON_MD} />
        <AssetIcon name="ETH" bgColor="purple" size={ICON_MD} />
        <AssetIcon name="RUNE" bgColor="green" size={ICON_MD} />
        <AssetIcon name="USDT" bgColor="blue" size={ICON_MD} />
      </div>

      <div className="flex space-x-2">
        <AssetIcon name="BNB" bgColor="yellow" size={ICON_LG} />
        <AssetIcon name="BTC" bgColor="orange" size={ICON_LG} />
        <AssetIcon name="ETH" bgColor="purple" size={ICON_LG} />
        <AssetIcon name="RUNE" bgColor="green" size={ICON_LG} />
        <AssetIcon name="USDT" bgColor="blue" size={ICON_LG} />
      </div>

      <Typography variant="h5">With secondary icon:</Typography>
      <div className="flex space-x-2 gap-3">
        <AssetIcon
          name="ETH"
          secondaryIconName="BNB"
          bgColor="yellow"
          size={ICON_LG}
        />
        <AssetIcon
          name="BTC"
          secondaryIconName="ETH"
          secondaryIconPlacement="tl"
          bgColor="purple"
          size={ICON_LG}
        />
        <AssetIcon
          name="BTC"
          secondaryIconName="ETH"
          secondaryIconPlacement="tr"
          bgColor="purple"
          size={ICON_LG}
        />
        <AssetIcon
          name="ETH"
          secondaryIconName="BNB"
          secondaryIconPlacement="br"
          bgColor="yellow"
          size={ICON_LG}
        />
      </div>
    </div>
  )
}

export const FallbackIcon = () => {
  return (
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <div className="flex space-x-2">
        <AssetIcon
          name={'OMG' as Inexpressible}
          bgColor="yellow"
          size={ICON_MD}
        />
        <AssetIcon
          name={'BTCC' as Inexpressible}
          bgColor="orange"
          size={ICON_MD}
        />
        <AssetIcon
          name={'MOON' as Inexpressible}
          bgColor="purple"
          size={ICON_MD}
        />
      </div>
    </div>
  )
}

export const AssetLPIcon = () => {
  return (
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4 gap-5">
      <Typography variant="h4">Lp icons:</Typography>
      <div className="flex">
        <AssetLpIcon
          asset1Name="RUNE"
          asset2Name="USDT"
          asset1BgColor="green"
          asset2BgColor="blue"
          size={ICON_MD}
        />
      </div>

      <div className="flex">
        <AssetLpIcon
          asset1Name="BTC"
          asset2Name="ETH"
          asset1BgColor="orange"
          asset2BgColor="purple"
          size={ICON_LG}
        />
      </div>

      <Typography variant="h4">Lp icons inlined:</Typography>

      <div className="flex">
        <AssetLpIcon
          asset1Name="BNB"
          asset2Name="USDT"
          asset1BgColor="yellow"
          asset2BgColor="blue"
          size={ICON_MD}
          inline
        />
      </div>

      <div className="flex">
        <AssetLpIcon
          asset1Name="BTC"
          asset2Name="RUNE"
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
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <AssetIcon {...args} />
    </div>
  )
}

Random.args = {
  name: 'BTC',
  bgColor: 'orange',
}
