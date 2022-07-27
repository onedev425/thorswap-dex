import { Asset, LegacySwap } from '@thorswap-lib/multichain-sdk'

import { TxTrackerType } from 'store/midgard/types'

import { Pair } from './types'

enum SynthType {
  MINT = 0,
  REDEEM = 1,
  SWAP = 2,
}

export const getSwapPair = async (pair: string): Promise<Pair | null> => {
  if (!pair || pair.split('_').length !== 2) {
    return null
  }

  const [input, output] = pair.split('_')

  if (!input || !output) return null

  const inputAsset = Asset.decodeFromURL(input)
  const outputAsset = Asset.decodeFromURL(output)

  if (!inputAsset || !outputAsset) return null

  await inputAsset.setDecimal()
  await outputAsset.setDecimal()

  return { inputAsset, outputAsset }
}

export const getSwapTrackerType = ({
  inputAsset,
  outputAsset,
  synthType,
}: LegacySwap): TxTrackerType => {
  if (inputAsset.isSynth || outputAsset.isSynth) {
    if (synthType === SynthType.MINT) {
      return TxTrackerType.Mint
    }
    if (synthType === SynthType.REDEEM) {
      return TxTrackerType.Redeem
    }
  }

  return TxTrackerType.Swap
}
