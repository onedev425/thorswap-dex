import { baseAmount } from '@thorswap-lib/helpers';
import type { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Amount, isGasAsset } from '@thorswap-lib/swapkit-core';
import type { UTXOEstimateFeeParams } from '@thorswap-lib/toolbox-utxo';
import { Chain, UTXOChainList } from '@thorswap-lib/types';
import { getAssetBalance } from 'helpers/wallet';
import { getMultiplierForAsset, getNetworkFee, parseFeeToAssetAmount } from 'hooks/useNetworkFee';
import { useCallback } from 'react';
import { getSwapKitClient } from 'services/swapKit';
import { IS_LEDGER_LIVE } from 'settings/config';
import { useAppDispatch, useAppSelector } from 'store/store';
import { useGetGasPriceRatesQuery } from 'store/thorswap/api';
import * as walletActions from 'store/wallet/actions';
import { zeroAmount } from 'types/app';

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
    async (asset: AssetEntity, withoutFees = skipFees) => {
      const { L1Chain, decimal } = asset;
      const chainWallet = wallet?.[L1Chain as Chain];
      if (!chainWallet) return Amount.fromBaseAmount(0, decimal);
      const from = chainWallet.address;
      const chainInfo = gasPriceRates?.find(({ asset }) => asset.includes(L1Chain));
      if (withoutFees) {
        return getAssetBalance(asset, wallet).amount;
      }
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
      const { amount } = getAssetBalance(asset, wallet);
      if (amount.baseAmount.eq(0)) return Amount.fromAssetAmount(0, decimal);

      //   const networkFee = parseFeeToAssetAmount({ gasRate, asset });
      if (!UTXOChainList.includes(L1Chain)) {
        const networkFee = parseFeeToAssetAmount({ gasRate, asset });

        const maxSpendableAmount = isGasAsset(asset) ? amount.sub(networkFee) : amount;

        return maxSpendableAmount.gt(0) ? maxSpendableAmount : Amount.fromAssetAmount(0, decimal);
      }

      const client = await getSwapKitClient();
      const baseAmountString = IS_LEDGER_LIVE
        ? baseAmount(
            wallet[L1Chain]?.balance
              .find((balance) => balance.asset.shallowEq(asset))
              ?.amount.baseAmount.toString(),
            asset.decimal,
          )
        : await client.estimateMaxSendableAmount({
            chain: L1Chain,
            params: {
              from,
              recipients: 1,
              memo: '56bytelongtestmemo-0000000000000000000000000000000000000',
            } as UTXOEstimateFeeParams,
          });

      const maxSpendableAmount = Amount.fromBaseAmount(baseAmountString.amount().toString(), 8);
      return maxSpendableAmount.gt(0) ? maxSpendableAmount : zeroAmount;
    },
    [skipFees, wallet, gasPriceRates, feeOptionType],
  );

  return { isWalletAssetConnected, isWalletConnected, getMaxBalance, wallet, reloadBalanceByChain };
};
