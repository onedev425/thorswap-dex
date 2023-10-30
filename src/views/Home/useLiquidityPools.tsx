import { usePools } from 'hooks/usePools';
import { useMemo } from 'react';

import { PoolCategoryOption, poolCategoryOptions, poolStatusOptions } from './types';

type Params = {
  keyword: string;
  selectedPoolsCategory: number;
};
export const useLiquidityPools = ({ keyword, selectedPoolsCategory }: Params) => {
  const { pools } = usePools(selectedPoolsCategory === 0 ? '7d' : '30d');

  const selectedPoolsCategoryValue = poolCategoryOptions[selectedPoolsCategory];

  const poolsByStatus = useMemo(() => {
    const selectedPoolStatusValue = poolStatusOptions[0].toLowerCase();

    return pools?.filter(({ status }) => status === selectedPoolStatusValue) || [];
  }, [pools]);

  const filteredPools = useMemo(() => {
    const poolsByCategory =
      selectedPoolsCategoryValue === PoolCategoryOption.Savers
        ? poolsByStatus.filter(
            ({ saversDepth, saversUnits }) => saversDepth !== '0' && saversUnits !== '0',
          )
        : poolsByStatus;

    // filter by keyword
    if (keyword) {
      return poolsByCategory.filter(({ asset }) => {
        const poolStr = asset.toString().toLowerCase();
        const keywordStr = keyword.toLowerCase();

        return poolStr.includes(keywordStr);
      });
    }

    return poolsByCategory;
  }, [selectedPoolsCategoryValue, poolsByStatus, keyword]);

  return { filteredPools };
};
