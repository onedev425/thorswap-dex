import { useMemo } from 'react'

import { Asset, Pool } from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'

import { ChainPoolData } from 'views/Liquidity/types'

import { Box, Button, Icon, Link, Typography } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'
import { LiquidityCard } from 'components/LiquidityCard'
import { ReloadButton } from 'components/ReloadButton'

import { useMidgard } from 'store/midgard/hooks'
import {
  ChainMemberData,
  LpDetailCalculationResult,
  PoolShareType,
} from 'store/midgard/types'
import { isPendingLP } from 'store/midgard/utils'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { chainName } from 'helpers/chainName'

import { getThorYieldLPInfoRoute } from 'settings/constants'

type Props = {
  chain: SupportedChain
  data: ChainMemberData
  isLoading: boolean
  lpAddedAndWithdraw: LpDetailCalculationResult
}

export const ChainLiquidityPanel = ({
  chain,
  data,
  isLoading,
  lpAddedAndWithdraw,
}: Props) => {
  const { pools, loadMemberDetailsByChain } = useMidgard()

  const chainWalletAddress = useMemo(
    () => multichain().getWalletAddressByChain(chain) || '#',
    [chain],
  )

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

      const hasPendingLP =
        poolMemberData?.sym && isPendingLP(poolMemberData?.sym)

      if (!hasPendingLP && poolMemberData?.pending) {
        liquidityPositions.push({
          ...poolMemberData?.pending,
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

  return (
    <Box className="gap-1" col>
      <InfoRow
        size="sm"
        className="!mx-1.5 pl-1.5"
        label={<Typography>{chainName(chain, true)}</Typography>}
        value={
          <Box className="gap-x-2 mb-1">
            <Link
              to={getThorYieldLPInfoRoute({
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
              onLoad={() => loadMemberDetailsByChain(chain)}
            />
          </Box>
        }
      />

      {chainLiquidityPositions.map((liquidityPosition) => (
        <LiquidityCard
          {...liquidityPosition}
          key={`${liquidityPosition.pool.asset.ticker}_${liquidityPosition.shareType}`}
          withFooter
          lpAddedAndWithdraw={lpAddedAndWithdraw}
        />
      ))}
    </Box>
  )
}
