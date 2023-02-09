import { Text } from '@chakra-ui/react';
import { Box, Icon, Select } from 'components/Atomic';
import { HorizontalSlider } from 'components/HorizontalSlider';
import { Input } from 'components/Input';
import useWindowSize from 'hooks/useWindowSize';
import { ChangeEvent, memo, useCallback, useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';

import { PoolCard } from './PoolCard';
import { PoolTable } from './PoolTable';
import { poolStatusOptions, poolTypeOptions } from './types';
import { useLiquidityPools } from './useLiquidityPools';

export const PoolListView = memo(() => {
  const [keyword, setKeyword] = useState('');
  const [selectedPoolType, setSelectedPoolType] = useState(0);
  const [selectedPoolStatus, setSelectedPoolStatus] = useState(0);
  const { isMdActive } = useWindowSize();
  const { arePoolsHidden } = useApp();

  const { filteredPools, featuredPools } = useLiquidityPools({
    keyword,
    selectedPoolType,
    selectedPoolStatus,
  });

  const handleChangeKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  return (
    <Box col>
      {!selectedPoolStatus && !arePoolsHidden && (
        <Box col>
          <Box alignCenter className="gap-x-2 rounded-2xl">
            <Text textStyle="h3">{t('views.home.featuredPools')}</Text>
          </Box>

          {featuredPools.length ? (
            <HorizontalSlider itemWidth={302}>
              {featuredPools.map(({ pool, ...rest }) => (
                <PoolCard key={pool.asset.ticker} pool={pool} {...rest} />
              ))}
            </HorizontalSlider>
          ) : (
            <Box center flex={1}>
              <Icon spin name="loader" size={32} />
            </Box>
          )}
        </Box>
      )}

      {/*
       * TODO: Temporary solution for safari mobile browser which crashes on rendering this part.
       * Further investigation/optimization needed
       */}
      {isMdActive && (
        <Box col className="gap-8">
          <Text textStyle="h3">{t('common.liquidityPools')}</Text>

          <Box alignCenter className="flex-wrap gap-2 lg:flex-row" justify="between">
            <Box className="w-fit">
              <Input
                border="rounded"
                icon="search"
                onChange={handleChangeKeyword}
                placeholder="Search"
                value={keyword}
              />
            </Box>

            <Box className="justify-end w-fit gap-x-6">
              <Select
                activeIndex={selectedPoolType}
                onChange={setSelectedPoolType}
                options={poolTypeOptions}
              />
              <Select
                activeIndex={selectedPoolStatus}
                onChange={setSelectedPoolStatus}
                options={poolStatusOptions}
              />
            </Box>
          </Box>

          <PoolTable data={filteredPools} />
        </Box>
      )}
    </Box>
  );
});
