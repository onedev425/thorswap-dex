import { Amount, AssetEntity as Asset, Price } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { useCallback, useState } from 'react';
import { SORTED_LENDING_COLLATERAL_ASSETS } from 'settings/chain';
import { useMidgard } from 'store/midgard/hooks';
import { useLazyGetLoansQuery } from 'store/thorswap/api';
import { useWallet } from 'store/wallet/hooks';

import { LoanPosition } from './types';

export const useLoans = () => {
  const { wallet, isWalletLoading } = useWallet();
  const { pools } = useMidgard();
  const [loans, setLoans] = useState<Partial<Record<Chain, LoanPosition>>>({});
  const [fetchLoans] = useLazyGetLoansQuery();

  const getLoanPosition = useCallback(
    async (asset: Asset) => {
      const address = wallet?.[asset.L1Chain]?.address || '';
      if (address) {
        const { data } = await fetchLoans({
          asset: `${asset.chain}.${asset.ticker}`,
          address,
        });

        const collateralUp = Amount.fromMidgard(data?.collateral_up);
        const collateralDown = Amount.fromMidgard(data?.collateral_down);
        const collateralRemaining = collateralUp.sub(collateralDown);
        const debtDown = Amount.fromMidgard(data?.debt_down);
        const debtUp = Amount.fromMidgard(data?.debt_up);

        return collateralRemaining.gt(0)
          ? ({
              asset,
              collateralUp,
              collateralDown,
              collateralRemaining,
              debtDown,
              debtUp,
              ltv: 0,
            } as LoanPosition)
          : null;
      }

      return null;
    },
    [fetchLoans, wallet],
  );

  const refreshLoans = useCallback(async () => {
    if (isWalletLoading) return;

    let loans: Partial<Record<Chain, LoanPosition>> = {};
    for (let asset of SORTED_LENDING_COLLATERAL_ASSETS) {
      const result = await getLoanPosition(asset);
      if (result !== null) {
        loans[asset.chain] = result;
      }
    }

    setLoans(loans);
  }, [getLoanPosition, isWalletLoading]);

  const totalCollateral = Object.values(loans).reduce(
    (sum, obj) =>
      sum +
      parseFloat(
        new Price({
          baseAsset: obj.asset,
          pools,
          priceAmount: obj.collateralUp.sub(obj.collateralDown),
        }).toFixedRaw(2),
      ),
    0,
  );

  const totalBorrowed = Object.values(loans).reduce(
    (sum, obj) => sum.add(obj.debtUp).sub(obj.debtDown),
    Amount.fromMidgard(0),
  );

  const loansData: LoanPosition[] = Object.entries(loans).map(([_, values]) => values);

  return {
    refreshLoans,
    loans,
    totalCollateral,
    totalBorrowed,
    loansData,
  };
};
