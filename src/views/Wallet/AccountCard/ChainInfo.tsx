import { memo } from 'react'

import { AssetAmount } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Typography } from 'components/Atomic'

import { GeckoData } from 'redux/wallet/types'

import { formatPrice } from 'helpers/formatPrice'

type Props = {
  info: AssetAmount
  geckoData: Record<string, GeckoData>
}

export const ChainInfo = memo(
  ({ geckoData, info: { asset, assetAmount } }: Props) => {
    const {
      current_price: currentPrice = 0,
      price_change_percentage_24h: priceChangePercentage24h = 0,
    } = geckoData[asset.ticker] || {}

    const value = `${assetAmount.toFormat(2)} ($${(
      assetAmount.toNumber() * currentPrice
    ).toFixed(2)})`

    return (
      <Box
        justify="between"
        className="px-3 py-2 border-0 border-b border-solid border-light-border-primary dark:border-dark-border-primary"
      >
        <Box>
          <AssetIcon asset={asset} />
          <Box pl={2} col>
            <Typography>{asset.name}</Typography>
            <Typography
              variant="caption"
              fontWeight="semibold"
              color="secondary"
            >
              {value}
            </Typography>
          </Box>
        </Box>

        <Box col align="end">
          <Typography>{formatPrice(currentPrice)}</Typography>
          <Typography
            variant="caption"
            fontWeight="semibold"
            color={priceChangePercentage24h >= 0 ? 'green' : 'red'}
          >
            {priceChangePercentage24h.toFixed(2)}%
          </Typography>
        </Box>
      </Box>
    )
  },
)
