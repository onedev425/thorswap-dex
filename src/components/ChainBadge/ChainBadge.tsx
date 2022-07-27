import { Asset } from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'
import classNames from 'classnames'

import { Box, Typography } from 'components/Atomic'

type Props = {
  asset: Asset
  size?: 'sm' | 'md' | 'lg'
}

const colorMapping: Record<SupportedChain, string> = {
  BTC: 'bg-chain-btc',
  ETH: 'bg-chain-eth',
  AVAX: 'bg-chain-eth',
  BCH: 'bg-chain-bch',
  BNB: 'bg-chain-bnb',
  THOR: 'bg-chain-thor',
  DOGE: 'bg-chain-doge',
  LTC: 'bg-chain-ltc',
  SOL: 'bg-chain-sol',
  GAIA: 'bg-chain-cos',
}

export const ChainBadge = ({ asset }: Props) => {
  return (
    <Box
      className={classNames(
        'px-2 rounded-full',
        colorMapping[asset.chain as SupportedChain],
      )}
    >
      <Typography variant="caption">{asset.type}</Typography>
    </Box>
  )
}
