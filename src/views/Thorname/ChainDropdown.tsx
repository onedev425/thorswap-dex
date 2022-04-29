import {
  BCHChain,
  BNBChain,
  BTCChain,
  DOGEChain,
  ETHChain,
  LTCChain,
  SupportedChain,
  TERRAChain,
  THORChain,
} from '@thorswap-lib/multichain-sdk'

import {
  Box,
  DropdownMenu,
  Icon,
  IconName,
  Typography,
} from 'components/Atomic'
import { DropdownMenuItem } from 'components/Atomic/Dropdown/types'

const chainIcons: Record<SupportedChain, IconName> = {
  [THORChain]: 'thor',
  [BTCChain]: 'bitcoin',
  [BNBChain]: 'bnb',
  [TERRAChain]: 'terra',
  [ETHChain]: 'eth',
  [BCHChain]: 'bch',
  [DOGEChain]: 'doge',
  [LTCChain]: 'ltc',
}

const CHAINS: DropdownMenuItem[] = Object.entries(chainIcons).map(
  ([chain, icon]) => ({
    Component: (
      <Box alignCenter className="gap-x-2">
        <Icon name={icon} />
        <Typography>{chain}</Typography>
      </Box>
    ),
    value: chain,
  }),
)

type Props = {
  chain: SupportedChain
  onChange: (chain: string) => void
}

export const ChainDropdown = ({ chain, onChange }: Props) => {
  return (
    <DropdownMenu
      buttonClassName="w-[110px] !py-6"
      menuItems={CHAINS}
      onChange={onChange}
      value={chain}
      openComponent={
        <Box alignCenter className="gap-x-2">
          <Icon name={chainIcons[chain]} />
          <Typography>{chain}</Typography>
        </Box>
      }
    />
  )
}
