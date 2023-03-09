import { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { getV2Asset, VestingType } from 'helpers/assets';

export enum StakeActions {
  Unstake = 'unstake',
  Deposit = 'deposit',
}

export const vThorAssets: Record<StakeActions, Asset> = {
  [StakeActions.Deposit]: getV2Asset(VestingType.THOR),
  [StakeActions.Unstake]: getV2Asset(VestingType.VTHOR),
};
