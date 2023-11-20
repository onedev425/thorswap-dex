import type { AssetValue, UTXOChain } from '@swapkit/core';
import { Chain, isGasAsset, UTXOChainList } from '@swapkit/core';
import { useWallet } from 'context/wallet/hooks';
import { getAssetBalance } from 'helpers/wallet';
import { getMultiplierForAsset, getNetworkFee, parseFeeToAssetAmount } from 'hooks/useNetworkFee';
import { useCallback } from 'react';
import { getSwapKitClient } from 'services/swapKit';
import { IS_LEDGER_LIVE } from 'settings/config';
import { useAppSelector } from 'store/store';
import { useGetGasPriceRatesQuery } from 'store/thorswap/api';

import { getInboundFeeDataForChain } from '../../ledgerLive/wallet/swap';

export const useBalance = (skipFees?: boolean) => {
  const { data: gasPriceRates } = useGetGasPriceRatesQuery(undefined, { skip: skipFees });
  const feeOptionType = useAppSelector(({ app: { feeOptionType } }) => feeOptionType);
  const { wallet, getWallet } = useWallet();

  const isWalletAssetConnected = useCallback(
    (asset: AssetValue) => !!getWallet(asset.chain),
    [getWallet],
  );

  const isWalletConnected = useCallback((chain: Chain) => !!getWallet(chain), [getWallet]);

  const getMaxBalance = useCallback(
    async (asset: AssetValue, withoutFees = skipFees): Promise<AssetValue> => {
      if (withoutFees) return getAssetBalance(asset, wallet);

      const { chain } = asset;
      const chainWallet = getWallet(chain);
      if (!chainWallet) return asset.mul(0);

      const chainInfo = gasPriceRates?.find(({ asset }) => asset.includes(chain));

      if (IS_LEDGER_LIVE && chain === Chain.Bitcoin)
        getInboundFeeDataForChain(chain).then((gasPrice) => {
          const gasRate = getNetworkFee({
            gasPrice: gasPrice / 1e8,
            feeOptionType,
            multiplier: getMultiplierForAsset(asset),
          });
          const networkFee = parseFeeToAssetAmount({ gasRate, asset });
          const balance = getAssetBalance(asset, wallet);
          const maxSpendableAmount = isGasAsset(balance) ? balance.sub(networkFee) : balance;

          return maxSpendableAmount.gt(0) ? maxSpendableAmount : (balance.set(0) as AssetValue);
        });

      const gasRate = getNetworkFee({
        gasPrice: chainInfo?.gasAsset || 0,
        feeOptionType,
        multiplier: getMultiplierForAsset(asset),
      });
      const balance = getAssetBalance(asset, wallet);
      if (balance.eqValue(0)) return balance;

      if (!UTXOChainList.includes(chain as UTXOChain)) {
        const maxSpendableAmount = isGasAsset(asset)
          ? balance.sub(parseFeeToAssetAmount({ gasRate, asset }))
          : balance;

        return maxSpendableAmount.gt(0) ? maxSpendableAmount : maxSpendableAmount.set(0);
      }

      const client = await getSwapKitClient();

      const maxSpendableAmount = IS_LEDGER_LIVE
        ? (chainWallet?.balance.find((balance) => balance.eq(asset)) as AssetValue) || asset.set(0)
        : await client.estimateMaxSendableAmount({
            chain: chain,
            params: { from: chainWallet.address, recipient: '', assetValue: asset },
          });

      // TODO remove after LL is tested
      //   const baseAmountString = IS_LEDGER_LIVE
      //     ? baseAmount(
      //         wallet[L1Chain]?.balance
      //           .find((balance) => balance.asset.shallowEq(asset))
      //           ?.amount.baseAmount.toString(),
      //         asset.decimal,
      //       )
      //     : await client.estimateMaxSendableAmount({
      //         chain: L1Chain,
      //         params: {
      //           from,
      //           recipients: 1,
      //           memo: '56bytelongtestmemo-0000000000000000000000000000000000000',
      //         } as UTXOEstimateFeeParams,
      //       });

      return maxSpendableAmount.gt(0) ? maxSpendableAmount : asset.set(0);
    },
    [skipFees, wallet, getWallet, gasPriceRates, feeOptionType],
  );

  return { isWalletAssetConnected, isWalletConnected, getMaxBalance };
};
