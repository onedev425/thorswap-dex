import type { AssetValue } from '@swapkit/core';
import type { PoolShareType } from 'store/midgard/types';

export type LPTypeSelectorProps = {
  poolAsset: AssetValue;
  onChange: (val: PoolShareType) => void;
  selected: PoolShareType;
  options: PoolShareType[];
  title?: string;
  tabsCount?: number;
};
