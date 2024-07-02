import type { AssetValue, SwapKitNumber } from "@swapkit/sdk";
import type { SaverProvider, ThornodePoolType } from "store/midgard/types";

export type SaverPosition = {
  asset: AssetValue;
  provider: SaverProvider;
  units: SwapKitNumber;
  amount: SwapKitNumber;
  pool: ThornodePoolType;
  depositAmount: SwapKitNumber;
  earnedAmount: SwapKitNumber | null;
};

export enum EarnTab {
  Deposit = "deposit",
  Withdraw = "withdraw",
}

export enum EarnViewTab {
  Earn = 0,
  Positions = 1,
}

export type SaverQuoteResponse = {
  expected_amount_out: string;
  fees: { total: string; affiliate: string; asset: string; outbound: string };
  slippage_bps: number;
  outbound_delay_seconds: number;
};
