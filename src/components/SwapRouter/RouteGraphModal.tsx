import { Fragment, memo, useMemo } from 'react'

import { Asset, chainToSigAsset, QuoteSwap } from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'

import { AssetIcon } from 'components/AssetIcon'
import { getAssetIconUrl } from 'components/AssetIcon/utils'
import { Box, Modal, Typography } from 'components/Atomic'
import { SwapGraph } from 'components/SwapRouter/SwapGraph'

import { t } from 'services/i18n'

import { chainName } from 'helpers/chainName'
import { providerLogoURL, tokenLogoURL } from 'helpers/logoURL'

import { normalizedProviderName } from './ProviderLogos'
import { SwapGraphType } from './types'

type Props = {
  isOpened: boolean
  onClose: () => void
  swaps: { [key in SupportedChain]: QuoteSwap[][] }
}

const parseToSwapItem = ({
  address,
  identifier,
}: {
  address?: string
  identifier: string
}) => {
  try {
    const asset = Asset.fromAssetString(identifier)
    const logoURL =
      (address
        ? tokenLogoURL({ address, provider: 'coinGecko', identifier })
        : asset && getAssetIconUrl(asset)) || ''

    return { identifier, logoURL }
  } catch (e) {
    return { identifier: '', logoURL: '' }
  }
}

export const RouteGraphModal = memo(({ isOpened, onClose, swaps }: Props) => {
  const swapGraph = useMemo(
    () =>
      Object.entries(swaps || {}).reduce((acc, [chain, value]) => {
        const name = chainName(chain, true)
        const chainAsset = chainToSigAsset(chain as SupportedChain)
        const chainSwaps = value.map((swapParts) =>
          swapParts.map(
            // @ts-expect-error cross-chain-api-sdk types
            ({ from, to, parts, fromTokenAddress, toTokenAddress }) => ({
              fromAsset: parseToSwapItem({
                address: fromTokenAddress,
                identifier: from,
              }),
              toAsset: parseToSwapItem({
                address: toTokenAddress,
                identifier: to,
              }),
              swapParts: parts
                .concat()
                // @ts-expect-error cross-chain-api-sdk types
                .sort((a, b) => b.percentage - a.percentage)
                // @ts-expect-error cross-chain-api-sdk types
                .map(({ percentage, provider }) => ({
                  percentage,
                  providerLogoURL: provider ? providerLogoURL(provider) : '',
                  provider: (normalizedProviderName[provider as 'THORCHAIN'] ||
                    provider) as string,
                })),
            }),
          ),
        )

        acc.push({
          name,
          chainSwaps,
          logoURL: chainAsset ? getAssetIconUrl(chainAsset) : '',
        })
        return acc
      }, [] as SwapGraphType),
    [swaps],
  )

  return (
    <Modal title={t('common.swapPath')} isOpened={isOpened} onClose={onClose}>
      <Box flex={1} alignCenter className="gap-x-4 max-w-[80vw]">
        {swapGraph.map(({ name, logoURL, chainSwaps }, index, array) => (
          <Fragment key={name}>
            <Box col>
              <Box className="gap-2 pb-2" alignCenter>
                {logoURL && <AssetIcon size={28} logoURI={logoURL} />}
                <Typography variant="subtitle2">{name}</Typography>
              </Box>

              <Box col alignCenter flex={1}>
                {chainSwaps.map((swaps) => (
                  <Box
                    alignCenter
                    className="gap-6"
                    row
                    key={`${swaps[0].fromAsset.identifier}-${swaps[0].toAsset.identifier}`}
                  >
                    {swaps.map((swapGraph, index, array) => (
                      <Fragment
                        key={`${swapGraph.fromAsset.identifier}-${swapGraph.toAsset.identifier}`}
                      >
                        <SwapGraph {...swapGraph} />
                        {index !== array.length - 1 && (
                          <Typography className="text-[24px]">→</Typography>
                        )}
                      </Fragment>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>

            {index !== array.length - 1 && (
              <Typography className="text-[34px]">→</Typography>
            )}
          </Fragment>
        ))}
      </Box>
    </Modal>
  )
})
