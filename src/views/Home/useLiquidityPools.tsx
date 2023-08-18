import { chainName } from 'helpers/chainName';
import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';

import { PoolCategoryOption, poolCategoryOptions, poolStatusOptions } from './types';

type Params = {
  keyword: string;
  selectedPoolsCategory: number;
};
export const useLiquidityPools = ({ keyword, selectedPoolsCategory }: Params) => {
  const { getPoolsFromState } = useMidgard();
  const poolsToUse = getPoolsFromState();

  const selectedPoolsCategoryValue = poolCategoryOptions[selectedPoolsCategory];

  const poolsByStatus = useMemo(() => {
    const selectedPoolStatusValue = poolStatusOptions[0].toLowerCase();

    return poolsToUse.filter(({ detail }) => detail.status === selectedPoolStatusValue);
  }, [poolsToUse]);

  const filteredPools = useMemo(() => {
    const poolsByCategory =
      selectedPoolsCategoryValue === PoolCategoryOption.Savers
        ? poolsByStatus.filter(
            ({ detail }) => detail.saversDepth !== '0' && detail.saversUnits !== '0',
          )
        : poolsByStatus;

    // filter by keyword
    if (keyword) {
      return poolsByCategory.filter(({ asset }) => {
        const poolStr = asset.toString().toLowerCase();
        const chainStr = chainName(asset.chain, true).toLowerCase();
        const assetType = asset.type.toLowerCase();
        const keywordStr = keyword.toLowerCase();

        return (
          poolStr.includes(keywordStr) ||
          chainStr.includes(keywordStr) ||
          assetType.includes(keywordStr)
        );
      });
    }

    return poolsByCategory;
  }, [selectedPoolsCategoryValue, poolsByStatus, keyword]);

  return { filteredPools };
};
