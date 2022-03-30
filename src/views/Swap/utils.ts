import { Asset, Swap, SynthType } from '@thorswap-lib/multichain-sdk'

import { TxTrackerType } from 'redux/midgard/types'

import { Pair } from './types'

export const getSwapPair = async (pair: string): Promise<Pair | null> => {
  if (!pair || pair.split('_').length !== 2) {
    return null
  }

  const input = pair.split('_')?.[0]
  const output = pair.split('_')?.[1]

  if (!input || !output) return null

  const inputAsset = Asset.decodeFromURL(input)
  const outputAsset = Asset.decodeFromURL(output)

  if (!inputAsset || !outputAsset) return null

  await inputAsset.setDecimal()
  await outputAsset.setDecimal()

  return {
    inputAsset,
    outputAsset,
  }
}

export const getSwapTrackerType = (swap: Swap): TxTrackerType => {
  if (swap.inputAsset.isSynth || swap.outputAsset.isSynth) {
    if (swap.synthType === SynthType.MINT) {
      return TxTrackerType.Mint
    }
    if (swap.synthType === SynthType.REDEEM) {
      return TxTrackerType.Redeem
    }
  }

  return TxTrackerType.Swap
}
