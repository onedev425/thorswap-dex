import { Asset, LegacySwap } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/types'

import { TxTrackerType } from 'store/midgard/types'

import { multichain } from 'services/multichain'

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
  const inputDecimals =
    inputAsset && inputAsset.L1Chain === Chain.Ethereum
      ? await multichain.eth.getERC20AssetDecimal(inputAsset)
      : undefined

  await inputAsset.setDecimal(inputDecimals || undefined)
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
