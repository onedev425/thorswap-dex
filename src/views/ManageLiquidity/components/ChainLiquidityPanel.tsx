import { useCallback, useMemo } from 'react'

import { Asset, Pool, SupportedChain } from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'

import { ChainPoolData } from 'views/ManageLiquidity/types'

import { Box, Button, Icon, Link, Typography } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'
import { LiquidityCard } from 'components/LiquidityCard'
import { ReloadButton } from 'components/ReloadButton'

import { useMidgard } from 'store/midgard/hooks'
import { ChainMemberData } from 'store/midgard/types'

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

  const liquidityPools = useMemo(() => {
    const poolStrings = Object.keys(data)

    const chainPools = poolStrings.map((poolString) => {
      const poolMemberData = data[poolString]

      const poolAsset = Asset.fromAssetString(poolString)
      if (!poolAsset) return null

      const pool = Pool.byAsset(poolAsset, pools)
      if (!pool) return null

      const [shareType, memberPool] = Object.entries(poolMemberData)[0] || []
      if (!memberPool) return null

      return { ...memberPool, shareType, pool }
    })

    return chainPools.filter(Boolean) as ChainPoolData[]
  }, [data, pools])

  console.log('liquidityPools', liquidityPools)

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
      {liquidityPools.map((liquidityPool) => (
        <LiquidityCard
          {...liquidityPool}
          key={liquidityPool.pool.asset.ticker}
          withFooter
        />
      ))}
    </Box>
  )
}
