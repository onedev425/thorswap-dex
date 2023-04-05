import {
  Amount,
  AssetAmount,
  AssetEntity as Asset,
  getSignatureAssetFor,
  Pool,
} from '@thorswap-lib/swapkit-core';
import { Chain, FeeOption } from '@thorswap-lib/types';
import { USDAsset } from 'helpers/assets';
import { getGasRateByFeeOption, getNetworkFeeByAsset } from 'helpers/networkFee';
import { useCallback } from 'react';
import { useMidgard } from 'store/midgard/hooks';

type CalculatedFeeParams = {
  inboundAsset: Asset;
  inboundFee: AssetAmount;
  inputAsset: Asset;
  outboundAsset?: Asset;
  outboundFee: AssetAmount;
};

const useCalculateFee = () => {
  const { pools } = useMidgard();

  const calculateFee = useCallback(
    ({ outboundAsset, inboundAsset, inboundFee, inputAsset, outboundFee }: CalculatedFeeParams) => {
      if (!outboundAsset?.eq(inboundAsset)) return inboundFee;

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
  if (asset.isSynth) return getSignatureAssetFor(Chain.THORChain);

  switch (asset.L1Chain) {
    case Chain.Ethereum:
    case Chain.Binance:
    case Chain.Avalanche:
      return getSignatureAssetFor(asset.L1Chain);
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

  const chainAsset = (outputAsset?.isRUNE() ? inputAsset : outputAsset || inputAsset).L1Chain;

  const gasRate = `${parseInt(inboundGasRate[chainAsset] || '0') + 0.01}`;
  const feeGasRate = getGasRateByFeeOption({ gasRate, feeOptionType: FeeOption.Fast });

  const inboundFee = getNetworkFee(feeGasRate, 'inbound');
  const outboundFee = getNetworkFee(outputAsset ? feeGasRate : 0, 'outbound');

  return {
    inboundFee,
    outboundFee,
    totalFeeInUSD: calculateFee({
      inboundAsset: getFeeAssetForAsset(inputAsset),
      outboundAsset: outputAsset ? getFeeAssetForAsset(outputAsset) : undefined,
      inputAsset,
      outboundFee,
      inboundFee,
    }).totalPriceIn(USDAsset, pools),
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
