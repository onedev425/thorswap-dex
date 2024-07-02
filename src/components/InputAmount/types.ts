import type { SwapKitNumber } from "@swapkit/sdk";
import type { InputProps } from "components/Input/types";

export type AmountProps = {
  amountValue: SwapKitNumber;
  onAmountChange?: (value: SwapKitNumber) => void;
};

export type InputAmountProps = InputProps & AmountProps;
