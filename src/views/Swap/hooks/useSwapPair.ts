import { Amount, AssetEntity, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Pair } from 'views/Swap/types';

const getSwapPair = (pair: string) => {
  const [input, output] = (pair || '').split('_');

  if (!input || !output) return null;

  const inputAsset = AssetEntity.decodeFromURL(input);
  const outputAsset = AssetEntity.decodeFromURL(output);

  if (!inputAsset || !outputAsset) return null;
  return { inputAsset, outputAsset };
};

export const useSwapPair = () => {
  const [searchParams] = useSearchParams();

  const { pair } = useParams<{ pair: string }>();
  const [swapPair, setSwapPair] = useState<Pair>({
    inputAsset: getSignatureAssetFor(Chain.Ethereum),
    outputAsset: getSignatureAssetFor(Chain.Bitcoin),
  });

  const [inputAmount, setInputAmount] = useState(
    Amount.fromAssetAmount(
      parseFloat(searchParams.get('sellAmount') || '0'),
      swapPair.inputAsset.decimal,
    ),
  );

  const [outputAmount, setOutputAmount] = useState(
    Amount.fromAssetAmount(0, swapPair.outputAsset.decimal),
  );

  const getPair = useCallback(async () => {
    if (!pair) return;

    const swapPairData = getSwapPair(pair);

    if (swapPairData) {
      setInputAmount(new Amount(inputAmount.assetAmount, 1, swapPairData.inputAsset.decimal));
      setSwapPair(swapPairData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair]);

  useEffect(() => {
    getPair();
  }, [getPair]);

  return { ...swapPair, inputAmount, setInputAmount, outputAmount, setOutputAmount };
};
