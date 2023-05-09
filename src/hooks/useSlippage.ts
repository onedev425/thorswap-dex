import { Price } from '@thorswap-lib/swapkit-core';
import { useMemo } from 'react';

export const useSlippage = (input: Price, output: Price | string) => {
  const slippage = useMemo(() => {
    const BNInput = input.raw();
    const outputValue = typeof output === 'string' ? output : output.raw();
    const priceSlippage = BNInput.minus(outputValue).dividedBy(BNInput);

    return priceSlippage.toNumber();
  }, [input, output]);

  return slippage;
};
