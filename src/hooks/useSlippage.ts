import { useMemo } from 'react'

import { Percent, Price } from '@thorswap-lib/multichain-sdk'

export const useSlippage = (input: Price, output: Price | string) => {
  const slippage = useMemo(() => {
    const BNInput = input.raw()
    const outputValue = typeof output === 'string' ? output : output.raw()
    const priceSlippage = BNInput.minus(outputValue).dividedBy(BNInput)

    return new Percent(priceSlippage.lt(0) ? 0 : priceSlippage)
  }, [input, output])

  return slippage
}
