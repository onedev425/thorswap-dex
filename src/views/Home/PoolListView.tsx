import { useCallback, useState } from 'react'

import { Select, Box, Typography } from 'components/Atomic'
import { HorizontalSlider } from 'components/HorizontalSlider'
import { Input } from 'components/Input'
import { PoolCard } from 'components/PoolCard'
import { PoolTable } from 'components/PoolTable'

import { t } from 'services/i18n'

import { poolTypeOptions, poolStatusOptions } from './types'
import { useLiquidityPools } from './useLiquidityPools'

export const PoolListView = () => {
  const [keyword, setKeyword] = useState('')
  const [selectedPoolType, setSelectedPoolType] = useState(0)
  const [selectedPoolStatus, setSelectedPoolStatus] = useState(0)

  const { filteredPools, featuredPools } = useLiquidityPools({
    keyword,
    selectedPoolType,
    selectedPoolStatus,
  })

  const handleChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
    },
    [],
  )

  return (
    <Box className="gap-8" col>
      <Typography variant="h3">
        {t('views.home.swapCrossChainAssets')}
      </Typography>

      <Box center className="flex-wrap gap-4">
        <HorizontalSlider itemWidth={302}>
          {featuredPools.map(({ iconName, ...rest }) => (
            <PoolCard key={iconName} iconName={iconName} {...rest} />
          ))}
        </HorizontalSlider>
      </Box>

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
    </Box>
  )
}
