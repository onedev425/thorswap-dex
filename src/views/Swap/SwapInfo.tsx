import { memo } from 'react'

import { AssetInputType } from 'components/AssetInput/types'
import { Box, Collapse, Icon, Typography } from 'components/Atomic'
import { Information } from 'components/Information'

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
        className="!py-2 self-stretch mt-5 bg-light-gray-light dark:bg-dark-gray-light !rounded-2xl flex-col"
        shadow={false}
        title={
          <div className="flex flex-row gap-x-2">
            <Icon name="info" size={16} color="secondary" />

            <Typography variant="caption" color="primary" fontWeight="normal">
              {`1 ${secondAsset.asset.symbol} = ${
                parseFloat(firstAsset.value) / parseFloat(secondAsset.value)
              } ${firstAsset.asset.symbol}`}
            </Typography>

            <Typography variant="caption" color="secondary" fontWeight="normal">
              {`($ ${secondAsset.value})`}
            </Typography>
          </div>
        }
      >
        <Box className="w-full space-y-1" col>
          <Information
            showBorder={false}
            label="Expected Output"
            value={`${secondAsset.balance} ${secondAsset.asset.symbol}`}
          />

          <Information
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

          <Information
            showBorder={false}
            label={`Minimum receiver after slippage (${slippage.toFixed(2)}%)`}
            value={`${
              parseFloat(secondAsset?.balance || '0') * (1 - slippage / 100)
            } ${secondAsset.asset.symbol}`}
          />
        </Box>
      </Collapse>
    )
  },
)
