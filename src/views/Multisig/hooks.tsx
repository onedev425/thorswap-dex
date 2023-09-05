import type { AssetAmount, AssetEntity as Asset, Wallet } from '@thorswap-lib/swapkit-core';
import { Amount, getSignatureAssetFor, isGasAsset } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { Button, Icon } from 'components/Atomic';
import { formatPrice } from 'helpers/formatPrice';
import { useAddressUtils } from 'hooks/useAddressUtils';
import { getMultiplierForAsset, getNetworkFee, parseFeeToAssetAmount } from 'hooks/useNetworkFee';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { multisig } from 'services/multisig';
import { ROUTES } from 'settings/router';
import { useMultisig } from 'store/multisig/hooks';
import { useAppSelector } from 'store/store';
import { useGetGasPriceRatesQuery } from 'store/thorswap/api';

export const useMultisigWalletInfo = () => {
  const { runeBalance, loadingBalances } = useMultissigAssets();
  const { address, threshold } = useAppSelector(({ multisig }) => multisig);

  const { shortAddress, handleCopyAddress } = useAddressUtils(address);
  const formattedRune = `${formatPrice(runeBalance?.amount || 0, {
    prefix: '',
  })} ${getSignatureAssetFor(Chain.THORChain).ticker}`;

  const runeValue = useMemo(() => {
    if (runeBalance) {
      return formattedRune;
    }

    return loadingBalances ? <Icon spin name="refresh" size={16} /> : '-';
  }, [formattedRune, loadingBalances, runeBalance]);

  const info = [
    {
      label: t('views.multisig.safeAddress'),
      value: (
        <Button
          className="!px-2 h-[30px]"
          onClick={(e) => {
            handleCopyAddress();
            e.stopPropagation();
            e.preventDefault();
          }}
          rightIcon={<Icon name="copy" size={14} />}
          tooltip={t('common.copy')}
          variant="borderlessTint"
        >
          {shortAddress}
        </Button>
      ),
    },
    {
      label: t('views.multisig.runeBalance'),
      value: runeValue,
    },
    { label: t('views.multisig.threshold'), value: threshold },
  ];

  return info;
};

export const useMultissigAssets = () => {
  const { data: gasPriceRates } = useGetGasPriceRatesQuery();
  const { loadBalances } = useMultisig();
  const [runeBalance, setRuneBalance] = useState<AssetAmount | null>(null);
  const { balances, loadingBalances } = useAppSelector(({ multisig }) => multisig);
  const { feeOptionType } = useAppSelector(({ app: { feeOptionType }, wallet: { wallet } }) => ({
    wallet,
    feeOptionType,
  }));

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  useEffect(() => {
    const balance = multisig.getAssetBalance(getSignatureAssetFor(Chain.THORChain), balances);
    setRuneBalance(balance);
  }, [balances]);

  const assetsWithBalance = balances.map((a) => ({
    asset: a.asset,
    balance: a.amount,
  }));

  const getMaxBalance = useCallback(
    (asset: Asset): Amount => {
      const chainInfo = gasPriceRates?.find((gasRate) => gasRate.asset.includes(asset.L1Chain));
      const gasRate = getNetworkFee({
        gasPrice: chainInfo?.gasAsset || 0,
        feeOptionType,
        multiplier: getMultiplierForAsset(asset),
      });

      const networkFee = parseFeeToAssetAmount({ gasRate, asset });

      const balance = multisig.getAssetBalance(asset, balances).amount;

      /**
       * if asset is used for gas, subtract the inbound gas fee from input amount
       * else allow full amount
       * Calc: max spendable amount = balance amount - 2 x gas fee(if send asset equals to gas asset)
       */

      const maxSpendableAmount = isGasAsset(asset) ? balance.sub(networkFee) : balance;

      return maxSpendableAmount.gt(0)
        ? maxSpendableAmount
        : Amount.fromAssetAmount(0, asset.decimal);
    },
    [balances, feeOptionType, gasPriceRates],
  );

  const getBalanceForAssets = useCallback(
    (assets: Asset[]) =>
      assets.map((asset: Asset) => ({
        asset,
        balance: multisig.hasAsset(asset, balances) ? getMaxBalance(asset) : undefined,
      })),
    [balances, getMaxBalance],
  );

  const getAssetBalance = (asset: Asset) => {
    return multisig.getAssetBalance(asset, balances);
  };

  return {
    loadingBalances,
    runeBalance,
    assetsWithBalance,
    getMaxBalance,
    getBalanceForAssets,
    getAssetBalance,
  };
};

export const useMultisigWallet = () => {
  const { loadBalances } = useMultisig();
  const { address, balances } = useAppSelector(({ multisig }) => multisig);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  const wallet = useMemo(() => {
    if (!address) {
      return null;
    }

    return {
      // Multisig is THORChain only wallet
      [Chain.THORChain]: {
        address,
        balance: balances,
      },
    } as Wallet;
  }, [address, balances]);

  return { wallet };
};

export const useMultisigProtectedRoute = () => {
  const address = useAppSelector(({ multisig }) => multisig.address);
  const navigate = useNavigate();

  if (!address) {
    navigate(ROUTES.Multisig);
  }
};
