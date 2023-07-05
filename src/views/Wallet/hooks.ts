import { Amount, AssetAmount, AssetEntity, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { formatPrice } from 'helpers/formatPrice';
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
  [Chain.Doge]: null,
  [Chain.Ethereum]: null,
  [Chain.Litecoin]: null,
  [Chain.THORChain]: null,
};

export const useAccountData = (chain: Chain) => {
  const sigAsset = getSignatureAssetFor(chain);
  const {
    wallet: reduxWallet,
    chainWalletLoading,
    setIsConnectModalOpen,
    disconnectWalletByChain,
  } = useWallet();
  const wallet = reduxWallet || emptyWallet;
  const chainWallet = wallet[chain];
  const { balance: walletBalance, address: chainAddress } = chainWallet || {
    balance: [] as AssetAmount[],
    address: '',
  };

  const chainInfo = useMemo(() => {
    const info: AssetAmount[] = (walletBalance as AssetAmount[]).reduce((acc, item) => {
      if (item.asset.eq(sigAsset)) {
        acc.unshift(item);
      } else {
        acc.push(item);
      }

      return acc as AssetAmount[];
    }, [] as AssetAmount[]);

    if (chainAddress && !info.length) {
      info.push(getNoBalanceAsset(sigAsset));
    }

    return info;
  }, [walletBalance, chainAddress, sigAsset]);

  const { data: priceData } = useTokenPrices([sigAsset, ...chainInfo.map((item) => item.asset)], {
    sparkline: true,
    lookup: true,
  });

  const balance = useMemo(() => {
    if (Object.keys(priceData).length === 0) return 0;

    return chainInfo.reduce((acc, item) => {
      const itemPrice = priceData[item.asset.toString()]?.price_usd || 0;
      const itemValue = itemPrice * item.amount.assetAmount.toNumber();
      return (acc += itemValue);
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

export const useChartData = (asset: AssetEntity, sparkline?: string) => {
  const prices = useMemo(
    () =>
      typeof sparkline === 'string'
        ? (JSON.parse(sparkline || '[]') as number[])
        : (sparkline as unknown as number[]),
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
  const { wallet, refreshWalletByChain, disconnectWalletByChain, chainWalletLoading } = useWallet();

  const isLoading = chainWalletLoading?.[chain];

  const handleRefreshChain = useCallback(() => {
    if (wallet?.[chain]) {
      refreshWalletByChain(chain);
    }
  }, [chain, refreshWalletByChain, wallet]);

  const handleWalletDisconnect = useCallback(() => {
    disconnectWalletByChain(chain);
  }, [chain, disconnectWalletByChain]);

  return { handleRefreshChain, handleWalletDisconnect, isLoading };
};

const getNoBalanceAsset = (asset: AssetEntity): AssetAmount => {
  return new AssetAmount(asset, Amount.fromNormalAmount(0));
};
