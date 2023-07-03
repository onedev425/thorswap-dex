import { gasFeeMultiplier } from '@thorswap-lib/helpers';
import {
  Amount,
  AssetAmount,
  AssetEntity,
  getSignatureAssetFor,
  Pool,
} from '@thorswap-lib/swapkit-core';
import { BaseDecimal, Chain, FeeOption } from '@thorswap-lib/types';
import BigNumber from 'bignumber.js';
import { isAVAXAsset, isBTCAsset, isETHAsset, USDAsset } from 'helpers/assets';
import { parseAssetToToken } from 'helpers/parseHelpers';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useMemo } from 'react';
import { useApp } from 'store/app/hooks';
import { useGetGasPriceRatesQuery } from 'store/thorswap/api';
import { GasPriceInfo } from 'store/thorswap/types';

type DirectionType = 'inbound' | 'outbound' | 'transfer';

const getTxSizeByAsset = (asset: AssetEntity): number => {
  switch (asset.L1Chain) {
    case Chain.Avalanche:
    case Chain.BinanceSmartChain:
    case Chain.Ethereum:
      return 80000;
    case Chain.BitcoinCash:
      return 1500;
    case Chain.Bitcoin:
    case Chain.Litecoin:
      return 300;
    case Chain.Doge:
      return 450;
    default:
      return 1;
  }
};

const getGasFeeAssetForAsset = (asset?: AssetEntity) => {
  if (!asset || asset.isSynth) return getSignatureAssetFor(Chain.THORChain);

  switch (asset.L1Chain) {
    case Chain.Ethereum:
    case Chain.Binance:
    case Chain.Avalanche:
      return getSignatureAssetFor(asset.L1Chain);
    default:
      return asset;
  }
};

const getTypeMultiplier = ({
  direction,
  multiplier,
}: {
  direction: DirectionType;
  multiplier: number;
}) => (direction === 'transfer' ? multiplier : direction === 'inbound' ? 2 / 3 : 2);

export const getMultiplierForAsset = (asset?: AssetEntity) => {
  if (!asset || asset.isSynth) return 1;
  if (isETHAsset(asset) || isAVAXAsset(asset) || isBTCAsset(asset)) return undefined;

  return 1;
};

export const parseFeeToAssetAmount = ({
  asset,
  gasRate,
}: {
  asset?: AssetEntity;
  gasRate: number;
}) =>
  asset
    ? new AssetAmount(
        getGasFeeAssetForAsset(asset),
        Amount.fromNormalAmount(gasRate).mul(getTxSizeByAsset(asset)),
      )
    : new AssetAmount(
        getSignatureAssetFor(Chain.THORChain),
        Amount.fromBaseAmount(0, BaseDecimal.THOR),
      );

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
  asset: AssetEntity;
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
  inputAsset: AssetEntity;
  type?: 'inbound' | 'outbound' | 'transfer';
  outputAsset?: AssetEntity;
}) => {
  const inputGasAsset = getGasFeeAssetForAsset(inputAsset);
  const outputGasAsset = getGasFeeAssetForAsset(outputAsset);

  const { data: tokenPrices, isLoading: tokenPricesLoading } = useTokenPrices(
    [inputGasAsset, outputGasAsset, inputAsset, outputAsset].filter(Boolean) as AssetEntity[],
  );

  const { data: gasPriceRates, isLoading: priceRatesLoading } = useGetGasPriceRatesQuery();
  const [inputChainInfo, outputChainInfo] = useMemo(() => {
    const inputChainInfo = gasPriceRates?.find(({ asset }) =>
      asset.includes(inputGasAsset?.L1Chain),
    );
    const outputChainInfo = gasPriceRates?.find(({ asset }) =>
      asset.includes(outputGasAsset?.L1Chain),
    );

    return [inputChainInfo, outputChainInfo];
  }, [gasPriceRates, inputGasAsset?.L1Chain, outputGasAsset?.L1Chain]);

  const inputFee = useAssetNetworkFee({ asset: inputGasAsset, type, chainInfo: inputChainInfo });
  const outputFee = useAssetNetworkFee({ asset: outputGasAsset, type, chainInfo: outputChainInfo });

  const findTokenPrice = useCallback(
    (asset: AssetEntity) =>
      tokenPrices?.find(({ identifier }) => identifier === parseAssetToToken(asset)?.identifier)
        ?.price_usd || 0,
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
    const inputFeePrice = new BigNumber(inputGasAssetUSDPrice).multipliedBy(
      inputFee.amount.assetAmount,
    );

    const outputFeePrice = new BigNumber(outputGasAssetUSDPrice).multipliedBy(
      outputFee.amount.assetAmount,
    );

    return outputGasAsset && inputGasAsset
      ? `$${inputFeePrice.plus(outputFeePrice).toFixed(2)}`
      : inputGasAsset
      ? `$${inputFeePrice.toFixed(2)}`
      : '';
  }, [
    inputFee.amount.assetAmount,
    inputGasAsset,
    inputGasAssetUSDPrice,
    outputFee.amount.assetAmount,
    outputGasAsset,
    outputGasAssetUSDPrice,
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

export const getSumAmountInUSD = (
  assetAmount1: AssetAmount | null,
  assetAmount2: AssetAmount | null,
  pools: Pool[],
) => {
  const assetAmount1InUSD = assetAmount1?.totalPriceIn(USDAsset, pools);
  const assetAmount2InUSD = assetAmount2?.totalPriceIn(USDAsset, pools);
  const decimal = assetAmount1?.asset.decimal || 8;

  if (assetAmount1InUSD && assetAmount2InUSD) {
    const sum = assetAmount1InUSD.raw().plus(assetAmount2InUSD.raw());

    return Amount.fromAssetAmount(sum, decimal).toFixed(2);
  }

  return (
    assetAmount1InUSD?.toCurrencyFormat(2) ||
    assetAmount2InUSD?.toCurrencyFormat(2) ||
    Amount.fromAssetAmount(0, decimal).toFixed(2)
  );
};
