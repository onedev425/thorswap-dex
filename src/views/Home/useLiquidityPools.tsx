import { chainName } from 'helpers/chainName';
import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';

import { poolStatusOptions, PoolTypeOption, poolTypeOptions } from './types';

type Params = {
  keyword: string;
  selectedPoolType: number;
  selectedPoolStatus: number;
};
export const useLiquidityPools = ({ selectedPoolStatus, selectedPoolType, keyword }: Params) => {
  const { pools } = useMidgard();

  const poolsByStatus = useMemo(() => {
    const selectedPoolStatusValue = poolStatusOptions[selectedPoolStatus].toLowerCase();

    return pools.filter(({ detail }) => detail.status === selectedPoolStatusValue);
  }, [pools, selectedPoolStatus]);

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

    return poolsByType;
  }, [selectedPoolType, poolsByStatus, keyword]);

  return { filteredPools };
};
