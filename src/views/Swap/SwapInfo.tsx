import { memo, MouseEventHandler, useCallback, useMemo, useState } from 'react'

import { Price } from '@thorswap-lib/multichain-sdk'

import { AssetInputType } from 'components/AssetInput/types'
import {
  Box,
  Button,
  Collapse,
  Icon,
  Tooltip,
  Typography,
} from 'components/Atomic'
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
  affiliateFee?: string
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
    affiliateFee,
  }: Props) => {
    const [reverted, setReverted] = useState(false)

    const toggle: MouseEventHandler<HTMLButtonElement> = useCallback(
      (e) => {
        if (price && inputAsset && outputAsset) {
          setReverted(!reverted)
        }
        e.stopPropagation()
      },
      [inputAsset, outputAsset, price, reverted],
    )

    const rateDesc = useMemo(() => {
      if (reverted) {
        return `1 ${outputAsset.asset.ticker} = ${
          price?.toFixedRaw(6) || '-'
        } ${inputAsset.asset.ticker}`
      }
      return `1 ${inputAsset.asset.ticker} = ${
        price?.toFixedInverted(6) || '-'
      } ${outputAsset.asset.ticker}`
    }, [reverted, price, inputAsset, outputAsset])

    const priceDesc = useMemo(() => {
      if (reverted) {
        return `(${outputAsset.usdPrice?.toCurrencyFormat(2) || '-'})`
      }

      return `(${inputAsset.usdPrice?.toCurrencyFormat(2) || '-'})`
    }, [inputAsset.usdPrice, outputAsset.usdPrice, reverted])

    return (
      <Collapse
        className="self-stretch mt-5 !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl flex-col"
        shadow={false}
        title={
          <Box className="gap-x-2" minHeight={30} alignCenter>
            <Button
              className="!p-1 !h-auto"
              tooltip={t('views.swap.swapAssets')}
              type="outline"
              startIcon={<Icon name="switch" size={16} />}
              onClick={toggle}
            />

            <Typography variant="caption" color="primary" fontWeight="normal">
              {rateDesc}
            </Typography>
            <Typography variant="caption" color="secondary" fontWeight="normal">
              {priceDesc}
            </Typography>
            <Tooltip content={t('views.wallet.priceRate')}>
              <Icon name="infoCircle" size={16} color="secondary" />
            </Tooltip>
          </Box>
        }
      >
        <Box className="w-full space-y-1" col>
          <InfoRow
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
            label="Network Fee"
            value={
              <InfoWithTooltip
                tooltip={t('views.wallet.networkFeeTooltip')}
                value={networkFee}
              />
            }
          />
          <InfoRow
            showBorder={false}
            label={t('views.swap.exchangeFee')}
            value={
              <InfoWithTooltip
                tooltip={t('views.swap.affiliateFee')}
                value={affiliateFee}
              />
            }
          />
        </Box>
      </Collapse>
    )
  },
)
