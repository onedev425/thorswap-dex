import { AssetValue, SwapKitNumber } from '@swapkit/core';
import { useWallet } from 'context/wallet/hooks';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useMemo, useState } from 'react';
import { SORTED_LENDING_COLLATERAL_ASSETS } from 'settings/chain';
import { useLazyGetLoansQuery } from 'store/thorswap/api';

import type { LoanPosition } from './types';

export const useLoans = () => {
  const { getWalletAddress, isWalletLoading } = useWallet();

  const [loans, setLoans] = useState<LoanPosition[] | null>(null);
  const [fetchLoans] = useLazyGetLoansQuery();
  const [isLoading, setIsLoading] = useState(false);

  const loansAssets = useMemo(() => loans?.map((loan) => loan.asset) || [], [loans]);
  const { isLoading: tokenPricesLoading, data: tokenPrices } = useTokenPrices(loansAssets);

  const totalCollateral = useMemo(() => {
    if (tokenPricesLoading) return new SwapKitNumber(0);

    return loans?.reduce((sum, { asset, collateralCurrent }) => {
      const tokenPrice = tokenPrices[asset.toString()]?.price_usd || 0;
      const collateral = Number(collateralCurrent.toFixed(2)) || 0;
      return sum.add(new SwapKitNumber(tokenPrice).mul(collateral));
    }, new SwapKitNumber(0));
  }, [loans, tokenPrices, tokenPricesLoading]);

  const getLoanPosition = useCallback(
    async (asset: AssetValue): Promise<LoanPosition | null> => {
      const address = getWalletAddress(asset.chain);
      if (address) {
        const { data } = await fetchLoans({
          asset: `${asset.chain}.${asset.ticker}`,
          address,
        });

        const collateralDeposited = AssetValue.fromStringSync(
          asset.toString(),
          data?.collateralDeposited || '0',
        )!;
        const collateralWithdrawn = AssetValue.fromStringSync(
          asset.toString(),
          data?.collateralWithdrawn || '0',
        )!;
        const collateralCurrent = AssetValue.fromStringSync(
          asset.toString(),
          data?.collateralCurrent || '0',
        )!;
        const debtIssued = new SwapKitNumber({ value: data?.debtIssued || '0', decimal: 8 });
        const debtRepaid = new SwapKitNumber({ value: data?.debtRepaid || '0', decimal: 8 });
        const debtCurrent = new SwapKitNumber({ value: data?.debtCurrent || '0', decimal: 8 });

        return debtCurrent
          ? {
              asset,
              collateralCurrent,
              collateralDeposited,
              collateralWithdrawn,
              debtCurrent,
              debtIssued,
              debtRepaid,
              lastOpenHeight: data?.lastOpenHeight || 0,
              ltvPercentage: data?.ltvPercentage,
            }
          : null;
      }

      return null;
    },
    [fetchLoans, getWalletAddress],
  );

  const refreshLoans = useCallback(async () => {
    if (isWalletLoading) return;

    setIsLoading(true);

    const promises = SORTED_LENDING_COLLATERAL_ASSETS.map(getLoanPosition);
    const res = await Promise.allSettled(promises);

    const loadedLoans = res.reduce((acc, result) => {
      if ('value' in result && result.value !== null) {
        return [...acc, result.value];
      }

      return acc;
    }, [] as LoanPosition[]);

    setLoans(loadedLoans);
    setIsLoading(false);
  }, [getLoanPosition, isWalletLoading]);

  const totalBorrowed = loans?.reduce(
    (sum, obj) => sum.add(obj.debtCurrent),
    SwapKitNumber.fromBigInt(0n, 8),
  );

  return {
    refreshLoans,
    loans,
    totalCollateral,
    totalBorrowed,
    loansData: loans || [],
    isLoading,
  };
};
