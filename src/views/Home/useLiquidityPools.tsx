import { useEffect, useMemo } from 'react'

import { chainToString } from '@thorswap-lib/xchain-util'

import { IconName } from 'components/Atomic'
import { sortAmounts } from 'components/PoolTable/utils'

import { useMidgard } from 'redux/midgard/hooks'
import { useAppDispatch } from 'redux/store'
import { getCoingeckoData } from 'redux/wallet/actions'
import { useWallet } from 'redux/wallet/hooks'

import { ColorType } from 'types/global'

import { PoolTypeOption, poolTypeOptions, poolStatusOptions } from './types'

type Params = {
  keyword: string
  selectedPoolType: number
  selectedPoolStatus: number
}

const iconMapping = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binance',
  USDT: 'usdt',
} as Record<string, IconName>

const colorMapping = {
  BTC: 'orange',
  ETH: 'purple',
  BNB: 'yellow',
  USDT: 'blue',
} as Record<string, ColorType>

export const useLiquidityPools = ({
  selectedPoolStatus,
  selectedPoolType,
  keyword,
}: Params) => {
  const dispatch = useAppDispatch()
  const { pools } = useMidgard()
  const { geckoData } = useWallet()

  const poolsByStatus = useMemo(() => {
    const selectedPoolStatusValue = poolStatusOptions[selectedPoolStatus]

    return pools.filter(
      (pool) => pool.detail.status === selectedPoolStatusValue.toLowerCase(),
    )
  }, [pools, selectedPoolStatus])

  const filteredPools = useMemo(() => {
    // filter by pool asset type
    const selectedPoolTypeValue = poolTypeOptions[selectedPoolType]
    const poolsByType =
      selectedPoolTypeValue !== PoolTypeOption.All
        ? poolsByStatus.filter(
            (pool) => pool.asset.type === selectedPoolTypeValue,
          )
        : poolsByStatus

    // filter by keyword
    if (keyword) {
      return poolsByType.filter((pool) => {
        const poolStr = pool.asset.toString().toLowerCase()
        const chainStr = chainToString(pool.asset.chain).toLowerCase()
        const assetType = pool.asset.type.toLowerCase()
        const keywordStr = keyword.toLowerCase()

        return (
          poolStr.includes(keywordStr) ||
          chainStr.includes(keywordStr) ||
          assetType.includes(keywordStr)
        )
      })
    }

    return poolsByType
  }, [selectedPoolType, poolsByStatus, keyword])

  const featuredPools = useMemo(() => {
    const featured = poolsByStatus.filter(
      (pool) =>
        pool.asset.isBTC() ||
        pool.asset.isETH() ||
        pool.asset.isBNB() ||
        pool.asset.ticker === 'USDT',
    )

    return featured
      .map((pool) => ({
        pool,
        iconName: iconMapping[pool.asset.ticker as 'BTC'],
        color: colorMapping[pool.asset.ticker as 'BTC'],
        change: geckoData[pool.asset.ticker]?.price_change_percentage_24h || 0,
      }))
      .sort((a, b) => sortAmounts(b.pool.runeDepth, a.pool.runeDepth))
  }, [geckoData, poolsByStatus])

  useEffect(() => {
    const missingPools =
      featuredPools.length > 0
        ? featuredPools.filter(({ pool }) => {
            if (!geckoData?.[pool.asset.symbol]) return true
            return false
          })
        : []
    const missingSymbols = missingPools.map(({ pool }) => pool.asset.symbol)

    dispatch(getCoingeckoData(missingSymbols))
  }, [dispatch, featuredPools, geckoData])

  return { filteredPools, featuredPools }
}
