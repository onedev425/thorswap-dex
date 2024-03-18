import { Text } from '@chakra-ui/react';
import { Box, Select } from 'components/Atomic';
import { Input } from 'components/Input';
import { usePools } from 'hooks/usePools';
import useWindowSize from 'hooks/useWindowSize';
import type { ChangeEvent } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { POOLS_TIME_PERIODS_OPTIONS, POOLS_TIME_PERIODS_OPTIONS_LABELS } from 'settings/pools';

import { PoolTable } from './PoolTable';

export const PoolListView = memo(() => {
  const [keyword, setKeyword] = useState('');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(3);
  const { isMdActive } = useWindowSize();

  const { pools, poolsLoading } = usePools(POOLS_TIME_PERIODS_OPTIONS[selectedTimePeriod]);

  const filteredPools = useMemo(() => {
    if (!keyword) return pools;

    return pools.filter(({ asset }) => {
      const poolStr = asset.toString().toLowerCase();
      const keywordStr = keyword.toLowerCase();

      return poolStr.includes(keywordStr);
    });
  }, [pools, keyword]);

  const handleChangeKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

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
            </Box>
            <Box className="w-fit gap-2">
              <Text className="pt-2" textStyle="p">
                {t('views.home.aprPeriodRange')}
              </Text>

              <Select
                forceDropdown
                activeIndex={selectedTimePeriod}
                disableDropdown={false}
                dropdownPlacement="start-start"
                onChange={setSelectedTimePeriod}
                options={POOLS_TIME_PERIODS_OPTIONS_LABELS}
              />
            </Box>
          </Box>

          <PoolTable data={filteredPools} poolsLoading={poolsLoading} />
        </Box>
      )}
    </Box>
  );
});
