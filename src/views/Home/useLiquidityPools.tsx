import { useMemo } from 'react'

import { chainToString } from '@thorswap-lib/xchain-util'

import { sortAmounts } from 'components/PoolTable/utils'

import { useMidgard } from 'store/midgard/hooks'

import { ColorType } from 'types/app'

import { PoolTypeOption, poolTypeOptions, poolStatusOptions } from './types'

type Params = {
  keyword: string
  selectedPoolType: number
  selectedPoolStatus: number
}

const colorMapping = {
  BTC: 'orange',
  ETH: 'purple',
  BUSD: 'yellow',
  LUNA: 'yellow',
  UST: 'blue',
} as Record<string, ColorType>

export const useLiquidityPools = ({
  selectedPoolStatus,
  selectedPoolType,
  keyword,
}: Params) => {
  const { pools } = useMidgard()

  const poolsByStatus = useMemo(() => {
    const selectedPoolStatusValue =
      poolStatusOptions[selectedPoolStatus].toLowerCase()

    return pools.filter(
      ({ detail }) => detail.status === selectedPoolStatusValue,
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
      return poolsByType.filter(({ asset }) => {
        const poolStr = asset.toString().toLowerCase()
        const chainStr = chainToString(asset.chain).toLowerCase()
        const assetType = asset.type.toLowerCase()
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
      ({ asset }) =>
        asset.isBTC() ||
        asset.isETH() ||
        ['luna', 'ust', 'busd'].includes(asset.ticker.toLowerCase()),
    )

    return featured
      .map((pool) => ({
        pool,
        color: colorMapping[pool.asset.ticker as keyof typeof colorMapping],
      }))
      .sort((a, b) => sortAmounts(b.pool.runeDepth, a.pool.runeDepth))
  }, [poolsByStatus])

  return { filteredPools, featuredPools }
}
