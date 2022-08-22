import { MouseEventHandler, useCallback, useMemo, useState } from 'react'

import {
  hasConnectedWallet,
  Percent,
  Price,
} from '@thorswap-lib/multichain-sdk'
import { FeeOption } from '@thorswap-lib/types'
import capitalize from 'lodash/capitalize'

import { gasFeeMultiplier } from 'views/Swap/hooks/useSwap'

import {
  Box,
  Button,
  Collapse,
  Icon,
  Select,
  Typography,
} from 'components/Atomic'
import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoTable } from 'components/InfoTable'
import { InfoWithTooltip } from 'components/InfoWithTooltip'

import { useApp } from 'store/app/hooks'
import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'

import { useFormatPrice } from 'helpers/formatPrice'

type Props = {
  expectedOutput?: string
  affiliateFee: number
  networkFee: number
  inputUSDPrice: Price
  isLoading: boolean
  gasPrice?: number
  minReceive: string
  minReceiveSlippage: Percent
  outputUSDPrice: Price
  setFeeModalOpened: (isOpened: boolean) => void
}

const feeOptions = [FeeOption.Average, FeeOption.Fast, FeeOption.Fastest]

export const SwapInfo = ({
  expectedOutput,
  affiliateFee,
  networkFee,
  inputUSDPrice,
  isLoading,
  gasPrice,
  minReceive,
  minReceiveSlippage,
  outputUSDPrice,
  setFeeModalOpened,
}: Props) => {
  const { feeOptionType, setFeeOptionType } = useApp()
  const { keystore, wallet } = useWallet()
  const formatPrice = useFormatPrice()
  const [reverted, setReverted] = useState(false)

  const toggle: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    setReverted((r) => !r)
    e.stopPropagation()
  }, [])

  const [first, second] = reverted
    ? [outputUSDPrice, inputUSDPrice]
    : [inputUSDPrice, outputUSDPrice]

  const rateDesc = useMemo(() => {
    const rate = first.unitPrice.dividedBy(second.unitPrice)
    const decimals = rate.gte(1000) ? 4 : rate.gte(1) ? 5 : 8

    return rate.gt(0)
      ? `1 ${first.baseAsset.ticker} = ${rate.toFixed(decimals)} ${
          second.baseAsset.ticker
        }`
      : '-'
  }, [
    first.baseAsset.ticker,
    first.unitPrice,
    second.baseAsset.ticker,
    second.unitPrice,
  ])

  const openFeeModal = useCallback(() => {
    if (networkFee + affiliateFee <= 0) return

    setFeeModalOpened(true)
  }, [networkFee, affiliateFee, setFeeModalOpened])

  const ratePrice = `($${formatPrice(first.unitPrice.toFixed(2))})`

  const feeOptionLabels = useMemo(
    () =>
      feeOptions.map(
        (feeOption) =>
          `${t(`common.fee${capitalize(feeOption)}`)}\n(${formatPrice(
            (gasPrice || 0) * gasFeeMultiplier[feeOption],
          )})`,
      ),
    [formatPrice, gasPrice],
  )

  const activeFeeIndex =
    feeOptionLabels.findIndex((o) =>
      o.includes(t(`common.fee${capitalize(feeOptionType)}`)),
    ) || 0

  const rows = useMemo(
    () =>
      [
        {
          label: t('views.wallet.expectedOutput'),
          value: (
            <InfoWithTooltip
              tooltip={t('views.wallet.expectedOutputTooltip')}
              value={expectedOutput}
            />
          ),
        },
        {
          label: t('views.swap.minReceivedAfterSlip', {
            slippage: minReceiveSlippage.gte(0)
              ? minReceiveSlippage.toFixed(2)
              : '-',
          }),
          value: (
            <InfoWithTooltip
              value={minReceive}
              tooltip={t('views.wallet.minReceivedTooltip')}
            />
          ),
        },
        hasConnectedWallet(wallet) && keystore
          ? {
              key: 'keystoreFee',
              label: t('common.transactionFee'),
              value: (
                <Select
                  onChange={(index) => setFeeOptionType(feeOptions[index])}
                  activeIndex={activeFeeIndex}
                  size="sm"
                  options={feeOptionLabels}
                />
              ),
            }
          : null,
        {
          label: (
            <Box className="gap-2 group" center>
              <Typography
                fontWeight="medium"
                color="secondary"
                variant="caption"
              >
                Network Fee
              </Typography>
              <Box center>
                <Typography
                  className="italic underline"
                  fontWeight="normal"
                  color="secondary"
                  variant="caption-xs"
                >
                  details
                </Typography>

                <Icon className="mx-1" name="eye" size={16} color="secondary" />
              </Box>
            </Box>
          ),
          onClick: openFeeModal,
          value: (
            <InfoWithTooltip
              tooltip={t('views.swap.networkFeeTooltip')}
              value={
                <Box center>
                  <Typography variant="caption">
                    {formatPrice(networkFee)}
                  </Typography>
                </Box>
              }
            />
          ),
        },
        {
          label: t('views.swap.exchangeFee'),
          value: (
            <InfoWithTooltip
              tooltip={t('views.swap.affiliateFee')}
              value={
                <Box row center className="gap-1">
                  {affiliateFee ? (
                    <Typography variant="caption">
                      {formatPrice(affiliateFee)}
                    </Typography>
                  ) : (
                    <Typography
                      color="green"
                      variant="caption"
                      fontWeight="bold"
                    >
                      FREE
                    </Typography>
                  )}
                </Box>
              }
            />
          ),
        },
      ].filter(Boolean) as InfoRowConfig[],
    [
      activeFeeIndex,
      affiliateFee,
      expectedOutput,
      feeOptionLabels,
      formatPrice,
      keystore,
      minReceive,
      minReceiveSlippage,
      networkFee,
      openFeeModal,
      setFeeOptionType,
      wallet,
    ],
  )

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
          {isLoading ? (
            <Box flex={1} className="px-2" justify="start" alignCenter>
              <Icon name="loader" spin size={14} />
            </Box>
          ) : (
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
                {ratePrice}
              </Typography>
            </Box>
          )}

          <Box className="pr-1">
            <Button
              className="h-[30px] px-2"
              startIcon={<Icon name="fees" size={18} color="secondary" />}
              variant="tint"
              tooltip={t('views.swap.totalFeeTooltip')}
            >
              <Typography>{formatPrice(networkFee)}</Typography>
            </Button>
          </Box>
        </Box>
      }
    >
      <Box className="w-full" col>
        <InfoTable items={rows} />
      </Box>
    </Collapse>
  )
}
