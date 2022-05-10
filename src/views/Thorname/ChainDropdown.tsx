import { useEffect, useMemo } from 'react'

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

export const thornameChainIcons: Record<SupportedChain, IconName> = {
  [THORChain]: 'thor',
  [BTCChain]: 'bitcoin',
  [BNBChain]: 'bnb',
  [TERRAChain]: 'terra',
  [ETHChain]: 'eth',
  [BCHChain]: 'bch',
  [DOGEChain]: 'doge',
  [LTCChain]: 'ltc',
}

const CHAIN_ITEMS: DropdownMenuItem[] = Object.entries(thornameChainIcons).map(
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
  details: THORNameDetails | null
  chain: SupportedChain
  onChange: (chain: string) => void
}

export const ChainDropdown = ({ chain, details, onChange }: Props) => {
  const menuItems = useMemo(() => {
    if (!details) return CHAIN_ITEMS

    const registeredChains = details.entries.map(({ chain }) => chain)
    return CHAIN_ITEMS.filter(({ value }) => !registeredChains.includes(value))
  }, [details])
  const availableChains = useMemo(
    () => menuItems.map(({ value }) => value),
    [menuItems],
  )

  useEffect(() => {
    if (!availableChains.includes(chain)) {
      onChange(availableChains[0])
    }
  }, [availableChains, chain, onChange])

  return (
    <DropdownMenu
      buttonClassName="w-[110px] !py-6"
      menuItems={menuItems}
      onChange={onChange}
      value={chain}
      openComponent={
        <Box alignCenter className="gap-x-2">
          <Icon name={thornameChainIcons[chain]} />
          <Typography>{chain}</Typography>
        </Box>
      }
    />
  )
}
