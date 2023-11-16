import { AssetValue, Chain } from '@swapkit/core';
import { useFormatPrice } from 'helpers/formatPrice';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useMemo } from 'react';
import { useWallet } from 'store/wallet/hooks';

const emptyWallet = {
  [Chain.Avalanche]: null,
  [Chain.Binance]: null,
  [Chain.BinanceSmartChain]: null,
  [Chain.BitcoinCash]: null,
  [Chain.Bitcoin]: null,
  [Chain.Cosmos]: null,
  [Chain.Dogecoin]: null,
  [Chain.Ethereum]: null,
  [Chain.Litecoin]: null,
  [Chain.THORChain]: null,
};

export const useAccountData = (chain: Chain) => {
  const sigAsset = AssetValue.fromChainOrSignature(chain);
  const formatPrice = useFormatPrice();

  const {
    wallet: reduxWallet,
    chainWalletLoading,
    setIsConnectModalOpen,
    disconnectWalletByChain,
  } = useWallet();
  const wallet = reduxWallet || emptyWallet;
  const chainWallet = wallet[chain];
  const { balance: walletBalance, address: chainAddress } = chainWallet || {
    balance: [],
    address: '',
  };

  const chainInfo = useMemo(() => {
    const info = walletBalance.reduce((acc, item) => {
      if (item.eq(sigAsset)) {
        acc.unshift(item);
      } else {
        acc.push(item);
      }

      return acc;
    }, [] as AssetValue[]);

    if (chainAddress && !info.length) {
      info.push(getNoBalanceAsset(sigAsset));
    }

    return info;
  }, [walletBalance, chainAddress, sigAsset]);

  const { data: priceData } = useTokenPrices([sigAsset, ...chainInfo], {
    sparkline: true,
    lookup: true,
  });

  const balance = useMemo(() => {
    if (Object.keys(priceData).length === 0) return 0;

    return chainInfo.reduce((acc, item) => {
      const itemPrice = priceData[item.toString()]?.price_usd || 0;
      const itemValue = itemPrice * item.getValue('number');
      const addition = Number.isNaN(itemValue) ? 0 : itemValue;
      return (acc += addition);
    }, 0);
  }, [chainInfo, priceData]);

  const accountBalance = formatPrice(balance);

  const data = useMemo(
    () => ({
      sigAssetPriceInfo: priceData[sigAsset.toString()],
      accountBalance,
      chainAddress,
      chainInfo,
      priceData,
      chainWallet,
      chainWalletLoading,
      disconnectWalletByChain,
      setIsConnectModalOpen,
    }),
    [
      accountBalance,
      chainAddress,
      chainInfo,
      chainWallet,
      chainWalletLoading,
      disconnectWalletByChain,
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
      typeof sparkline === 'string'
        ? (JSON.parse(sparkline) as number[])
        : (sparkline as unknown as number[]) || [],
    [sparkline],
  );

  const chartData = useMemo(
    () => ({ label: `${asset.ticker} Price`, values: prices.slice(-64) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prices.length],
  );

  return chartData;
};

export const useWalletChainActions = (chain: Chain) => {
  const { refreshWalletByChain, disconnectWalletByChain, chainWalletLoading } = useWallet();

  const isLoading = chainWalletLoading?.[chain];

  const handleRefreshChain = useCallback(() => {
    refreshWalletByChain(chain);
  }, [chain, refreshWalletByChain]);

  const handleWalletDisconnect = useCallback(() => {
    disconnectWalletByChain(chain);
  }, [chain, disconnectWalletByChain]);

  return { handleRefreshChain, handleWalletDisconnect, isLoading };
};

const getNoBalanceAsset = (asset: AssetValue) => {
  return AssetValue.fromChainOrSignature(asset.chain, 0);
};
