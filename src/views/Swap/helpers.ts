import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { TxTrackerType } from 'store/midgard/types';

import { Pair } from './types';

export const getSwapPair = async (pair: string): Promise<Pair | null> => {
  const [input, output] = (pair || '').split('_');

  if (!input || !output) return null;

  const inputAsset = Asset.decodeFromURL(input);
  const outputAsset = Asset.decodeFromURL(output);

  if (!inputAsset || !outputAsset) return null;
  return { inputAsset, outputAsset };
};

export const getSwapTrackerType = ({
  inputAsset,
  outputAsset,
}: {
  inputAsset: Asset;
  outputAsset: Asset;
}): TxTrackerType => {
  if (inputAsset.isSynth && outputAsset.isSynth) return TxTrackerType.Swap;
  if (inputAsset.isSynth && outputAsset.isRUNE()) return TxTrackerType.Redeem;
  if (outputAsset.isSynth) return TxTrackerType.Mint;

  return TxTrackerType.Swap;
};

export const getTxAsset = (asset: Asset, amount: Amount) => ({
  asset: asset.toString(),
  amount: amount.toSignificant(8),
});
