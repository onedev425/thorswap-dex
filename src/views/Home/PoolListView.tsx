import { Text } from '@chakra-ui/react';
import type { PoolPeriods } from '@thorswap-lib/midgard-sdk';
import { Box, Select } from 'components/Atomic';
import { Input } from 'components/Input';
import useWindowSize from 'hooks/useWindowSize';
import type { ChangeEvent } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';
import { t } from 'services/i18n';

import { PoolTable } from './PoolTable';
import { poolCategoryOptions } from './types';
import { useLiquidityPools } from './useLiquidityPools';

const POOLS_TIME_PERIODS_OPTIONS = ['1h', '24h', '7d', '14d', '30d', '90d', '100d', '180d', '365d'];
const POOLS_TIME_PERIODS_OPTIONS_LABELS = [
  '1 Hour',
  '24 Hours',
  '7 Days',
  '14 Days',
  '30 Days',
  '90 Days',
  '100 Days',
  '180 Days',
  '365 Days',
];

export const PoolListView = memo(() => {
  const [keyword, setKeyword] = useState('');
  const [selectedPoolsCategory, setSelectedPoolsCategory] = useState(0);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(0);
  const { isMdActive } = useWindowSize();

  const { filteredPools } = useLiquidityPools({
    keyword,
    selectedPoolsCategory,
    period: POOLS_TIME_PERIODS_OPTIONS[selectedTimePeriod] as unknown as PoolPeriods,
  });

  const handleChangeKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const handleSelectSelectedCategory = (index: number) => {
    setSelectedPoolsCategory(index);
  };

  useEffect(() => {
    setSelectedTimePeriod(selectedPoolsCategory === 0 ? 2 : 4);
  }, [selectedPoolsCategory]);

  return (
    <Box col>
      {isMdActive && (
        <Box col className="gap-8">
          <Text textStyle="h3">{t('common.pools')}</Text>

          <Box alignCenter className="flex-wrap gap-2 lg:flex-row" justify="between">
            <Box className="w-fit gap-2">
              <Input
                border="rounded"
                icon="search"
                onChange={handleChangeKeyword}
                placeholder="Search"
                value={keyword}
              />
              <Select
                forceDropdown
                activeIndex={selectedTimePeriod}
                disableDropdown={false}
                dropdownPlacement="start-start"
                onChange={setSelectedTimePeriod}
                options={POOLS_TIME_PERIODS_OPTIONS_LABELS}
              />
            </Box>

            <Box className="justify-end w-fit gap-x-6">
              <Select
                activeIndex={selectedPoolsCategory}
                onChange={handleSelectSelectedCategory}
                options={poolCategoryOptions}
              />
            </Box>
          </Box>

          <PoolTable
            data={filteredPools}
            poolCategory={poolCategoryOptions[selectedPoolsCategory]}
          />
        </Box>
      )}
    </Box>
  );
});
