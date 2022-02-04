import { LiquidityProvider } from './types'

export const isPendingLP = (data: LiquidityProvider): boolean => {
  const isPending =
    Number(data.pending_asset) > 0 || Number(data.pending_rune) > 0

  return isPending
}
