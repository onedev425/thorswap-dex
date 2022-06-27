import {
  BCHChain,
  BNBChain,
  BTCChain,
  DOGEChain,
  ETHChain,
  LTCChain,
  SupportedChain,
  THORChain,
  THORNameDetails,
} from '@thorswap-lib/multichain-sdk'

import {
  Box,
  DropdownMenu,
  Icon,
  IconName,
  Typography,
} from 'components/Atomic'
import { DropdownMenuItem } from 'components/Atomic/Dropdown/types'

import { IS_STAGENET } from 'settings/config'

// @ts-expect-error Remove after Terra purge
export const thornameChainIcons: Record<SupportedChain, IconName> = {
  [THORChain]: 'thor',
  [BTCChain]: 'bitcoin',
  [BNBChain]: 'bnb',
  [ETHChain]: 'eth',
  [BCHChain]: 'bch',
  [DOGEChain]: 'doge',
  [LTCChain]: 'ltc',
}

if (IS_STAGENET) {
  thornameChainIcons.GAIA = 'gaia'
}

const CHAIN_ITEMS: DropdownMenuItem[] = Object.entries(thornameChainIcons).map(
  ([chain, icon]) => ({
    value: chain,
    Component: (
      <Box alignCenter className="gap-x-2">
        <Icon name={icon} />
        <Typography>{chain === 'GAIA' ? 'ATOM' : chain}</Typography>
      </Box>
    ),
  }),
)

type Props = {
  details: THORNameDetails | null
  chain: SupportedChain
  onChange: (chain: string) => void
}

export const ChainDropdown = ({ chain, onChange }: Props) => {
  return (
    <DropdownMenu
      buttonClassName="w-[95px] !py-2"
      menuItems={CHAIN_ITEMS}
      onChange={onChange}
      value={chain}
      openComponent={
        <Box alignCenter className="gap-x-2">
          <Icon name={thornameChainIcons[chain]} />
          <Typography>{chain === 'GAIA' ? 'ATOM' : chain}</Typography>
        </Box>
      }
    />
  )
}
