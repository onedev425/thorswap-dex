import { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';

export type AssetDataType = {
  asset: Asset;
  assetName: string;
  amount: string;
};
