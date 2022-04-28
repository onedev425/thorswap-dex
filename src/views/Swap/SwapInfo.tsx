import { memo, MouseEventHandler, useCallback, useMemo, useState } from 'react'

import { Amount, Price } from '@thorswap-lib/multichain-sdk'

import { AssetInputType } from 'components/AssetInput/types'
import { Box, Button, Collapse, Icon, Typography } from 'components/Atomic'
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
  isAffiliated?: boolean
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
    isAffiliated,
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
        const amount = Amount.fromNormalAmount(price?.raw())
        return `1 ${outputAsset.asset.ticker} = ${
          amount.toSignificant(6) || '-'
        } ${inputAsset.asset.ticker}`
      }

      const amount = Amount.fromNormalAmount(price?.invert())
      return `1 ${inputAsset.asset.ticker} = ${
        amount.toSignificant(6) || '-'
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
        titleClassName="pr-1"
        shadow={false}
        title={
          <Box className="gap-1 flex-1" justify="between">
            <Button
              className="!p-1 !h-auto"
              tooltip={t('views.swap.swapAssets')}
              type="outline"
              startIcon={<Icon name="switch" size={16} />}
              onClick={toggle}
            />
            <Box className="gap-x-1 flex-wrap flex-1 pl-1" alignCenter>
              <Box className="gap-1.5" center>
                <Typography
                  variant="caption"
                  color="primary"
                  fontWeight="normal"
                >
                  {rateDesc}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                color="secondary"
                fontWeight="normal"
              >
                {priceDesc}
              </Typography>
            </Box>
            <Box className="pr-1">
              <Button
                className="h-[30px] px-2"
                startIcon={<Icon name="fees" size={18} color="secondary" />}
                variant="tint"
                tooltip={t('views.swap.totalFee')}
              >
                <Typography>{totalFee}</Typography>
              </Button>
            </Box>
          </Box>
        }
      >
        <Box className="w-full" col>
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
                    variant="caption"
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
                value={
                  isAffiliated ? (
                    affiliateFee
                  ) : (
                    <Box center className="gap-1">
                      <Typography className="line-through" variant="caption">
                        {affiliateFee !== '$0.00' && affiliateFee}
                      </Typography>
                      <Typography
                        color="green"
                        variant="body"
                        fontWeight="bold"
                      >
                        FREE
                      </Typography>
                    </Box>
                  )
                }
              />
            }
          />
        </Box>
      </Collapse>
    )
  },
)
