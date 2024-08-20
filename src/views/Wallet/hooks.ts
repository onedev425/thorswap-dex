import type { Chain, FullWallet } from "@swapkit/sdk";
import { AssetValue } from "@swapkit/sdk";
import { useWalletDispatch } from "context/wallet/WalletProvider";
import { useWallet, useWalletBalance, useWalletConnectModal } from "context/wallet/hooks";
import { useFormatPrice } from "helpers/formatPrice";
import { useTokenPrices } from "hooks/useTokenPrices";
import { useCallback, useMemo } from "react";

export const useAccountData = (chain: Chain) => {
  const sigAsset = AssetValue.from({ chain });
  const formatPrice = useFormatPrice();
  const { wallet, getWalletAddress, chainLoading } = useWallet();
  const { setIsConnectModalOpen } = useWalletConnectModal();

  const chainWallet = useMemo(
    () => wallet[chain as keyof typeof wallet],
    [chain, wallet],
  ) as FullWallet[Chain];

  const chainInfo = useMemo(() => {
    const info =
      chainWallet?.balance.reduce((acc, item) => {
        if (item.eqAsset(sigAsset)) {
          acc.unshift(item);
        } else {
          acc.push(item);
        }

        return acc;
      }, [] as AssetValue[]) || [];

    if (chainWallet?.balance?.length === 0) {
      info.push(getNoBalanceAsset(sigAsset));
    }

    return info;
  }, [chainWallet?.balance, sigAsset]);

  const { data: priceData } = useTokenPrices([sigAsset, ...chainInfo], {
    sparkline: true,
    lookup: true,
  });

  const balance = useMemo(() => {
    if (Object.keys(priceData).length === 0) return 0;

    return chainInfo.reduce((acc, item) => {
      const itemPrice = priceData[item.toString()]?.price_usd || 0;
      const itemValue = itemPrice * item.getValue("number");
      const addition = Number.isNaN(itemValue) ? 0 : itemValue;
      return acc + addition;
    }, 0);
  }, [chainInfo, priceData]);

  const accountBalance = formatPrice(balance);

  const data = useMemo(
    () => ({
      sigAssetPriceInfo: priceData[sigAsset.toString()],
      accountBalance,
      chainAddress: getWalletAddress(chain),
      chainInfo,
      priceData,
      chainWallet,
      chainWalletLoading: chainLoading[chain as keyof typeof chainLoading],
      setIsConnectModalOpen,
    }),
    [
      accountBalance,
      chain,
      chainInfo,
      chainLoading,
      chainWallet,
      getWalletAddress,
      priceData,
      setIsConnectModalOpen,
      sigAsset,
    ],
  );

  return data;
};

export const useChartData = (asset: AssetValue, sparkline?: string) => {
  const prices = useMemo(
    () =>
      typeof sparkline === "string"
        ? (JSON.parse(sparkline) as number[])
        : (sparkline as unknown as number[]) || [],
    [sparkline],
  );

  const chartData = useMemo(
    () => ({ label: `${asset.ticker} Price`, values: prices.slice(-64) }),
    [prices.length],
  );

  return chartData;
};

export const useWalletChainActions = (chain: Chain) => {
  const walletDispatch = useWalletDispatch();
  const { getWalletByChain } = useWalletBalance();

  const handleRefreshChain = useCallback(() => {
    getWalletByChain(chain);
  }, [chain, getWalletByChain]);

  const handleWalletDisconnect = useCallback(() => {
    walletDispatch({ type: "disconnectByChain", payload: chain });
  }, [chain, walletDispatch]);

  return { handleRefreshChain, handleWalletDisconnect };
};

const getNoBalanceAsset = (asset: AssetValue) => {
  return AssetValue.fromChainOrSignature(asset.chain, 0);
};
