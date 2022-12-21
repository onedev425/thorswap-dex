import { Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';

export type RouterStepProps = {
  assets: [Asset, Asset];
  commission: string;
};

export type Pair = {
  inputAsset: Asset;
  outputAsset: Asset;
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
