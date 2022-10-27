import { Amount, Asset, getNetworkFeeByAsset } from '@thorswap-lib/multichain-core';
import { SupportedChain } from '@thorswap-lib/types';
import { getGasRateByFeeOption } from 'helpers/networkFee';
import { getAssetBalance } from 'helpers/wallet';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'store/store';
import * as walletActions from 'store/wallet/actions';

export const useBalance = () => {
  const dispatch = useAppDispatch();
  const { feeOptionType, wallet, inboundGasRate } = useAppSelector(
    ({ app: { feeOptionType }, wallet: { wallet }, midgard: { inboundGasRate } }) => ({
      wallet,
      inboundGasRate,
      feeOptionType,
    }),
  );

  const reloadBalanceByChain = useCallback(
    (chain: SupportedChain) => {
      dispatch(walletActions.getWalletByChain(chain));
    },
    [dispatch],
  );

  const isWalletAssetConnected = useCallback(
    (asset: Asset) => {
      return !!wallet?.[asset.L1Chain as SupportedChain];
    },
    [wallet],
  );

  const isWalletConnected = useCallback((chain: SupportedChain) => !!wallet?.[chain], [wallet]);

  const getMaxBalance = useCallback(
    (asset: Asset): Amount => {
      const { isGasAsset, L1Chain, decimal } = asset;
      if (!wallet?.[L1Chain as SupportedChain]) return Amount.fromAssetAmount(10 ** 8, decimal);

      const networkFee = getNetworkFeeByAsset({
        asset,
        gasRate: getGasRateByFeeOption({ gasRate: inboundGasRate[L1Chain], feeOptionType }),
        direction: 'outbound',
      });

      const { amount } = getAssetBalance(asset, wallet);
      const maxSpendableAmount = isGasAsset() ? amount.sub(networkFee) : amount;

      return maxSpendableAmount.gt(0) ? maxSpendableAmount : Amount.fromAssetAmount(0, decimal);
    },
    [wallet, inboundGasRate, feeOptionType],
  );

  return {
    isWalletAssetConnected,
    isWalletConnected,
    getMaxBalance,
    reloadBalanceByChain,
    wallet,
  };
};
