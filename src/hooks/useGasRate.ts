import { useMemo } from 'react'

import { BNBChain, THORChain } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import { useApp } from 'store/app/hooks'
import { useMidgard } from 'store/midgard/hooks'

import { getGasRateByFeeOption } from 'helpers/networkFee'

export const GasUnitLabel: Record<Chain, string> = {
  [Chain.Bitcoin]: 'Sats',
  [Chain.Ethereum]: 'Gwei',
  [Chain.THORChain]: 'Rune',
  [Chain.Binance]: 'Jager', // https://academy.binance.com/en/glossary/jager
  [Chain.Doge]: 'Sats',
  [Chain.Litecoin]: 'Sats',
  [Chain.BitcoinCash]: 'Sats',
  [Chain.BitcoinCash]: 'Sats',
  [Chain.Terra]: 'uluna',
  [Chain.Polkadot]: 'Sats',
  [Chain.Cosmos]: 'Sats',
}

export type ChainGasRate = {
  chain: Chain
  gasRate: number
  gasUnit: string
}

export const useGasRate = () => {
  const { feeOptionType } = useApp()
  const { inboundData } = useMidgard()

  const chainGasRates = useMemo(() => {
    const result: ChainGasRate[] = []

    Object.keys(GasUnitLabel).map((chain) => {
      let gasRate = 0

      if (chain === THORChain) {
        gasRate = 0.02
      } else if (chain === BNBChain) {
        // gas oracle is sending 1.5x rate for bnb chain
        // divide by 10**8 to get asset amount
        // divide by 3 and multiply by 2 to get normal amount
        gasRate =
          (getGasRateByFeeOption({
            inboundData,
            chain: chain as Chain,
            feeOptionType,
          }) /
            3) *
          2
      } else {
        gasRate = getGasRateByFeeOption({
          inboundData,
          chain: chain as Chain,
          feeOptionType,
        })
      }

      if (gasRate) {
        result.push({
          chain: chain as Chain,
          gasRate,
          gasUnit: GasUnitLabel?.[chain as Chain] ?? '',
        })
      }
    })

    return result
  }, [inboundData, feeOptionType])

  return { chainGasRates }
}
