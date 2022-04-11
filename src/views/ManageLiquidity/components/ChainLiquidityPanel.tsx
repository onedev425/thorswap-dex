import { useCallback, useMemo } from 'react'

import { Asset, Pool, SupportedChain } from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'

import { ChainPoolData } from 'views/ManageLiquidity/types'

import { Box, Button, Icon, Link, Typography } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'
import { LiquidityCard } from 'components/LiquidityCard'
import { ReloadButton } from 'components/ReloadButton'

import { useMidgard } from 'store/midgard/hooks'
import { ChainMemberData, PoolShareType } from 'store/midgard/types'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { getThorYieldInfoRoute } from 'settings/constants'

type Props = {
  chain: SupportedChain
  data: ChainMemberData
  isLoading: boolean
}

export const ChainLiquidityPanel = ({ chain, data, isLoading }: Props) => {
  const { pools, loadMemberDetailsByChain } = useMidgard()

  const chainWalletAddress = useMemo(() => {
    return multichain.getWalletAddressByChain(chain) || '#'
  }, [chain])

  const reloadChainPoolDetails = useCallback(() => {
    loadMemberDetailsByChain(chain)
  }, [chain, loadMemberDetailsByChain])

  // get symm, asset asym, rune asym LPs
  const chainLiquidityPositions = useMemo(() => {
    const poolNames = Object.keys(data)

    const liquidityPositions: ChainPoolData[] = []

    poolNames.map((poolAssetName: string) => {
      const poolMemberData = data[poolAssetName]
      const poolAsset = Asset.fromAssetString(poolAssetName)
      if (!poolAsset) return null

      const pool = Pool.byAsset(poolAsset, pools)
      if (!pool) return null

      if (poolMemberData?.sym) {
        liquidityPositions.push({
          ...poolMemberData?.sym,
          shareType: PoolShareType.SYM,
          pool,
        })
      }

      if (poolMemberData?.assetAsym) {
        liquidityPositions.push({
          ...poolMemberData?.assetAsym,
          shareType: PoolShareType.ASSET_ASYM,
          pool,
        })
      }

      if (poolMemberData?.runeAsym) {
        liquidityPositions.push({
          ...poolMemberData?.runeAsym,
          shareType: PoolShareType.RUNE_ASYM,
          pool,
        })
      }
    })

    return liquidityPositions
  }, [data, pools])

  console.info('chainLiquidity', data)
  console.info('chainLiquidityPositions', chainLiquidityPositions)

  return (
    <Box className="gap-1" col>
      <InfoRow
        size="lg"
        className="!mx-1.5 !mb-1 pl-1.5"
        label={<Typography>{chainToString(chain)}</Typography>}
        value={
          <Box className="gap-x-2">
            <Link
              to={getThorYieldInfoRoute({
                chain,
                address: chainWalletAddress,
              })}
            >
              <Button
                className="px-2.5"
                type="borderless"
                variant="tint"
                tooltip={t('common.viewOnThoryield')}
                startIcon={<Icon size={16} name="chart" />}
              />
            </Link>

            <ReloadButton
              size={16}
              loading={isLoading}
              onLoad={reloadChainPoolDetails}
            />
          </Box>
        }
      />
      {chainLiquidityPositions.map((liquidityPosition) => (
        <LiquidityCard
          {...liquidityPosition}
          key={`${liquidityPosition.pool.asset.ticker}_${liquidityPosition.shareType}`}
          withFooter
        />
      ))}
    </Box>
  )
}
