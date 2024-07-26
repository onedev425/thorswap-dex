import type { AssetValue, SwapKitNumber } from "@swapkit/sdk";

export enum RunePoolTab {
  Deposit = "deposit",
  Withdraw = "withdraw",
}

export type RunePoolPosition = {
  address: string;
  asset: AssetValue;
  units: SwapKitNumber;
  value: SwapKitNumber;
  pnl: SwapKitNumber;
  depositAmount: SwapKitNumber;
  withdrawAmount: SwapKitNumber;
  lastDepositHeight: number;
  lastWithdrawHeight: number;
};

export type RunePoolStats = {
  pol: {
    runeDeposited: string;
    runeWithdrawn: string;
    value: string;
    pnl: string;
    currentDeposit: string;
  };
  providers: {
    units: string;
    pendingUnits: string;
    pendingRune: string;
    value: string;
    pnl: string;
    currentDeposit: string;
  };
  reserve: {
    units: string;
    value: string;
    pnl: string;
    currentDeposit: string;
  };
};
