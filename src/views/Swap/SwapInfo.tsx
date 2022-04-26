import { memo, MouseEventHandler, useCallback, useMemo, useState } from 'react'

import { Price } from '@thorswap-lib/multichain-sdk'

import { AssetInputType } from 'components/AssetInput/types'
import {
  Box,
  Button,
  Card,
  Collapse,
  Icon,
  Tooltip,
  Typography,
} from 'components/Atomic'
import { baseTextHoverClass } from 'components/constants'
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
  totalFee?: string
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
    totalFee,
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
      <Box className="self-stretch" col>
        <Card className="self-stretch align-center !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl !py-2.5">
          <Box className="gap-2 flex-1" alignCenter justify="between">
            <Box className="gap-2" center>
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
              <Typography
                variant="caption"
                color="secondary"
                fontWeight="normal"
              >
                {priceDesc}
              </Typography>
            </Box>

            <Tooltip content={t('views.wallet.priceRate')}>
              <Icon
                className={baseTextHoverClass}
                name="infoCircle"
                size={20}
                color="secondary"
              />
            </Tooltip>
          </Box>
        </Card>

        <Collapse
          className="self-stretch mt-1 !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl flex-col"
          shadow={false}
          title={
            <InfoRow
              className="self-stretch flex-1 pr-2 !min-h-[30px]"
              label={t('views.swap.totalFee')}
              value={totalFee}
              showBorder={false}
            />
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
      </Box>
    )
  },
)
