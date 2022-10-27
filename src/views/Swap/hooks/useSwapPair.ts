import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSwapPair } from 'views/Swap/helpers';
import { Pair } from 'views/Swap/types';

export const useSwapPair = () => {
  const [swapPair, setSwapPair] = useState<Pair>({
    inputAsset: Asset.ETH(),
    outputAsset: Asset.THOR(),
  });

  const [inputAmount, setInputAmount] = useState(
    Amount.fromAssetAmount(0, swapPair.inputAsset.decimal),
  );

  const { pair } = useParams<{ pair: string }>();

  const getPair = useCallback(async () => {
    if (!pair) return;

    const swapPairData = await getSwapPair(pair);
    if (swapPairData) {
      setInputAmount(new Amount(inputAmount.assetAmount, 1, swapPairData.inputAsset.decimal));
      setSwapPair(swapPairData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair]);

  useEffect(() => {
    getPair();
  }, [getPair]);

  return { ...swapPair, inputAmount, setInputAmount };
};
