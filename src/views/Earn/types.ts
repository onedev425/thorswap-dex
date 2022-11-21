import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { SaverProvider } from 'store/midgard/types';

export type SaverPosition = {
  asset: Asset;
  provider: SaverProvider;
  amount: Amount;
};

export enum EarnTab {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}

export type SaverQuoteResponse = {
  expected_amount_out: string;
  fees: { affiliate: string; asset: string; outbound: string };
  slippage_bps: number;
  outbound_delay_seconds: number;
};
