import { LiquidityTypeOption } from 'components/LiquidityType/types';
import { useState } from 'react';

export const useLiquidityType = (initLpType?: LiquidityTypeOption) => {
  const [liquidityType, setLiquidityType] = useState(initLpType || LiquidityTypeOption.SYMMETRICAL);

  return { liquidityType, setLiquidityType };
};
