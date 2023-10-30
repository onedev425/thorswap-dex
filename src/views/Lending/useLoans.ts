import type { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Amount } from '@thorswap-lib/swapkit-core';
import BigNumber from 'bignumber.js';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useMemo, useState } from 'react';
import { SORTED_LENDING_COLLATERAL_ASSETS } from 'settings/chain';
import { useLazyGetLoansQuery } from 'store/thorswap/api';
import { useWallet } from 'store/wallet/hooks';

import type { LoanPosition } from './types';

export const useLoans = () => {
  const { wallet, isWalletLoading } = useWallet();

  const [loans, setLoans] = useState<LoanPosition[] | null>(null);
  const [fetchLoans] = useLazyGetLoansQuery();
  const [isLoading, setIsLoading] = useState(false);

  const loansAssets = useMemo(() => loans?.map((loan) => loan.asset) || [], [loans]);
  const { isLoading: tokenPricesLoading, data: tokenPrices } = useTokenPrices(loansAssets);

  const totalCollateral = useMemo(() => {
    if (tokenPricesLoading) return BigNumber(0);

    return loans?.reduce(
      (sum, { asset, collateralCurrent }) =>
        sum.plus(
          BigNumber(
            tokenPrices[asset.toString()]?.price_usd * collateralCurrent.assetAmount.toNumber(),
          ),
        ),
      BigNumber(0),
    );
  }, [loans, tokenPrices, tokenPricesLoading]);

  const getLoanPosition = useCallback(
    async (asset: Asset): Promise<LoanPosition | null> => {
      const address = wallet?.[asset.L1Chain]?.address || '';
      if (address) {
        const { data } = await fetchLoans({
          asset: `${asset.chain}.${asset.ticker}`,
          address,
        });

        const collateralDeposited = Amount.fromAssetAmount(
          data?.collateralDeposited || '0',
          asset.decimal,
        );
        const collateralWithdrawn = Amount.fromAssetAmount(
          data?.collateralWithdrawn || '0',
          asset.decimal,
        );
        const collateralCurrent = Amount.fromAssetAmount(
          data?.collateralCurrent || '0',
          asset.decimal,
        );
        const debtIssued = Amount.fromAssetAmount(data?.debtIssued || '0', 8);
        const debtRepaid = Amount.fromAssetAmount(data?.debtRepaid || '0', 8);
        const debtCurrent = Amount.fromAssetAmount(data?.debtCurrent || '0', 8);

        return collateralCurrent.gt(0)
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
    [fetchLoans, wallet],
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
    Amount.fromMidgard(0),
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
