import { memo } from 'react'

import { Price } from '@thorswap-lib/multichain-sdk'

import { AssetInputType } from 'components/AssetInput/types'
import { Box, Collapse, Icon, Typography } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'

type Props = {
  price?: Price
  inputAsset: AssetInputType
  outputAsset: AssetInputType
  minReceive: string
  slippage: string
  isValidSlip?: boolean
  networkFee: string
}

export const SwapInfo = memo(
  ({
    price,
    inputAsset,
    outputAsset,
    minReceive,
    slippage,
    isValidSlip = true,
    networkFee,
  }: Props) => {
    return (
      <Collapse
        className="!py-2 self-stretch mt-5 !bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl flex-col"
        shadow={false}
        title={
          <Box className="gap-x-2">
            <Icon name="infoCircle" size={16} color="secondary" />

            <Typography variant="caption" color="primary" fontWeight="normal">
              {`1 ${inputAsset.asset.ticker} = ${
                price?.toFixedInverted(6) ?? 'N/A'
              } ${outputAsset.asset.ticker}`}
            </Typography>

            <Typography variant="caption" color="secondary" fontWeight="normal">
              {`(${inputAsset.usdPrice?.toCurrencyFormat(2)})`}
            </Typography>
          </Box>
        }
      >
        <Box className="w-full space-y-1" col>
          <InfoRow
            showBorder={false}
            label="Expected Output"
            value={`${outputAsset?.value?.toSignificant(
              6,
            )} ${outputAsset.asset.name.toUpperCase()}`}
          />

          <InfoRow
            label="Price Impact"
            value={
              <Typography
                variant="caption-xs"
                fontWeight="semibold"
                color={isValidSlip ? 'green' : 'red'}
              >
                {slippage}
              </Typography>
            }
          />

          <InfoRow
            label={`Minimum receiver after slippage (${slippage})`}
            value={minReceive}
          />

          <InfoRow showBorder={false} label="Network Fee" value={networkFee} />
        </Box>
      </Collapse>
    )
  },
)
