import { chainName } from 'helpers/chainName';
import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';

import {
  PoolCategoryOption,
  poolCategoryOptions,
  poolStatusOptions,
  PoolTypeOption,
  poolTypeOptions,
} from './types';

type Params = {
  keyword: string;
  selectedPoolType: number;
  selectedPoolStatus: number;
  selectedPoolsCategory: number;
};
export const useLiquidityPools = ({
  selectedPoolStatus,
  selectedPoolType,
  keyword,
  selectedPoolsCategory,
}: Params) => {
  const { pools } = useMidgard();
  const pools180D = pools['180d'];
  const pools7D = pools['7d'];

  const selectedPoolsCategoryValue = poolCategoryOptions[selectedPoolsCategory];

  const poolsToUse = selectedPoolsCategoryValue === PoolCategoryOption.Savers ? pools7D : pools180D;

  const poolsByStatus = useMemo(() => {
    const selectedPoolStatusValue = poolStatusOptions[selectedPoolStatus].toLowerCase();

    return poolsToUse.filter(({ detail }) => detail.status === selectedPoolStatusValue);
  }, [poolsToUse, selectedPoolStatus]);

  const filteredPools = useMemo(() => {
    // filter by pool asset type
    const selectedPoolTypeValue = poolTypeOptions[selectedPoolType];

    const poolsByType =
      selectedPoolTypeValue !== PoolTypeOption.All
        ? poolsByStatus.filter((pool) => pool.asset.type === selectedPoolTypeValue)
        : poolsByStatus;

    // filter by keyword
    if (keyword) {
      return poolsByType.filter(({ asset }) => {
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
    if (selectedPoolsCategoryValue === PoolCategoryOption.Savers) {
      return poolsByType.filter(({ detail }) => {
        // TODO - this is a hack to filter out pools that are not savers, also need to add these to PoolDetail (Swapkit-entities)
        // @ts-ignore
        return detail.saversDepth !== '0' && detail.saversUnits !== '0';
      });
    }

    return poolsByType;
  }, [selectedPoolType, selectedPoolsCategoryValue, poolsByStatus, keyword]);

  return { filteredPools };
};
