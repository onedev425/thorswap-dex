import { Amount, AssetEntity as Asset, Price } from '@thorswap-lib/swapkit-core';
import { useCallback, useState } from 'react';
import { SORTED_LENDING_COLLATERAL_ASSETS } from 'settings/chain';
import { useMidgard } from 'store/midgard/hooks';
import { useLazyGetLoansQuery } from 'store/thorswap/api';
import { useWallet } from 'store/wallet/hooks';

import { LoanPosition } from './types';

export const useLoans = () => {
  const { wallet, isWalletLoading } = useWallet();
  const { pools: periodPools } = useMidgard();
  const pools = periodPools['7d'];
  const [loans, setLoans] = useState<LoanPosition[] | null>(null);
  const [fetchLoans] = useLazyGetLoansQuery();
  const [isLoading, setIsLoading] = useState(false);

  const getLoanPosition = useCallback(
    async (asset: Asset): Promise<LoanPosition | null> => {
      const address = wallet?.[asset.L1Chain]?.address || '';
      if (address) {
        const { data } = await fetchLoans({
          asset: `${asset.chain}.${asset.ticker}`,
          address,
        });

        const collateralDeposited = Amount.fromMidgard(data?.collateral_deposited);
        const collateralWithdrawn = Amount.fromMidgard(data?.collateral_withdrawn);
        const collateralCurrent = Amount.fromMidgard(data?.collateral_current);
        const debtIssued = Amount.fromMidgard(data?.debt_issued);
        const debtRepaid = Amount.fromMidgard(data?.debt_repaid);
        const debtCurrent = Amount.fromMidgard(data?.debt_current);

        return collateralCurrent.gt(0)
          ? {
              asset,
              collateralCurrent,
              collateralDeposited,
              collateralWithdrawn,
              debtCurrent,
              debtIssued,
              debtRepaid,
              lastOpenHeight: data?.last_open_height || 0,
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

  const totalCollateral = loans?.reduce(
    (sum, obj) =>
      sum +
      parseFloat(
        new Price({
          baseAsset: obj.asset,
          pools,
          priceAmount: obj.collateralCurrent,
        }).toFixedRaw(2),
      ),
    0,
  );

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
