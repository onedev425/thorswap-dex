import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';

export type RouterStepProps = {
  assets: [AssetEntity, AssetEntity];
  commission: string;
};

export type Pair = {
  inputAsset: AssetEntity;
  outputAsset: AssetEntity;
};

export type RouteFee = {
  [key in Chain]: {
    affiliateFee: number;
    affiliateFeeUSD: number;
    asset: string;
    networkFee: number;
    networkFeeUSD: number;
    type: 'inbound' | 'outbound';
  }[];
};
