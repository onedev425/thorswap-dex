import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { getV2Asset, VestingType } from 'helpers/assets';
import { SaverProvider } from 'store/midgard/types';

export enum StakeActions {
  Unstake = 'unstake',
  Deposit = 'deposit',
}

export const vThorAssets: Record<StakeActions, Asset> = {
  [StakeActions.Deposit]: getV2Asset(VestingType.THOR),
  [StakeActions.Unstake]: getV2Asset(VestingType.VTHOR),
};

export type SaverPosition = {
  asset: Asset;
  provider: SaverProvider;
  amount: Amount;
};
