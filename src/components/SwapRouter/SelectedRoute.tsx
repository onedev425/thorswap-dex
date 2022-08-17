import React, { memo, useCallback, useMemo, useState } from 'react'

import {
  Amount,
  AmountType,
  Asset,
  Percent,
  QuoteMode,
  QuoteRoute,
} from '@thorswap-lib/multichain-sdk'
import BigNumber from 'bignumber.js'
import classNames from 'classnames'

import { useIsAssetApproved } from 'views/Swap/hooks/useIsAssetApproved'

import { Box, Typography } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
import { HoverIcon } from 'components/HoverIcon'

import { useApp } from 'store/app/hooks'

import { t } from 'services/i18n'

import { useFormatPrice } from 'helpers/formatPrice'

import { ProviderLogos } from './ProviderLogos'
import { RouteGraphModal } from './RouteGraphModal'

type Props = QuoteRoute & {
  outputAssetDecimal: number
  unitPrice: BigNumber
  slippage: Percent
  assetTicker: string
  inputAsset: Asset
  quoteMode: QuoteMode
}

export const SelectedRoute = memo(
  ({
    expectedOutput,
    swaps,
    outputAssetDecimal,
    unitPrice,
    optimal,
    path,
    providers,
    slippage,
    assetTicker,
    inputAsset,
    quoteMode,
    contract,
  }: Props) => {
    const [isOpened, setIsOpened] = useState(false)
    const { slippageTolerance } = useApp()
    const formatPrice = useFormatPrice()

    const { isApproved } = useIsAssetApproved({
      contract,
      asset: inputAsset,
      quoteMode,
    })

    const expectedAssetOutput = useMemo(
      () =>
        formatPrice(
          new Amount(
            new BigNumber(expectedOutput),
            AmountType.ASSET_AMOUNT,
            outputAssetDecimal,
          ),
          { prefix: '' },
        ),
      [expectedOutput, formatPrice, outputAssetDecimal],
    )

    const expectedPriceOutput = useMemo(
      () => formatPrice(unitPrice.multipliedBy(expectedOutput).toNumber()),
      [expectedOutput, formatPrice, unitPrice],
    )

    const slippageInfo = slippage.gt(0) ? `-${slippage.toFixed(2)}` : '-'

    const openSwapGraph = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        setIsOpened(true)
      },
      [],
    )

    const approved =
      [QuoteMode.ETH_TO_ETH, QuoteMode.ETH_TO_TC_SUPPORTED].includes(
        quoteMode,
      ) && isApproved

    return (
      <Box flex={1} col className="relative">
        <Box
          center
          className={classNames(
            'opacity-0 absolute rounded-sm px-4 transition-all bg-btn-secondary-translucent group-hover:bg-transparent w-fit -right-7',
            { '!opacity-100': optimal },
          )}
        >
          <Typography variant="caption-xs">{t('common.optimal')}</Typography>
        </Box>

        <Box col className="pl-4">
          <Box justify="between">
            <Box className="py-2">
              <ProviderLogos size={32} providers={providers} />

              {approved && (
                <Box className={providers.length > 1 ? 'ml-12' : 'ml-2'}>
                  <HoverIcon
                    size={22}
                    iconName="approved"
                    tooltip={t('views.swap.routeContractApproved')}
                  />
                </Box>
              )}
            </Box>

            <Box col justify="end" className="pr-2">
              <Box justify="end" className="gap-x-1">
                <Typography>{expectedAssetOutput}</Typography>
                <Typography>{assetTicker}</Typography>
              </Box>

              <Box alignCenter className="gap-x-1">
                <Typography
                  variant="caption"
                  fontWeight="light"
                  color={
                    slippage.gte(slippageTolerance / 100) ? 'red' : 'green'
                  }
                >
                  ({slippageInfo})
                </Typography>
                <Typography color="secondary">{expectedPriceOutput}</Typography>
              </Box>
            </Box>
          </Box>

          <HighlightCard onClick={openSwapGraph} className="!py-0 !px-1 w-fit">
            <Typography variant="caption-xs" color="secondary">
              {t('common.path')}: {path.replaceAll('->', '→')}
            </Typography>
          </HighlightCard>
        </Box>

        <RouteGraphModal
          isOpened={isOpened}
          onClose={() => setIsOpened(false)}
          // @ts-expect-error cross-chain-api-sdk types
          swaps={swaps}
        />
      </Box>
    )
  },
)
