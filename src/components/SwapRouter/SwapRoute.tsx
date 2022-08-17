import { memo, useMemo } from 'react'

import {
  Amount,
  AmountType,
  Asset,
  QuoteMode,
} from '@thorswap-lib/multichain-sdk'
import BigNumber from 'bignumber.js'

import { useIsAssetApproved } from 'views/Swap/hooks/useIsAssetApproved'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
import { HoverIcon } from 'components/HoverIcon'

import { t } from 'services/i18n'

import { useFormatPrice } from 'helpers/formatPrice'
import { tokenLogoURL } from 'helpers/logoURL'

import { ProviderLogos } from './ProviderLogos'

type Props = {
  selected?: boolean
  onClick: () => void
  selectedQuoteDiff: number
  outputAsset: Asset
  unitPrice: BigNumber
  expectedOutput: string
  path: string
  providers: string[]
  quoteMode: QuoteMode
  contract: string
  inputAsset: Asset
}

export const SwapRoute = memo(
  ({
    expectedOutput,
    onClick,
    selectedQuoteDiff,
    outputAsset,
    unitPrice,
    path,
    providers,
    selected,
    quoteMode,
    contract,
    inputAsset,
  }: Props) => {
    const formatPrice = useFormatPrice()
    const [, address] = outputAsset.symbol.split('-')
    const { isApproved } = useIsAssetApproved({
      contract,
      asset: inputAsset,
      quoteMode,
    })

    const routeOutput = useMemo(
      () =>
        new Amount(
          new BigNumber(expectedOutput),
          AmountType.ASSET_AMOUNT,
          outputAsset.decimal,
        ),
      [expectedOutput, outputAsset.decimal],
    )

    const logoURI =
      !outputAsset.isSynth && address
        ? tokenLogoURL({
            provider: providers[0],
            address,
            identifier: `${outputAsset.L1Chain}.${outputAsset.ticker}`,
          })
        : undefined

    const shortPath = useMemo(() => {
      const [step1, step2, ...rest] = path.split(' -> ')

      return rest.length > 1
        ? `${step1} → ${step2}... → ${rest[rest.length - 1]}`
        : path.replaceAll('->', '→')
    }, [path])

    const expectedOutputPrice = useMemo(
      () => formatPrice(unitPrice.multipliedBy(expectedOutput).toNumber()),
      [expectedOutput, formatPrice, unitPrice],
    )

    const approved =
      [QuoteMode.ETH_TO_ETH, QuoteMode.ETH_TO_TC_SUPPORTED].includes(
        quoteMode,
      ) && isApproved

    return (
      <HighlightCard
        className="!px-3 !py-1.5 !gap-0"
        onClick={onClick}
        isFocused={selected}
      >
        <Box justify="between">
          <Box className="py-2">
            <ProviderLogos providers={providers} />
            {approved && (
              <Box className={providers.length > 1 ? 'ml-6' : ''}>
                <HoverIcon
                  size={18}
                  iconName="approved"
                  tooltip={t('views.swap.routeContractApproved')}
                />
              </Box>
            )}
          </Box>

          <Box align="end" justify="between">
            <Box center className="gap-x-1.5">
              <Box col>
                <Box justify="end" className="gap-x-1">
                  <Typography fontWeight="bold">
                    {routeOutput.toSignificant(6)}
                  </Typography>

                  <Typography>{outputAsset.ticker}</Typography>
                  <AssetIcon
                    hasChainIcon={false}
                    logoURI={logoURI}
                    size={18}
                    asset={outputAsset}
                  />
                </Box>

                <Box alignCenter justify="end" className="gap-x-1">
                  {Number.isFinite(selectedQuoteDiff) &&
                    selectedQuoteDiff !== 0 && (
                      <Typography
                        color={selectedQuoteDiff >= 0 ? 'green' : 'red'}
                        variant="caption-xs"
                        className="!text-[10px] text-right"
                      >
                        ({selectedQuoteDiff.toFixed(2)}%)
                      </Typography>
                    )}
                  <Typography color="secondary" className="text-right">
                    {expectedOutputPrice}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="px-1 pt-0.5">
          <Typography
            variant="caption-xs"
            className="!text-[9px]"
            color="secondary"
          >
            {shortPath}
          </Typography>
        </Box>
      </HighlightCard>
    )
  },
)
