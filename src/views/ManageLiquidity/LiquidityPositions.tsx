import { memo, useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Asset, Pool, SupportedChain } from '@thorswap-lib/multichain-sdk'

import { Box, Button } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'
import { LiquidityCard } from 'components/LiquidityCard'

import { useMidgard } from 'redux/midgard/hooks'
import { ChainMemberData } from 'redux/midgard/types'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

import { ChainPoolData } from './types'

export const LiquidityPositions = memo(() => {
  const navigate = useNavigate()
  const { pools, chainMemberDetails, getAllMemberDetails } = useMidgard()
  const [tipVisible, setTipVisible] = useState(true)

  useEffect(() => {
    getAllMemberDetails()
  }, [getAllMemberDetails])

  const liquidityPools = useMemo(() => {
    const chains = Object.keys(chainMemberDetails) as SupportedChain[]
    if (chains.length === 0) return []

    return chains.reduce((acc, chain) => {
      const chainMembers = chainMemberDetails[chain] as ChainMemberData
      const poolStrings = Object.keys(chainMembers)

      const chainPools = poolStrings.map((poolString) => {
        const poolMemberData = chainMembers[poolString]

        const poolAsset = Asset.fromAssetString(poolString)
        if (!poolAsset) return null

        const pool = Pool.byAsset(poolAsset, pools)
        if (!pool) return null

        const [shareType, memberPool] = Object.entries(poolMemberData)[0] || []
        if (!memberPool) return null

        return { ...memberPool, shareType, pool }
      })

      return acc.concat(chainPools.filter(Boolean) as ChainPoolData[])
    }, [] as ChainPoolData[])
  }, [chainMemberDetails, pools])

  return (
    <>
      {tipVisible && (
        <InfoTip
          className="w-full mt-0 mb-4"
          title={t('common.liquidityProvider')}
          content={t('views.liquidity.tip')}
          onClose={() => setTipVisible(false)}
        />
      )}

      <Box className="w-full pb-4 gap-x-8" justify="between">
        <Button size="lg" stretch onClick={() => navigate(ROUTES.AddLiquidity)}>
          {t('common.add')}
        </Button>

        <Button size="lg" stretch>
          {t('common.create')}
        </Button>
      </Box>

      <Box className="w-full gap-1" col>
        {liquidityPools.map((liquidityPool) => (
          <LiquidityCard
            {...liquidityPool}
            key={liquidityPool.pool.asset.ticker}
            withFooter
          />
        ))}
      </Box>
    </>
  )
})
