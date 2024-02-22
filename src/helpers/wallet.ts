import type { AssetValue } from '@swapkit/core';
import { Chain } from '@swapkit/core';
import type { initialWallet } from 'context/wallet/WalletProvider';

export const isTokenWhitelisted = (asset: AssetValue, whitelistedAddresses: string[]) => {
  if (![Chain.Avalanche, Chain.Ethereum, Chain.BinanceSmartChain].includes(asset.chain))
    return true;

  return !!whitelistedAddresses.find(
    (address) => address.toLowerCase() === asset.address?.toLowerCase(),
  );
};

export const getAssetBalance = (asset: AssetValue, wallet: typeof initialWallet) => {
  if (asset.chain in wallet) {
    const chainWallet = wallet?.[asset.chain as keyof typeof wallet];
    const walletBalanceItem = chainWallet?.balance.find(
      (assetData) => assetData.toString().toLowerCase() === asset.toString().toLowerCase(),
    );

    return walletBalanceItem || asset;
  }

  return asset;
};
