import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { SaverProvider } from 'store/midgard/types';

export type SaverPosition = {
  asset: Asset;
  provider: SaverProvider;
  amount: Amount;
};

export enum SavingsTab {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}
