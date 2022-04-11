import { memo } from 'react'

import { Price } from '@thorswap-lib/multichain-sdk'

import { AssetInputType } from 'components/AssetInput/types'
import { Box, Collapse, Icon, Tooltip, Typography } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'
import { InfoWithTooltip } from 'components/InfoWithTooltip'

import { t } from 'services/i18n'

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
        className="self-stretch mt-5 !bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl flex-col"
        shadow={false}
        title={
          <Box className="gap-x-2">
            <Tooltip content={t('views.wallet.priceRate')}>
              <Icon name="infoCircle" size={16} color="secondary" />
            </Tooltip>

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
            label={t('views.wallet.expectedOutput')}
            value={
              <InfoWithTooltip
                tooltip={t('views.wallet.expectedOutputTooltip')}
                value={`${outputAsset?.value?.toSignificant(
                  6,
                )} ${outputAsset.asset.name.toUpperCase()}`}
              />
            }
          />

          <InfoRow
            label={t('views.swap.priceImpact')}
            value={
              <InfoWithTooltip
                tooltip={t('views.wallet.slippageTooltip')}
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
            }
          />

          <InfoRow
            label={t('views.swap.minReceivedAfterSlip', { slippage })}
            value={
              <InfoWithTooltip
                value={minReceive}
                tooltip={t('views.wallet.minReceivedTooltip')}
              />
            }
          />

          <InfoRow
            showBorder={false}
            label="Network Fee"
            value={
              <InfoWithTooltip
                tooltip={t('views.wallet.networkFeeTooltip')}
                value={networkFee}
              />
            }
          />
        </Box>
      </Collapse>
    )
  },
)
