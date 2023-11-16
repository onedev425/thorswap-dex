import { AssetValue, Chain, FeeOption, gasFeeMultiplier } from '@swapkit/core';
import { isAVAXAsset, isBTCAsset, isETHAsset } from 'helpers/assets';
import { parseAssetToToken } from 'helpers/parseHelpers';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useMemo } from 'react';
import { useApp } from 'store/app/hooks';
import { useGetGasPriceRatesQuery } from 'store/thorswap/api';
import type { GasPriceInfo } from 'store/thorswap/types';

type DirectionType = 'inbound' | 'outbound' | 'transfer';

const getTxSizeByAsset = (asset: AssetValue): number => {
  switch (asset.chain) {
    case Chain.Avalanche:
    case Chain.BinanceSmartChain:
    case Chain.Ethereum:
      return 80000;
    case Chain.BitcoinCash:
      return 1500;
    case Chain.Bitcoin:
    case Chain.Litecoin:
      return 300;
    case Chain.Dogecoin:
      return 450;
    default:
      return 1;
  }
};

const getGasFeeAssetForAsset = (asset?: AssetValue) => {
  if (!asset || asset.isSynthetic) return AssetValue.fromChainOrSignature(Chain.THORChain);
  return AssetValue.fromChainOrSignature(asset.chain);
};

const getTypeMultiplier = ({
  direction,
  multiplier,
}: {
  direction: DirectionType;
  multiplier: number;
}) => (direction === 'transfer' ? multiplier : direction === 'inbound' ? 2 / 3 : 2);

export const getMultiplierForAsset = (asset?: AssetValue) => {
  if (!asset || asset.isSynthetic) return 1;
  if (isETHAsset(asset) || isAVAXAsset(asset) || isBTCAsset(asset)) return undefined;

  return 1;
};

export const parseFeeToAssetAmount = ({
  asset,
  gasRate,
}: {
  asset?: AssetValue;
  gasRate: number;
}): AssetValue =>
  asset
    ? asset.set(gasRate * getTxSizeByAsset(asset))
    : AssetValue.fromChainOrSignature(Chain.THORChain, 0.02);

export const getNetworkFee = ({
  gasPrice,
  direction = 'transfer',
  feeOptionType = FeeOption.Fast,
  multiplier,
}: {
  gasPrice: number;
  direction?: DirectionType;
  feeOptionType?: FeeOption;
  multiplier?: number;
}) =>
  gasPrice *
  getTypeMultiplier({ direction, multiplier: multiplier || gasFeeMultiplier[feeOptionType] });

export const useAssetNetworkFee = ({
  asset,
  type = 'transfer',
  chainInfo,
}: {
  chainInfo: GasPriceInfo | undefined;
  asset: AssetValue;
  type?: 'inbound' | 'outbound' | 'transfer';
}) => {
  const { feeOptionType } = useApp();

  const assetNetworkFee = useMemo(() => {
    const gasRate = getNetworkFee({
      gasPrice: chainInfo?.gasAsset || 0,
      feeOptionType,
      multiplier: getMultiplierForAsset(asset),
      direction: type === 'inbound' ? 'inbound' : 'transfer',
    });

    return parseFeeToAssetAmount({ gasRate, asset });
  }, [asset, chainInfo, feeOptionType, type]);

  return assetNetworkFee;
};

export const useNetworkFee = ({
  inputAsset,
  outputAsset,
  type = 'transfer',
}: {
  inputAsset: AssetValue;
  type?: 'inbound' | 'outbound' | 'transfer';
  outputAsset?: AssetValue;
}) => {
  const inputGasAsset = getGasFeeAssetForAsset(inputAsset);
  const outputGasAsset = getGasFeeAssetForAsset(outputAsset);

  const { data: tokenPrices, isLoading: tokenPricesLoading } = useTokenPrices(
    [inputGasAsset, outputGasAsset, inputAsset, outputAsset].filter(Boolean) as AssetValue[],
  );

  const { data: gasPriceRates, isLoading: priceRatesLoading } = useGetGasPriceRatesQuery();
  const [inputChainInfo, outputChainInfo] = useMemo(() => {
    const inputChainInfo = gasPriceRates?.find(({ asset }) => asset.includes(inputGasAsset?.chain));
    const outputChainInfo = gasPriceRates?.find(({ asset }) =>
      asset.includes(outputGasAsset?.chain),
    );

    return [inputChainInfo, outputChainInfo];
  }, [gasPriceRates, inputGasAsset?.chain, outputGasAsset?.chain]);

  const inputFee = useAssetNetworkFee({ asset: inputGasAsset, type, chainInfo: inputChainInfo });
  const outputFee = useAssetNetworkFee({ asset: outputGasAsset, type, chainInfo: outputChainInfo });

  const findTokenPrice = useCallback(
    (asset: AssetValue) =>
      tokenPrices[parseAssetToToken(asset)?.identifier as string]?.price_usd || 0,
    [tokenPrices],
  );

  const { outputGasAssetUSDPrice, inputGasAssetUSDPrice, inputAssetUSDPrice, outputAssetUSDPrice } =
    useMemo(
      () => ({
        inputAssetUSDPrice: findTokenPrice(inputAsset),
        outputAssetUSDPrice: outputAsset ? findTokenPrice(outputAsset) : 0,
        inputGasAssetUSDPrice: findTokenPrice(inputGasAsset),
        outputGasAssetUSDPrice: findTokenPrice(outputGasAsset),
      }),
      [findTokenPrice, inputAsset, inputGasAsset, outputAsset, outputGasAsset],
    );

  const feeInUSD = useMemo(() => {
    const inputFeePrice = inputFee.mul(inputGasAssetUSDPrice);

    const outputFeePrice = outputFee.mul(outputAssetUSDPrice);

    return outputGasAsset && inputGasAsset
      ? `$${inputFeePrice.add(outputFeePrice).toFixed(2)}`
      : inputGasAsset
      ? `$${inputFeePrice.toFixed(2)}`
      : '';
  }, [
    inputFee,
    inputGasAsset,
    inputGasAssetUSDPrice,
    outputAssetUSDPrice,
    outputFee,
    outputGasAsset,
  ]);

  return {
    inputFee,
    outputFee,
    feeInUSD,
    isLoading: priceRatesLoading || tokenPricesLoading,
    inputAssetUSDPrice,
    outputAssetUSDPrice,
    inputGasAssetUSDPrice,
    outputGasAssetUSDPrice,
  };
};
