import { AssetValue, type BaseWallet, Chain } from "@swapkit/sdk";
import type { ThorchainWallets } from "@swapkit/toolbox-cosmos";
import { Button, Icon } from "components/Atomic";
import { useFormatPrice } from "helpers/formatPrice";
import { useAddressUtils } from "hooks/useAddressUtils";
import { getMultiplierForAsset, getNetworkFee, parseFeeToAssetAmount } from "hooks/useNetworkFee";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "services/i18n";
import { multisig } from "services/multisig";
import { ROUTES } from "settings/router";
import { useMultisig } from "store/multisig/hooks";
import { useAppSelector } from "store/store";
import { useGetGasPriceRatesQuery } from "store/thorswap/api";

export const useMultisigWalletInfo = () => {
  const { runeBalance, loadingBalances } = useMultissigAssets();
  const { address, threshold } = useAppSelector(({ multisig }) => multisig);
  const formatPrice = useFormatPrice(2, "");

  const { shortAddress, handleCopyAddress } = useAddressUtils(address);
  const formattedRune = `${formatPrice(runeBalance || 0)} ${
    AssetValue.fromChainOrSignature(Chain.THORChain).ticker
  }`;

  const runeValue = useMemo(() => {
    if (runeBalance) {
      return formattedRune;
    }

    return loadingBalances ? <Icon spin name="refresh" size={16} /> : "-";
  }, [formattedRune, loadingBalances, runeBalance]);

  const info = [
    {
      label: t("views.multisig.safeAddress"),
      value: (
        <Button
          className="!px-2 h-[30px]"
          onClick={(e) => {
            handleCopyAddress();
            e.stopPropagation();
            e.preventDefault();
          }}
          rightIcon={<Icon name="copy" size={14} />}
          tooltip={t("common.copy")}
          variant="borderlessTint"
        >
          {shortAddress}
        </Button>
      ),
    },
    {
      label: t("views.multisig.runeBalance"),
      value: runeValue,
    },
    { label: t("views.multisig.threshold"), value: threshold },
  ];

  return info;
};

export const useMultissigAssets = () => {
  const { data: gasPriceRates } = useGetGasPriceRatesQuery();
  const { loadBalances } = useMultisig();
  const [runeBalance, setRuneBalance] = useState<AssetValue | null>(null);
  const { balances, loadingBalances } = useAppSelector(({ multisig }) => multisig);
  const feeOptionType = useAppSelector(({ app }) => app.feeOptionType);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  useEffect(() => {
    const balance = multisig.getAssetBalance(
      AssetValue.fromChainOrSignature(Chain.THORChain),
      balances,
    );
    setRuneBalance(balance);
  }, [balances]);

  const assetsWithBalance = balances.map((balance) => ({
    balance,
    asset: balance,
  }));

  const getMaxBalance = useCallback(
    (asset: AssetValue) => {
      const chainInfo = gasPriceRates?.find((gasRate) => gasRate.asset.includes(asset.chain));
      const gasRate = getNetworkFee({
        gasPrice: chainInfo?.gasAsset || 0,
        feeOptionType,
        multiplier: getMultiplierForAsset(asset),
      });

      const networkFee = parseFeeToAssetAmount({ gasRate, asset });

      const balance = multisig.getAssetBalance(asset, balances) as AssetValue;

      /**
       * if asset is used for gas, subtract the inbound gas fee from input amount
       * else allow full amount
       * Calc: max spendable amount = balance amount - 2 x gas fee(if send asset equals to gas asset)
       */

      const maxSpendableAmount = asset.isGasAsset ? balance.sub(networkFee) : balance;

      return maxSpendableAmount.gt(0) ? maxSpendableAmount : balance.mul(0);
    },
    [balances, feeOptionType, gasPriceRates],
  );

  const getBalanceForAssets = useCallback(
    (assets: AssetValue[]) =>
      assets.map((asset: AssetValue) => ({
        asset,
        balance: multisig.hasAsset(asset, balances) ? getMaxBalance(asset) : undefined,
      })),
    [balances, getMaxBalance],
  );

  const getAssetBalance = (asset: AssetValue) => {
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
    } as BaseWallet<ThorchainWallets>;
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
