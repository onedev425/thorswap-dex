import type { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Amount, isGasAsset } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { getAssetBalance } from 'helpers/wallet';
import { getMultiplierForAsset, getNetworkFee, parseFeeToAssetAmount } from 'hooks/useNetworkFee';
import { useCallback } from 'react';
import { IS_LEDGER_LIVE } from 'settings/config';
import { useAppDispatch, useAppSelector } from 'store/store';
import { useGetGasPriceRatesQuery } from 'store/thorswap/api';
import * as walletActions from 'store/wallet/actions';

import { getInboundFeeDataForChain } from '../../ledgerLive/wallet/swap';

export const useBalance = (skipFees?: boolean) => {
  const dispatch = useAppDispatch();
  const { data: gasPriceRates } = useGetGasPriceRatesQuery(undefined, { skip: skipFees });
  const feeOptionType = useAppSelector(({ app: { feeOptionType } }) => feeOptionType);
  const wallet = useAppSelector(({ wallet }) => wallet.wallet);

  const reloadBalanceByChain = useCallback(
    (chain: Chain) => {
      !IS_LEDGER_LIVE ? null : dispatch(walletActions.updateLedgerLiveBalance(chain));
    },
    [dispatch],
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

      const chainInfo = gasPriceRates?.find(({ asset }) => asset.includes(L1Chain));
      if (IS_LEDGER_LIVE && L1Chain === Chain.Bitcoin)
        getInboundFeeDataForChain(L1Chain).then((gasPrice) => {
          const gasRate = getNetworkFee({
            gasPrice: gasPrice / 1e8,
            feeOptionType,
            multiplier: getMultiplierForAsset(asset),
          });
          const networkFee = parseFeeToAssetAmount({ gasRate, asset });

          const { amount } = getAssetBalance(asset, wallet);

          const maxSpendableAmount = isGasAsset(asset) ? amount.sub(networkFee) : amount;

          return maxSpendableAmount.gt(0) ? maxSpendableAmount : Amount.fromAssetAmount(0, decimal);
        });

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

  return { isWalletAssetConnected, isWalletConnected, getMaxBalance, wallet, reloadBalanceByChain };
};
