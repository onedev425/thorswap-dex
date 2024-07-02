import type { QuoteRoute } from "@swapkit/api";
import { useMemo } from "react";

export const useRouteFees = (routeFees?: QuoteRoute["fees"]) => {
  const data = useMemo(() => {
    const emptyData = {
      outOfPocketFee: 0,
      firstNetworkFee: 0,
      affiliateFee: 0,
      networkFee: 0,
      totalFee: 0,
    };
    const feesData = Object.values(routeFees || {}).flat();
    if (feesData.length === 0) return emptyData;

    const { outOfPocketFee, networkFee, affiliateFee } = feesData.reduce(
      (acc, { affiliateFeeUSD, networkFeeUSD, isOutOfPocket }) => {
        acc.affiliateFee += affiliateFeeUSD;
        acc.networkFee += networkFeeUSD;
        acc.outOfPocketFee += isOutOfPocket ? networkFeeUSD : 0;

        return acc;
      },
      emptyData,
    );

    return {
      firstNetworkFee: feesData?.[0]?.networkFeeUSD || 0,
      affiliateFee,
      networkFee,
      outOfPocketFee,
      totalFee: affiliateFee + networkFee,
    };
  }, [routeFees]);

  return data;
};

export const getOutOfPocketFee = (routeFees: QuoteRoute["fees"]) => {
  const data = Object.values(routeFees || {}).flat();
  if (data.length === 0) return 0;

  const outOfPocketFee = data.reduce((acc, { networkFeeUSD, isOutOfPocket }) => {
    return acc + (isOutOfPocket ? networkFeeUSD : 0);
  }, 0);

  return outOfPocketFee;
};
