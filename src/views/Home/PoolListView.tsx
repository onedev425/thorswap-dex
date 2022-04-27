import { ChangeEvent, memo, useCallback, useState } from 'react'

import { Select, Box, Typography } from 'components/Atomic'
import { HorizontalSlider } from 'components/HorizontalSlider'
import { Input } from 'components/Input'
import { PoolCard } from 'components/PoolCard'
import { PoolTable } from 'components/PoolTable'

import { useApp } from 'store/app/hooks'

import { t } from 'services/i18n'

import { poolTypeOptions, poolStatusOptions } from './types'
import { useLiquidityPools } from './useLiquidityPools'

export const PoolListView = memo(() => {
  const [keyword, setKeyword] = useState('')
  const [selectedPoolType, setSelectedPoolType] = useState(0)
  const [selectedPoolStatus, setSelectedPoolStatus] = useState(0)
  const { arePoolsHidden } = useApp()

  const { filteredPools, featuredPools } = useLiquidityPools({
    keyword,
    selectedPoolType,
    selectedPoolStatus,
  })

  const handleChangeKeyword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
    },
    [],
  )

  return (
    <Box col>
      {!arePoolsHidden && (
        <Box col>
          <Box className="gap-x-2 rounded-2xl" alignCenter>
            <Typography variant="h3">
              {t('views.home.featuredPools')}
            </Typography>
          </Box>
          <HorizontalSlider itemWidth={302}>
            {featuredPools.map(({ pool, ...rest }) => (
              <PoolCard key={pool.asset.ticker} pool={pool} {...rest} />
            ))}
          </HorizontalSlider>
        </Box>
      )}

      <Box className="gap-8" col>
        <Typography variant="h3">{t('common.liquidityPools')}</Typography>

        <Box
          alignCenter
          justify="between"
          flexWrap="wrap"
          className="gap-2 lg:flex-row"
        >
          <Box className="w-fit">
            <Input
              value={keyword}
              onChange={handleChangeKeyword}
              border="rounded"
              placeholder="Search"
              icon="search"
            />
          </Box>

          <Box className="justify-end w-fit gap-x-6">
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
        </Box>

        <PoolTable data={filteredPools} />
      </Box>
    </Box>
  )
})
