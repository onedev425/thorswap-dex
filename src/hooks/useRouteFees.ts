import { QuoteRoute } from '@thorswap-lib/swapkit-core';
import { useMemo } from 'react';

export const useRouteFees = (routeFees: QuoteRoute['fees']) => {
  const data = useMemo(() => {
    const emptyData = { firstNetworkFee: 0, affiliateFee: 0, networkFee: 0, totalFee: 0 };
    const feesData = Object.values(routeFees || {}).flat();
    if (feesData.length === 0) return emptyData;

    const { networkFee, affiliateFee } = feesData.reduce(
      (acc, { affiliateFeeUSD, networkFeeUSD }) => {
        acc.affiliateFee += affiliateFeeUSD;
        acc.networkFee += networkFeeUSD;

        return acc;
      },
      emptyData,
    );

    return {
      firstNetworkFee: feesData?.[0]?.networkFeeUSD || 0,
      affiliateFee,
      networkFee,
      totalFee: affiliateFee + networkFee,
    };
  }, [routeFees]);

  return data;
};
