import { sortAmounts } from 'components/Atomic/Table/utils';
import { isAVAXAsset, isBTCAsset, isETHAsset } from 'helpers/assets';
import { chainName } from 'helpers/chainName';
import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';
import { ColorType } from 'types/app';

import { poolStatusOptions, PoolTypeOption, poolTypeOptions } from './types';

type Params = {
  keyword: string;
  selectedPoolType: number;
  selectedPoolStatus: number;
};

const colorMapping = {
  BTC: 'orange',
  ETH: 'purple',
  BUSD: 'yellow',
} as Record<string, ColorType>;

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

  const featuredPools = useMemo(
    () =>
      poolsByStatus
        .filter(
          ({ asset }) =>
            isBTCAsset(asset) ||
            isETHAsset(asset) ||
            isAVAXAsset(asset) ||
            ['eth.thor', 'gaia.atom', 'bnb.busd'].some((assetTicker) =>
              asset.toString().toLowerCase().startsWith(assetTicker),
            ),
        )
        .map((pool) => ({
          pool,
          color: colorMapping[pool.asset.ticker as keyof typeof colorMapping],
        }))
        .sort((a, b) => sortAmounts(a.pool.runeDepth, b.pool.runeDepth)),
    [poolsByStatus],
  );

  return { filteredPools, featuredPools };
};
