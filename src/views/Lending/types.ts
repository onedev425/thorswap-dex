import type { AssetValue, SwapKitNumber } from "@swapkit/sdk";
import type { AssetSelectType } from "components/AssetSelect/types";

export type LoanPosition = {
  asset: AssetValue;
  collateralCurrent: AssetValue;
  collateralDeposited: AssetValue;
  collateralWithdrawn: AssetValue;
  debtIssued: SwapKitNumber;
  debtRepaid: SwapKitNumber;
  debtCurrent: SwapKitNumber;
  lastOpenHeight: number;
  ltvPercentage?: string;
};

export enum LendingTab {
  Borrow = "borrow",
  Repay = "repay",
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

export type LendingAsset = {
  asset: AssetValue;
  assetDepthAssetAmount: string;
  runeDepthAssetAmount: string;
  loanCr: string;
  loanStatus: "GREEN" | "YELLOW" | "RED";
  loanCollateral: string;
  derivedDepthPercentage: number;
  lendingAvailable: boolean;
  ltvPercentage: string;
} & AssetSelectType;
