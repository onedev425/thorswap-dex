import { useCallback, useState, useMemo } from 'react'

import { chainToString } from '@thorswap-lib/xchain-util'

import { Select, Box, Typography } from 'components/Atomic'
import { Input } from 'components/Input'
import { PoolTable } from 'components/PoolTable'

import { useMidgard } from 'redux/midgard/hooks'

import { t } from 'services/i18n'

import { PoolTypeOption, poolTypeOptions, poolStatusOptions } from './types'

export const PoolListView = () => {
  const [keyword, setKeyword] = useState('')
  const [selectedPoolType, setSelectedPoolType] = useState(0)
  const [selectedPoolStatus, setSelectedPoolStatus] = useState(0)

  const { pools } = useMidgard()

  const handleChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
    },
    [],
  )

  const filteredPools = useMemo(() => {
    const selectedPoolStatusValue = poolStatusOptions[selectedPoolStatus]
    // filter by status
    const poolsByStatus = pools.filter(
      (pool) => pool.detail.status === selectedPoolStatusValue.toLowerCase(),
    )

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
  }, [pools, keyword, selectedPoolStatus, selectedPoolType])

  return (
    <Box className="gap-8" col>
      <Typography variant="h3">{t('common.liquidityPools')}</Typography>
      <Box justify="between" className="flex-wrap gap-8">
        <Input
          value={keyword}
          onChange={handleChangeKeyword}
          border="rounded"
          placeholder="Search"
          icon="search"
        />

        <Select
          options={poolTypeOptions}
          activeIndex={selectedPoolType}
          onChange={setSelectedPoolType}
        />
        <Select
          options={poolStatusOptions}
          activeIndex={selectedPoolStatus}
          onChange={setSelectedPoolStatus}
        />
      </Box>

      <PoolTable data={filteredPools} />
    </Box>
  )
}
