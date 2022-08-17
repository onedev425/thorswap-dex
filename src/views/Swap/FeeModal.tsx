import { memo, useEffect, useMemo } from 'react'

import { Asset, chainToSigAsset } from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'

import { RouteFee } from 'views/Swap/types'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Modal, Typography } from 'components/Atomic'
import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoTable } from 'components/InfoTable'

import { t } from 'services/i18n'

import { useFormatPrice } from 'helpers/formatPrice'

type Props = {
  isOpened: boolean
  onClose: () => void
  fees?: RouteFee
  totalFee: string
}

export const FeeModal = memo(({ totalFee, fees, isOpened, onClose }: Props) => {
  const formatPrice = useFormatPrice()
  const rows: InfoRowConfig[] = useMemo(() => {
    if (!fees) return []

    const { affiliateFee, ...chainsFees } = Object.entries(fees).reduce(
      (acc, fee) => {
        const [chain, value] = fee

        value.forEach((a) => (acc.affiliateFee += a.affiliateFeeUSD))

        acc[chain as SupportedChain] = value

        return acc
      },
      { affiliateFee: 0 } as { affiliateFee: number } & {
        [key in SupportedChain]: RouteFee['THOR']
      },
    )

    const rows = Object.entries(chainsFees).reduce((acc, [chain, fee]) => {
      const chainFees = (fee as RouteFee['THOR']).map(
        ({ type, networkFee, networkFeeUSD, asset }) => {
          const chainAsset = chainToSigAsset(chain as SupportedChain)
          const feeAsset = Asset.fromAssetString(asset)

          return {
            label: (
              <Box center className="gap-x-1">
                <Typography variant="caption">
                  {`${t('common.network')} `}
                  {type ? t(`common.${type}`) : ''}
                </Typography>
                <AssetIcon asset={chainAsset} size={20} />
              </Box>
            ),
            value: (
              <Box center className="gap-x-1">
                {feeAsset && (
                  <>
                    <Typography variant="caption-xs" color="secondary">
                      (
                    </Typography>
                    <AssetIcon asset={feeAsset} size={14} />
                    <Typography variant="caption-xs" color="secondary">
                      {formatPrice(networkFee, { prefix: '' })})
                    </Typography>
                  </>
                )}
                <Typography>{formatPrice(networkFeeUSD)}</Typography>
              </Box>
            ),
          }
        },
      )

      return [...chainFees, ...acc]
    }, [] as InfoRowConfig[])

    return [
      ...rows,
      {
        label: (
          <Box center className="gap-x-1">
            <Typography variant="caption">
              {t('views.swap.exchangeFee')}
            </Typography>
            <AssetIcon hasChainIcon={false} asset={Asset.THOR()} size={20} />
          </Box>
        ),
        value:
          affiliateFee > 0 ? (
            formatPrice(affiliateFee)
          ) : (
            <Typography color="green">FREE</Typography>
          ),
      },
      {
        label: (
          <Box center>
            <Typography variant="caption">
              {t('views.wallet.totalFee')}
            </Typography>
          </Box>
        ),
        value: <Typography>{totalFee}</Typography>,
      },
    ]
  }, [fees, formatPrice, totalFee])

  useEffect(() => {
    if (!fees && isOpened) {
      onClose()
    }
  }, [fees, isOpened, onClose])

  if (!fees) return null

  return (
    <Modal
      title={t('views.swap.feeExplanation')}
      isOpened={isOpened}
      onClose={onClose}
    >
      <Box flex={1} className="w-80">
        <InfoTable items={rows} />
      </Box>
    </Modal>
  )
})
