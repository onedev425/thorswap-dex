import { Text } from '@chakra-ui/react';
import { Box, Select } from 'components/Atomic';
import { Input } from 'components/Input';
import useWindowSize from 'hooks/useWindowSize';
import { ChangeEvent, memo, useCallback, useState } from 'react';
import { t } from 'services/i18n';

import { PoolTable } from './PoolTable';
import { poolCategoryOptions } from './types';
import { useLiquidityPools } from './useLiquidityPools';

export const PoolListView = memo(() => {
  const [keyword, setKeyword] = useState('');
  const [selectedPoolsCategory, setSelectedPoolsCategory] = useState(0);
  const { isMdActive } = useWindowSize();

  const { filteredPools } = useLiquidityPools({
    keyword,
    selectedPoolsCategory,
  });

  const handleChangeKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  return (
    <Box col>
      {isMdActive && (
        <Box col className="gap-8">
          <Text textStyle="h3">{t('common.pools')}</Text>

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
                activeIndex={selectedPoolsCategory}
                onChange={setSelectedPoolsCategory}
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
