import {
  Amount,
  Asset,
  AssetAmount,
  getNetworkFeeByAsset,
  Wallet,
} from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { Button, Icon } from 'components/Atomic';
import { formatPrice } from 'helpers/formatPrice';
import { getGasRateByFeeOption } from 'helpers/networkFee';
import { useAddressUtils } from 'hooks/useAddressUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { multisig } from 'services/multisig';
import { ROUTES } from 'settings/constants';
import { useMultisig } from 'store/multisig/hooks';
import { useAppSelector } from 'store/store';

export const useMultisigWalletInfo = () => {
  const { runeBalance, loadingBalances } = useMultissigAssets();
  const { address, treshold } = useAppSelector((state) => state.multisig);

  const { shortAddress, handleCopyAddress } = useAddressUtils(address);
  const formattedRune = `${formatPrice(runeBalance?.amount || 0, {
    prefix: '',
  })} ${Asset.RUNE().ticker}`;

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
          endIcon={<Icon name="copy" size={14} />}
          onClick={(e) => {
            handleCopyAddress();
            e.stopPropagation();
            e.preventDefault();
          }}
          tooltip={t('common.copy')}
          type="borderless"
          variant="tint"
        >
          {shortAddress}
        </Button>
      ),
    },
    {
      label: t('views.multisig.runeBalance'),
      value: runeValue,
    },
    { label: t('views.multisig.threshold'), value: treshold },
  ];

  return info;
};

export const useMultissigAssets = () => {
  const { loadBalances } = useMultisig();
  const [runeBalance, setRuneBalance] = useState<AssetAmount | null>(null);
  const { balances, loadingBalances } = useAppSelector((state) => state.multisig);
  const { feeOptionType, inboundGasRate } = useAppSelector(
    ({ app: { feeOptionType }, wallet: { wallet }, midgard: { inboundGasRate } }) => ({
      wallet,
      inboundGasRate,
      feeOptionType,
    }),
  );

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  useEffect(() => {
    const balance = multisig.getAssetBalance(Asset.RUNE(), balances);
    setRuneBalance(balance);
  }, [balances]);

  const assetsWithBalance = balances.map((a) => ({
    asset: a.asset,
    balance: a.amount,
  }));

  const getMaxBalance = useCallback(
    (asset: Asset): Amount => {
      // calculate inbound fee
      const gasRate = getGasRateByFeeOption({
        gasRate: inboundGasRate[asset.L1Chain],
        feeOptionType,
      });
      const inboundFee = getNetworkFeeByAsset({
        asset,
        gasRate,
        direction: 'inbound',
      });

      const balance = multisig.getAssetBalance(asset, balances).amount;

      /**
       * if asset is used for gas, subtract the inbound gas fee from input amount
       * else allow full amount
       * Calc: max spendable amount = balance amount - 2 x gas fee(if send asset equals to gas asset)
       */

      const maxSpendableAmount = asset.isGasAsset()
        ? balance.sub(inboundFee.mul(1).amount)
        : balance;

      return maxSpendableAmount.gt(0)
        ? maxSpendableAmount
        : Amount.fromAssetAmount(0, asset.decimal);
    },
    [balances, feeOptionType, inboundGasRate],
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
  const { address, balances } = useAppSelector((state) => state.multisig);

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
  const { address } = useAppSelector((state) => state.multisig);
  const navigate = useNavigate();

  if (!address) {
    navigate(ROUTES.Multisig);
  }
};
