import type { AssetValue } from '@swapkit/core';
import { BaseDecimal, SwapKitNumber } from '@swapkit/core';
import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IS_PROD } from 'settings/config';
import { useApp } from 'store/app/hooks';

type Props = {
  selectedRoute?: RouteWithApproveType;
  noPriceProtection: boolean;
  inputAmount: SwapKitNumber;
  outputAsset: AssetValue;
};

export type StreamSwapParams = {
  subswaps: number;
  interval: number;
};

export const useSwapParams = ({
  selectedRoute,
  noPriceProtection,
  inputAmount,
  outputAsset,
}: Props) => {
  const { slippageTolerance } = useApp();
  const [streamSwap, setStreamSwap] = useState(false);
  const [streamingSwapParams, setStreamingSwapParams] = useState<null | StreamSwapParams>(null);
  const hasStreamingSettings =
    selectedRoute?.streamingSwap?.maxQuantity &&
    selectedRoute?.streamingSwap?.maxIntervalForMaxQuantity &&
    // TODO: remove, feature flag for prod
    !IS_PROD;

  const [slippagePercent, setSlippagePercent] = useState(slippageTolerance);

  const canStreamSwap = useMemo(
    () => !noPriceProtection && !!selectedRoute?.calldata?.memoStreamingSwap,
    [noPriceProtection, selectedRoute?.calldata?.memoStreamingSwap],
  );

  const toggleStreamSwap = useCallback(
    (enabled: boolean) => setStreamSwap(enabled && !!canStreamSwap),
    [canStreamSwap],
  );

  useEffect(() => {
    // reset stream swap state only when path changed
    toggleStreamSwap(!!selectedRoute?.path);
    setStreamingSwapParams(null);
  }, [hasStreamingSettings, canStreamSwap, selectedRoute?.path, toggleStreamSwap]);

  const defaultInterval = useMemo(() => {
    return Number(selectedRoute?.calldata?.memoStreamingSwap?.match(/\/([0-9]+)\//)?.[1] || 3) || 3;
  }, [selectedRoute?.calldata?.memoStreamingSwap]);

  const streamingValue = useMemo(() => {
    const optimalStreamingValue = new SwapKitNumber({
      value: selectedRoute?.streamingSwap?.expectedOutput || 0,
      decimal: outputAsset.decimal,
    });

    if (!streamingSwapParams) {
      return optimalStreamingValue;
    }

    if (streamingSwapParams.subswaps === 0 || !streamSwap) {
      return new SwapKitNumber({ value: 0, decimal: outputAsset.decimal });
    }

    const optimizationRatio = selectedRoute?.streamingSwap?.maxQuantity
      ? streamingSwapParams.subswaps / selectedRoute?.streamingSwap?.maxQuantity
      : 1;

    const optimalSavings = new SwapKitNumber({
      value: selectedRoute?.streamingSwap?.savingsInAsset || 0,
      decimal: outputAsset.decimal,
    });
    const partialSavings = optimalSavings.mul(optimizationRatio);
    const savingsDiff = optimalSavings.sub(partialSavings);

    return optimalStreamingValue.sub(savingsDiff);
  }, [
    outputAsset.decimal,
    selectedRoute?.streamingSwap?.expectedOutput,
    selectedRoute?.streamingSwap?.maxQuantity,
    selectedRoute?.streamingSwap?.savingsInAsset,
    streamSwap,
    streamingSwapParams,
  ]);

  // calculate based on params
  const outputAmount = useMemo(() => {
    const regularValue = new SwapKitNumber({
      value: selectedRoute?.expectedOutput || 0,
      decimal: outputAsset.decimal,
    });

    if (!selectedRoute || inputAmount.getValue('number') === 0) {
      return new SwapKitNumber({ value: 0, decimal: outputAsset.decimal });
    }

    return streamSwap && streamingValue.gt(0) ? streamingValue : regularValue;
  }, [selectedRoute, outputAsset.decimal, inputAmount, streamSwap, streamingValue]);

  useEffect(() => {
    // update default slippage when path changed
    if (!selectedRoute) {
      setSlippagePercent(slippageTolerance);
      return;
    }

    const maxOutputAmount = new SwapKitNumber({
      value: streamSwap
        ? selectedRoute.streamingSwap?.expectedOutput || 0
        : selectedRoute.expectedOutput,
      decimal: outputAsset.decimal,
    });

    const expectedOutputSlippage = streamSwap
      ? selectedRoute?.streamingSwap?.expectedOutputMaxSlippage
      : selectedRoute?.expectedOutputMaxSlippage;

    const defaultSlippage = new SwapKitNumber({
      value: expectedOutputSlippage || 0,
      decimal: outputAsset.decimal,
    })
      .div(maxOutputAmount)
      .toFixed(2);
    const slipPercent = 100 - Number(defaultSlippage) * 100;

    setSlippagePercent(slipPercent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputAsset.decimal, selectedRoute?.path]);

  const savingsInUSD = useMemo(() => {
    const savingsValue = Number(selectedRoute?.streamingSwap?.savingsInUSD || 0);
    if (!streamingSwapParams) {
      return savingsValue;
    }

    if (streamingSwapParams.subswaps === 0 || !streamSwap) {
      return 0;
    }

    const optimizationRatio = selectedRoute?.streamingSwap?.maxQuantity
      ? streamingSwapParams.subswaps / selectedRoute?.streamingSwap?.maxQuantity
      : 1;

    return savingsValue * optimizationRatio;
  }, [
    selectedRoute?.streamingSwap?.maxQuantity,
    selectedRoute?.streamingSwap?.savingsInUSD,
    streamSwap,
    streamingSwapParams,
  ]);

  const minReceive = useMemo(() => {
    return outputAmount.mul(1 - slippagePercent / 100);
  }, [outputAmount, slippagePercent]);

  const fees = useMemo(() => {
    if (streamSwap && selectedRoute?.streamingSwap?.fees) {
      return selectedRoute?.fees
        ? { ...selectedRoute.fees, ...selectedRoute.streamingSwap.fees }
        : selectedRoute.streamingSwap.fees;
    }

    return selectedRoute?.fees;
  }, [selectedRoute?.fees, selectedRoute?.streamingSwap?.fees, streamSwap]);

  useEffect(() => {
    if (!streamingSwapParams) {
      return;
    }

    toggleStreamSwap(!!streamingSwapParams.subswaps);
  }, [streamSwap, streamingSwapParams, toggleStreamSwap]);

  const route = useMemo(() => {
    if (!selectedRoute) {
      return selectedRoute;
    }

    let updatedStreamingSwapMemo = selectedRoute?.calldata.memoStreamingSwap;

    if (streamingSwapParams && streamSwap) {
      const { interval, subswaps } = streamingSwapParams;
      // replace interval and subswaps if they are set
      updatedStreamingSwapMemo = updatedStreamingSwapMemo?.replace(
        /\/([0-9]+)\/([0-9]+):/,
        `/${interval}/${subswaps}:`,
      );
    }

    // replace min receive
    updatedStreamingSwapMemo = updatedStreamingSwapMemo?.replace(
      /:([0-9]+)\//,
      `:${
        slippagePercent
          ? // convert to 8 decimals TC value
            SwapKitNumber.shiftDecimals({
              value: minReceive,
              from: outputAsset.decimal || BaseDecimal.THOR,
              to: BaseDecimal.THOR,
            }).getValue('bigint')
          : '0'
      }/`,
    );

    const updatedMemo = selectedRoute.calldata.memo?.replace(
      /:([0-9]+):/,
      `:${
        slippagePercent
          ? // convert to 8 decimals TC value
            SwapKitNumber.shiftDecimals({
              value: minReceive,
              from: outputAsset.decimal || BaseDecimal.THOR,
              to: BaseDecimal.THOR,
            }).getValue('bigint')
          : '0'
      }:`,
    );

    const calldata = streamSwap
      ? { ...selectedRoute.calldata, memoStreamingSwap: updatedStreamingSwapMemo }
      : { ...selectedRoute.calldata, memo: updatedMemo };

    return {
      ...selectedRoute,
      calldata,
    };
  }, [
    minReceive,
    outputAsset.decimal,
    selectedRoute,
    streamSwap,
    slippagePercent,
    streamingSwapParams,
  ]);

  return {
    streamSwap,
    toggleStreamSwap,
    canStreamSwap,
    minReceive,
    outputAmount,
    fees,
    streamingSwapParams,
    setStreamingSwapParams,
    route,
    hasStreamingSettings,
    savingsInUSD,
    slippagePercent,
    setSlippagePercent,
    defaultInterval,
  };
};
