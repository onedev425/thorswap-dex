import { Amount, Asset, getNetworkFeeByAsset } from '@thorswap-lib/multichain-core';
import { Chain, SupportedChain } from '@thorswap-lib/types';
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

  const reloadAllBalance = useCallback(() => {
    dispatch(walletActions.loadAllWallets());
  }, [dispatch]);

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

      if (!wallet?.[L1Chain as SupportedChain]) {
        return Amount.fromAssetAmount(10 ** 8, decimal);
      }

      // calculate inbound fee
      const gasRate = getGasRateByFeeOption({
        gasRate: inboundGasRate[L1Chain],
        feeOptionType,
      });

      const inboundFee = getNetworkFeeByAsset({
        asset,
        gasRate,
        direction: L1Chain === Chain.THORChain ? 'outbound' : 'inbound',
      });

      const balance = getAssetBalance(asset, wallet).amount;
      const maxSpendableAmount = isGasAsset() ? balance.sub(inboundFee) : balance;

      return maxSpendableAmount.gt(0) ? maxSpendableAmount : Amount.fromAssetAmount(0, decimal);
    },
    [wallet, inboundGasRate, feeOptionType],
  );

  return {
    isWalletAssetConnected,
    isWalletConnected,
    getMaxBalance,
    reloadAllBalance,
    reloadBalanceByChain,
    wallet,
  };
};
