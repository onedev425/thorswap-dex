import { memo } from 'react'

import { AssetInputType } from 'components/AssetInput/types'
import { Box, Collapse, Icon, Typography } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'

type Props = {
  firstAsset: AssetInputType
  secondAsset: AssetInputType
  priceImpact: number
  slippage: number
}

export const SwapInfo = memo(
  ({ priceImpact, slippage, secondAsset, firstAsset }: Props) => {
    return (
      <Collapse
        className="!py-2 self-stretch mt-5 !bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl flex-col"
        shadow={false}
        title={
          <div className="flex flex-row gap-x-2">
            <Icon name="info" size={16} color="secondary" />

            <Typography variant="caption" color="primary" fontWeight="normal">
              {`1 ${secondAsset.asset.symbol} = ${
                parseFloat(firstAsset.price) / parseFloat(secondAsset.price)
              } ${firstAsset.asset.symbol}`}
            </Typography>

            <Typography variant="caption" color="secondary" fontWeight="normal">
              {`($ ${secondAsset.price})`}
            </Typography>
          </div>
        }
      >
        <Box className="w-full space-y-1" col>
          <InfoRow
            showBorder={false}
            label="Expected Output"
            value={`${secondAsset.value} ${secondAsset.asset.symbol}`}
          />

          <InfoRow
            label="Price Impact"
            value={
              <Typography
                variant="caption-xs"
                fontWeight="semibold"
                color={priceImpact >= 0 ? 'green' : 'red'}
              >
                {`${priceImpact}%`}
              </Typography>
            }
          />

          <InfoRow
            showBorder={false}
            label={`Minimum receiver after slippage (${slippage.toFixed(2)}%)`}
            value={`${
              parseFloat(secondAsset?.value || '0') * (1 - slippage / 100)
            } ${secondAsset.asset.symbol}`}
          />
        </Box>
      </Collapse>
    )
  },
)
