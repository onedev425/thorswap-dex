import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { SaverProvider, ThornodePoolType } from 'store/midgard/types';

export type SaverPosition = {
  asset: Asset;
  provider: SaverProvider;
  units: Amount;
  amount: Amount;
  pool: ThornodePoolType;
  depositAmount: Amount;
  earnedAmount: Amount | null;
};

export enum EarnTab {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}

export enum EarnViewTab {
  Earn = 'earn',
  Positions = 'positions',
}

export type SaverQuoteResponse = {
  expected_amount_out: string;
  fees: { affiliate: string; asset: string; outbound: string };
  slippage_bps: number;
  outbound_delay_seconds: number;
};
