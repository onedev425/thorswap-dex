import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';

export type LoanPosition = {
  asset: AssetEntity;
  collateralCurrent: Amount;
  collateralDeposited: Amount;
  collateralWithdrawn: Amount;
  debtIssued: Amount;
  debtRepaid: Amount;
  debtCurrent: Amount;
  lastOpenHeight: number;
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
