import { useState } from "react";
import { LiquidityTypeOption } from "store/midgard/types";

export const useLiquidityType = (initLpType?: LiquidityTypeOption) => {
  const [liquidityType, setLiquidityType] = useState(initLpType || LiquidityTypeOption.SYMMETRICAL);

  return { liquidityType, setLiquidityType };
};
