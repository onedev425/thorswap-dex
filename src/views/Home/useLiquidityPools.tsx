import type { PoolPeriods } from '@thorswap-lib/midgard-sdk';
import { usePools } from 'hooks/usePools';
import { useMemo } from 'react';

import { poolStatusOptions } from './types';

type Params = {
  keyword: string;
  period: PoolPeriods;
};
export const useLiquidityPools = ({ keyword, period }: Params) => {
  const { pools } = usePools(period);

  const poolsByStatus = useMemo(() => {
    const selectedPoolStatusValue = poolStatusOptions[0].toLowerCase();

    return pools?.filter(({ status }) => status === selectedPoolStatusValue) || [];
  }, [pools]);

  const filteredPools = useMemo(() => {
    // filter by keyword
    if (keyword) {
      return poolsByStatus.filter(({ asset }) => {
        const poolStr = asset.toString().toLowerCase();
        const keywordStr = keyword.toLowerCase();

        return poolStr.includes(keywordStr);
      });
    }

    return poolsByStatus;
  }, [poolsByStatus, keyword]);

  return { filteredPools };
};
