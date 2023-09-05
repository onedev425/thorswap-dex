import type { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import type { PoolShareType } from 'store/midgard/types';

export type LPTypeSelectorProps = {
  poolAsset: Asset;
  onChange: (val: PoolShareType) => void;
  selected: PoolShareType;
  options: PoolShareType[];
  title?: string;
  tabsCount?: number;
};
