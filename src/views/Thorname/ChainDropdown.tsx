import { THORNameDetails } from '@thorswap-lib/multichain-sdk'
import { Chain, SupportedChain } from '@thorswap-lib/types'

import {
  Box,
  DropdownMenu,
  Icon,
  IconName,
  Typography,
} from 'components/Atomic'
import { DropdownMenuItem } from 'components/Atomic/Dropdown/types'

import { chainName } from 'helpers/chainName'

export const thornameChainIcons: Record<SupportedChain, IconName> = {
  [Chain.THORChain]: 'thor',
  [Chain.Bitcoin]: 'bitcoin',
  [Chain.Binance]: 'bnb',
  [Chain.Ethereum]: 'eth',
  [Chain.Avalanche]: 'avax',
  [Chain.BitcoinCash]: 'bch',
  [Chain.Doge]: 'doge',
  [Chain.Litecoin]: 'ltc',
  [Chain.Cosmos]: 'gaia',
  [Chain.Solana]: 'sol',
}

const CHAIN_ITEMS: DropdownMenuItem[] = Object.entries(thornameChainIcons).map(
  ([chain, icon]) => ({
    value: chain,
    Component: (
      <Box alignCenter className="gap-x-2">
        <Icon name={icon} />
        <Typography>{chainName(chain)}</Typography>
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
          <Typography>{chainName(chain)}</Typography>
        </Box>
      }
    />
  )
}
