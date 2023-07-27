import { Amount, AssetEntity, isGasAsset } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { getAssetBalance } from 'helpers/wallet';
import { getMultiplierForAsset, getNetworkFee, parseFeeToAssetAmount } from 'hooks/useNetworkFee';
import { useCallback } from 'react';
import { useAppSelector } from 'store/store';
import { useGetGasPriceRatesQuery } from 'store/thorswap/api';

export const useBalance = (skipFees?: boolean) => {
  const { data: gasPriceRates } = useGetGasPriceRatesQuery(undefined, { skip: skipFees });
  const feeOptionType = useAppSelector(({ app: { feeOptionType } }) => feeOptionType);
  const wallet = useAppSelector(({ wallet }) => wallet.wallet);

  const isWalletAssetConnected = useCallback(
    (asset: AssetEntity) => !!wallet?.[asset.L1Chain as Chain],
    [wallet],
  );

  const isWalletConnected = useCallback((chain: Chain) => !!wallet?.[chain], [wallet]);

  const getMaxBalance = useCallback(
    (asset: AssetEntity) => {
      const { L1Chain, decimal } = asset;
      if (!wallet?.[L1Chain as Chain]) return Amount.fromAssetAmount(10 ** 8, decimal);

      const chainInfo = gasPriceRates?.find(({ asset }) => asset.includes(L1Chain));
      const gasRate = getNetworkFee({
        gasPrice: chainInfo?.gasAsset || 0,
        feeOptionType,
        multiplier: getMultiplierForAsset(asset),
      });

      const networkFee = parseFeeToAssetAmount({ gasRate, asset });

      const { amount } = getAssetBalance(asset, wallet);

      const maxSpendableAmount = isGasAsset(asset) ? amount.sub(networkFee) : amount;

      return maxSpendableAmount.gt(0) ? maxSpendableAmount : Amount.fromAssetAmount(0, decimal);
    },
    [wallet, gasPriceRates, feeOptionType],
  );

  return { isWalletAssetConnected, isWalletConnected, getMaxBalance, wallet };
};
