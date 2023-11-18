import type { AssetValue, Wallet } from '@swapkit/core';
import { Chain, WalletOption } from '@swapkit/core';
import type { Pool } from 'legacyTypes/pool';

export const isTokenWhitelisted = (asset: AssetValue, whitelistedAddresses: string[]) => {
  if (![Chain.Avalanche, Chain.Ethereum, Chain.BinanceSmartChain].includes(asset.chain))
    return true;

  const assetAddress = asset.symbol.split('-')?.[1] ?? '';

  return !!whitelistedAddresses.find(
    (address) => address.toLowerCase() === assetAddress.toLowerCase(),
  );
};

export const getInputAssetsForAdd = ({
  wallet,
  pools,
}: {
  wallet: Wallet | null;
  // TODO: get the right type here
  pools: Pool[];
}) => {
  const assets: AssetValue[] = [];

  const poolAssets = pools.map((pool) => pool.asset);

  if (!wallet) return poolAssets;

  if (pools.length === 0) return [];

  Object.keys(wallet).forEach((chain) => {
    const chainWallet = wallet[chain as Chain];
    chainWallet?.balance.forEach((data) => {
      if (
        poolAssets.find(
          (poolAsset) => poolAsset.chain === data.chain && poolAsset.ticker === data.ticker,
        )
      ) {
        assets.push(data);
      }
    });
  });

  return assets;
};

export const getRuneToUpgrade = (wallet: Wallet | null): AssetValue[] | null => {
  if (!wallet) return null;
  const runeToUpgrade = [];

  const bnbRuneBalance = wallet?.BNB?.balance?.find((assetAmount) => assetAmount.ticker === 'RUNE');
  const ethRuneBalance = wallet?.ETH?.balance?.find((assetAmount) => assetAmount.ticker === 'RUNE');

  if (bnbRuneBalance?.gt(0)) {
    runeToUpgrade.push(bnbRuneBalance);
  }

  if (ethRuneBalance?.gt(0)) {
    runeToUpgrade.push(ethRuneBalance);
  }

  return runeToUpgrade;
};

// check if any input asset needs tx signing via keystore
export const isKeystoreSignRequired = ({
  wallet,
  inputAssets,
}: {
  wallet: Wallet | null;
  inputAssets: AssetValue[];
}): boolean => {
  if (!wallet) return false;
  let needSignIn = false;
  for (const asset of inputAssets) {
    if (wallet?.[asset.chain]?.walletType === WalletOption.KEYSTORE) {
      needSignIn = true;
    }
  }

  return needSignIn;
};

export const getWalletAssets = (wallet: Wallet | null) => {
  const assets: AssetValue[] = [];

  if (!wallet) return assets;

  Object.keys(wallet).forEach((chain) => {
    const chainWallet = wallet[chain as Chain];
    chainWallet?.balance.forEach((data) => {
      assets.push(data);
    });
  });

  return assets;
};

export const getAssetBalance = (asset: AssetValue, wallet: Wallet) => {
  if (asset.chain in wallet) {
    const chainWallet = wallet?.[asset.chain];
    const walletBalanceItem = chainWallet?.balance.find((assetData) => assetData?.eq?.(asset));

    return walletBalanceItem || asset;
  }

  return asset;
};

export const hasConnectedWallet = (wallet: Wallet | null) => {
  if (!wallet) return false;

  let connected = false;

  Object.keys(wallet).forEach((chain) => {
    if (wallet?.[chain as Chain]?.walletType) {
      connected = true;
    }
  });

  return connected;
};

export const hasWalletConnected = ({
  wallet,
  inputAssets,
}: {
  wallet: Wallet | null;
  inputAssets: AssetValue[];
}): boolean => {
  if (!wallet) return false;

  for (const asset of inputAssets) {
    const chainWallet = wallet?.[asset.chain];

    if (!chainWallet) return false;
  }

  return true;
};
