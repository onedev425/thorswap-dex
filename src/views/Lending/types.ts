import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';

export type LoanPosition = {
  asset: AssetEntity;
  collateralUp: Amount;
  collateralDown: Amount;
  collateralRemaining: Amount;
  debtDown: Amount;
  debtUp: Amount;
  ltv: number;
};

export enum LendingTab {
  Borrow = 'borrow',
  Repay = 'repay',
}

export enum LendingViewTab {
  Borrow = 0,
  Positions = 1,
}

export type SaverQuoteResponse = {
  expected_amount_out: string;
  fees: { affiliate: string; asset: string; outbound: string };
  slippage_bps: number;
  outbound_delay_seconds: number;
};
