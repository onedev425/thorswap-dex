import { Amount, AssetEntity, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { IS_LEDGER_LIVE } from 'settings/config';
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
    inputAsset: getSignatureAssetFor(IS_LEDGER_LIVE ? Chain.Bitcoin : Chain.Ethereum),
    outputAsset: getSignatureAssetFor(IS_LEDGER_LIVE ? Chain.Ethereum : Chain.Bitcoin),
  });

  const [inputAmountAssetString, setInputAmountAssetString] = useState(
    searchParams.get('sellAmount') || '0',
  );

  const [outputAmount, setOutputAmount] = useState(
    Amount.fromAssetAmount(0, swapPair.outputAsset.decimal),
  );

  const getPair = useCallback(async () => {
    if (!pair) return;

    const swapPairData = getSwapPair(pair);

    if (swapPairData) {
      setInputAmountAssetString(inputAmountAssetString);
      setSwapPair(swapPairData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair]);

  useEffect(() => {
    getPair();
  }, [getPair]);

  return {
    ...swapPair,
    inputAmountAssetString,
    setInputAmountAssetString,
    outputAmount,
    setOutputAmount,
  };
};
