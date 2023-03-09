import { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';

export enum LiquidityTypeOption {
  'RUNE' = 'RUNE',
  'ASSET' = 'ASSET',
  'SYMMETRICAL' = 'SYMMETRICAL',
}

export type LiquidityTypeProps = {
  poolAsset: Asset;
  onChange: (val: LiquidityTypeOption) => void;
  selected: LiquidityTypeOption;
  options: LiquidityTypeOption[];
  title?: string;
  tabsCount?: number;
};
