import { Amount, AssetAmount, AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { BaseDecimal, Chain, FeeOption } from '@thorswap-lib/types';

const multiplier: Record<FeeOption, number> = {
  average: 0.67,
  fast: 1,
  fastest: 1.5,
};

const getFeeAssetForAsset = (asset: Asset) => {
  if (asset.isSynth) return Asset.RUNE();

  switch (asset.L1Chain) {
    case Chain.Avalanche:
      return Asset.AVAX();
    case Chain.Ethereum:
      return Asset.ETH();
    case Chain.Binance:
      return Asset.BNB();
    default:
      return asset;
  }
};

export const getGasRateByFeeOption = ({
  gasRate,
  feeOptionType,
}: {
  gasRate?: string;
  feeOptionType: FeeOption;
}) => {
  return Number(gasRate || 0) * multiplier[feeOptionType];
};

const gasRateForAsset = (asset: Asset, gasRate: number) => {
  if (asset.isSynth) return 2000000 / 2;

  switch (asset.L1Chain) {
    case Chain.THORChain:
      // we need to compensate the multiplier because TC outbound fee is a fixes 0.02 RUNE
      return 2000000 / 2;
    case Chain.Avalanche:
    case Chain.Ethereum:
      return (gasRate + 10) / 10;
    default:
      return gasRate;
  }
};

const getTxSizeByAsset = (asset: Asset): number => {
  switch (asset.L1Chain) {
    case Chain.Avalanche:
    case Chain.Ethereum:
      return 80000;
    case Chain.BitcoinCash:
      return 1500;
    case Chain.Bitcoin:
    case Chain.Doge:
      return 1000;
    case Chain.Litecoin:
      return 250;
    default:
      return 1;
  }
};

export const getNetworkFeeByAsset = ({
  asset,
  gasRate,
  direction,
}: {
  asset: Asset;
  gasRate: number;
  direction: 'inbound' | 'outbound';
}) => {
  const multiplier = direction === 'inbound' ? 2 / 3 : 2;
  const assetDecimal = BaseDecimal[asset.L1Chain as Chain] || BaseDecimal.THOR;

  return new AssetAmount(
    getFeeAssetForAsset(asset),
    Amount.fromBaseAmount(
      gasRateForAsset(asset, gasRate) * 10 ** (assetDecimal - BaseDecimal.THOR),
      assetDecimal,
    )
      .mul(multiplier)
      .mul(getTxSizeByAsset(asset)),
  );
};
