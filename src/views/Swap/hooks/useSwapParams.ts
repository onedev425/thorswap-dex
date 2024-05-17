import type { AssetValue } from '@swapkit/core';
import { BaseDecimal, SwapKitNumber } from '@swapkit/core';
import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from 'store/app/hooks';

type Props = {
  selectedRoute?: RouteWithApproveType;
  noPriceProtection: boolean;
  inputAmount: SwapKitNumber;
  outputAsset: AssetValue;
  isChainflip?: boolean;
  noSlipProtection?: boolean;
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
  isChainflip,
  noSlipProtection,
}: Props) => {
  const isDexAgg = useMemo(
    () =>
      selectedRoute?.calldata?.memo ? selectedRoute.calldata.memo.split(':').length >= 8 : false,
    [selectedRoute?.calldata?.memo],
  );
  const [streamSwap, setStreamSwap] = useState(false);
  const [streamingSwapParams, setStreamingSwapParams] = useState<null | StreamSwapParams>(null);
  const hasStreamingSettings =
    selectedRoute?.streamingSwap?.maxQuantity &&
    selectedRoute?.streamingSwap?.maxIntervalForMaxQuantity;

  const { setSlippage, slippageTolerance } = useApp();

  const canStreamSwap = useMemo(
    () => !noPriceProtection && !!selectedRoute?.calldata?.memoStreamingSwap,
    [noPriceProtection, selectedRoute?.calldata?.memoStreamingSwap],
  );

  const toggleStreamSwap = useCallback(
    (enabled: boolean) => setStreamSwap(enabled && !!canStreamSwap),
    [canStreamSwap],
  );

  //   useEffect(() => {
  //     // reset stream swap state only when path changed
  //     toggleStreamSwap(!!selectedRoute?.path);
  //     setStreamingSwapParams(null);
  //   }, [selectedRoute?.path, toggleStreamSwap]);

  const defaultInterval = useMemo(() => {
    const limit = getMemoPart(selectedRoute?.calldata?.memoStreamingSwap, 3);
    if (!limit) {
      return 3;
    }

    return Number(limit.split('/')[1]) || 3;
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

  //   useEffect(() => {
  //     if (isDexAgg) {
  //       //   setSlippage(selectedRoute?.meta?.slippagePercentage || 0);
  //       return;
  //     }

  //     // update default slippage when path changed
  //     if (!selectedRoute) {
  //       return;
  //     }

  //     const maxOutputAmount = new SwapKitNumber({
  //       value: streamSwap
  //         ? selectedRoute.streamingSwap?.expectedOutput || 0
  //         : selectedRoute.expectedOutput,
  //       decimal: outputAsset.decimal,
  //     });

  //     if (maxOutputAmount.lte(0)) {
  //       return;
  //     }

  //     const expectedOutputSlippage = streamSwap
  //       ? selectedRoute?.streamingSwap?.expectedOutputMaxSlippage
  //       : selectedRoute?.expectedOutputMaxSlippage ||
  //         // @ts-expect-error wrong typing on expectedBuyAmountMaxSlippage
  //         selectedRoute?.expectedBuyAmountMaxSlippage ||
  //         selectedRoute?.expectedOutput;

  //     const defaultSlippage = new SwapKitNumber({
  //       value: expectedOutputSlippage || 0,
  //       decimal: outputAsset.decimal,
  //     })
  //       .div(maxOutputAmount)
  //       .getValue('number');

  //     // const slipPercent = Math.round(100 - (defaultSlippage * 10000) / 100);

  //     // setSlippage(slipPercent === 100 ? 0 : slipPercent);
  //   }, [
  //     outputAsset.decimal,
  //     selectedRoute?.path,
  //     selectedRoute?.providers,
  //     streamSwap,
  //     isDexAgg,
  //     selectedRoute,
  //     setSlippage,
  //   ]);
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
    return outputAmount.mul(1 - (isChainflip ? 5 : slippageTolerance) / 100);
  }, [outputAmount, slippageTolerance, isChainflip]);

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
  }, [streamingSwapParams, toggleStreamSwap]);

  const route = useMemo(() => {
    // do not update slippage for dex agg
    if (!selectedRoute || isDexAgg) {
      return selectedRoute;
    }

    const memoMinAmount = slippageTolerance
      ? // convert to 8 decimals TC value
        SwapKitNumber.shiftDecimals({
          value: minReceive,
          from: outputAsset.decimal || BaseDecimal.THOR,
          to: BaseDecimal.THOR,
        })
          .getValue('bigint')
          .toString()
      : '0';

    const updatedStreamingSwapMemo = updateMemoLimit(selectedRoute.calldata?.memoStreamingSwap, {
      minAmount: memoMinAmount,
      interval: streamingSwapParams?.interval,
      subswaps: streamingSwapParams?.subswaps,
    });

    // @ts-expect-error TODO fix typing v2 quotes
    const updatedMemo = updateMemoLimit(selectedRoute.calldata?.memo || selectedRoute.memo, {
      minAmount: noSlipProtection ? '' : memoMinAmount,
    });

    const calldata = streamSwap
      ? { ...selectedRoute?.calldata, memoStreamingSwap: updatedStreamingSwapMemo }
      : { ...selectedRoute?.calldata, memo: updatedMemo };

    return {
      ...selectedRoute,
      memo: updatedMemo,
      calldata,
    };
  }, [
    selectedRoute,
    isDexAgg,
    slippageTolerance,
    minReceive,
    outputAsset.decimal,
    streamingSwapParams?.interval,
    streamingSwapParams?.subswaps,
    streamSwap,
    noSlipProtection,
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
    slippagePercent: slippageTolerance,
    setSlippagePercent: setSlippage,
    defaultInterval,
  };
};

export function updateMemoLimit(
  memo: string,
  { minAmount, interval, subswaps }: { minAmount?: string; interval?: number; subswaps?: number },
) {
  const memoParts = memo?.split(':');
  const memoLimitIndex = 3;

  if (!memoParts || memoParts?.length < memoLimitIndex + 1) {
    return memo;
  }

  const isStreamingSwapLimit = memoParts[memoLimitIndex].includes('/');

  const initialLimitValue = memoParts[memoLimitIndex];

  if (isStreamingSwapLimit) {
    const updatedLimit = minAmount || initialLimitValue.split('/')[0];
    const updatedInterval = interval || initialLimitValue.split('/')[1];
    const updatedSubswaps = subswaps || initialLimitValue.split('/')[2];

    memoParts[memoLimitIndex] = `${updatedLimit || '0'}/${updatedInterval || '0'}/${
      updatedSubswaps || '0'
    }`;
  } else {
    memoParts[memoLimitIndex] = minAmount || '0';
  }

  return memoParts.join(':');
}

export function getMemoPart(memo?: string, partNumber?: number) {
  if (!memo || !partNumber) {
    return null;
  }

  const memoParts = memo.split(':');
  return memoParts[partNumber];
}
