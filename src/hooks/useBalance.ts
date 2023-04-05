import { Amount, AssetEntity, isGasAsset } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { getGasRateByFeeOption, getNetworkFeeByAsset } from 'helpers/networkFee';
import { getAssetBalance } from 'helpers/wallet';
import { useCallback } from 'react';
import { useAppSelector } from 'store/store';

export const useBalance = () => {
  const { feeOptionType, wallet, inboundGasRate } = useAppSelector(
    ({ app: { feeOptionType }, wallet: { wallet }, midgard: { inboundGasRate } }) => ({
      wallet,
      inboundGasRate,
      feeOptionType,
    }),
  );

  const isWalletAssetConnected = useCallback(
    (asset: AssetEntity) => !!wallet?.[asset.L1Chain as Chain],
    [wallet],
  );

  const isWalletConnected = useCallback((chain: Chain) => !!wallet?.[chain], [wallet]);

  const getMaxBalance = useCallback(
    (asset: AssetEntity) => {
      const { L1Chain, decimal } = asset;
      if (!wallet?.[L1Chain as Chain]) return Amount.fromAssetAmount(10 ** 8, decimal);

      const networkFee = getNetworkFeeByAsset({
        asset,
        gasRate: getGasRateByFeeOption({ gasRate: inboundGasRate[L1Chain], feeOptionType }),
        direction: 'outbound',
      });

      const { amount } = getAssetBalance(asset, wallet);

      const maxSpendableAmount = isGasAsset(asset) ? amount.sub(networkFee) : amount;

      return maxSpendableAmount.gt(0) ? maxSpendableAmount : Amount.fromAssetAmount(0, decimal);
    },
    [wallet, inboundGasRate, feeOptionType],
  );

  return {
    isWalletAssetConnected,
    isWalletConnected,
    getMaxBalance,
    wallet,
  };
};
