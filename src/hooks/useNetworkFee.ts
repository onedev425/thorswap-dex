import {
  Amount,
  Asset,
  AssetAmount,
  getNetworkFeeByAsset,
  Pool,
} from '@thorswap-lib/multichain-sdk';
import { Chain } from '@thorswap-lib/types';
import { getGasRateByFeeOption } from 'helpers/networkFee';
import { useCallback } from 'react';
import { useApp } from 'store/app/hooks';
import { useMidgard } from 'store/midgard/hooks';

type CalculatedFeeParams = {
  inboundAsset: Asset;
  inboundFee: AssetAmount;
  inputAsset: Asset;
  outboundAsset: Asset;
  outboundFee: AssetAmount;
};

const useCalculateFee = () => {
  const { pools } = useMidgard();

  const calculateFee = useCallback(
    ({ outboundAsset, inboundAsset, inboundFee, inputAsset, outboundFee }: CalculatedFeeParams) => {
      if (!outboundAsset.eq(inboundAsset)) return inboundFee;

      const outboundFeeInSendAsset = new AssetAmount(
        inboundAsset,
        Amount.fromAssetAmount(
          outboundFee.totalPriceIn(inboundAsset, pools).price,
          inputAsset.decimal,
        ),
      );

      if (inboundAsset.eq(inputAsset)) {
        return inboundFee.add(outboundFeeInSendAsset);
      }

      const inboundFeeInSendAsset = new AssetAmount(
        inboundAsset,
        Amount.fromAssetAmount(
          inboundFee.totalPriceIn(inboundAsset, pools).price,
          inputAsset.decimal,
        ),
      );

      return inboundFeeInSendAsset.add(outboundFeeInSendAsset);
    },
    [pools],
  );

  return calculateFee;
};

const getFeeAssetForAsset = (asset: Asset) => {
  if (asset.isSynth) return Asset.RUNE();

  switch (asset.L1Chain) {
    case Chain.Ethereum:
      return Asset.ETH();
    case Chain.Binance:
      return Asset.BNB();
    default:
      return asset;
  }
};

export const useNetworkFee = ({
  inputAsset,
  outputAsset,
}: {
  inputAsset: Asset;
  outputAsset?: Asset;
}) => {
  const calculateFee = useCalculateFee();
  const { feeOptionType } = useApp();
  const { inboundGasRate, pools } = useMidgard();

  const getNetworkFee = useCallback(
    (gasRate: number, direction: 'inbound' | 'outbound' = 'inbound') =>
      getNetworkFeeByAsset({
        asset: direction === 'inbound' ? inputAsset : outputAsset || inputAsset,
        gasRate,
        direction,
      }),
    [inputAsset, outputAsset],
  );

  const gasRate = inboundGasRate[(outputAsset || inputAsset).L1Chain];
  const feeGasRate = getGasRateByFeeOption({ gasRate, feeOptionType });

  const inboundFee = getNetworkFee(feeGasRate, 'inbound');
  const outboundFee = getNetworkFee(feeGasRate, 'outbound');

  return {
    inboundFee,
    outboundFee,
    totalFeeInUSD: calculateFee({
      inboundAsset: getFeeAssetForAsset(inputAsset),
      outboundAsset: getFeeAssetForAsset(inputAsset || outputAsset),
      inputAsset,
      outboundFee,
      inboundFee,
    }).totalPriceIn(Asset.USD(), pools),
  };
};

export const getSumAmountInUSD = (
  assetAmount1: AssetAmount | null,
  assetAmount2: AssetAmount | null,
  pools: Pool[],
) => {
  const assetAmount1InUSD = assetAmount1?.totalPriceIn(Asset.USD(), pools);
  const assetAmount2InUSD = assetAmount2?.totalPriceIn(Asset.USD(), pools);

  if (assetAmount1 === null && assetAmount2InUSD) return assetAmount2InUSD.toCurrencyFormat(2);
  if (assetAmount2 === null && assetAmount1InUSD) return assetAmount1InUSD.toCurrencyFormat(2);

  if (assetAmount1InUSD && assetAmount2InUSD) {
    const sum = assetAmount1InUSD.raw().plus(assetAmount2InUSD.raw());

    return Amount.fromAssetAmount(sum, assetAmount1?.asset.decimal || 8).toFixed(2);
  }

  return Amount.fromAssetAmount(0, assetAmount1?.asset.decimal || 8).toFixed();
};
