import { Amount, Asset, AssetAmount, Pool, Wallet } from '@thorswap-lib/multichain-core';
import { Chain, SupportedChain, WalletOption } from '@thorswap-lib/types';

export const isTokenWhitelisted = (asset: Asset, whitelistedAddresses: string[]) => {
  if (![Chain.Avalanche, Chain.Ethereum].includes(asset.L1Chain)) return true;

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
  pools: Pool[];
}) => {
  const assets: Asset[] = [];

  const poolAssets = pools.map((pool) => pool.asset);

  if (!wallet) return poolAssets;

  if (pools.length === 0) return [];

  Object.keys(wallet).forEach((chain) => {
    const chainWallet = wallet[chain as SupportedChain];
    chainWallet?.balance.forEach((data: AssetAmount) => {
      if (
        poolAssets.find(
          (poolAsset) =>
            poolAsset.chain === data.asset.chain && poolAsset.ticker === data.asset.ticker,
        )
      ) {
        assets.push(data.asset);
      }
    });
  });

  return assets;
};

export const getInputAssetsForCreate = ({
  wallet,
  pools,
  ethWhitelist,
  avaxWhitelist,
}: {
  wallet: Wallet | null;
  pools: Pool[];
  ethWhitelist: string[];
  avaxWhitelist: string[];
}) => {
  const assets: Asset[] = [];
  const poolAssets = pools.map((pool) => pool.asset);

  if (!wallet) return poolAssets;
  if (pools.length === 0) return [];

  for (const chain of Object.keys(wallet)) {
    const chainWallet = wallet[chain as SupportedChain];
    const balances = chainWallet?.balance || [];
    if (Chain.THORChain !== chain) {
      for (const balance of balances) {
        // 1. if non-pool asset exists
        // 2. asset shouldn't be THORChain asset
        if (
          !poolAssets.find((poolAsset) => poolAsset.eq(balance.asset)) &&
          balance.asset.chain !== Chain.THORChain
        ) {
          // if erc20 token is whitelisted for THORChain
          const whitelist =
            balance.asset.L1Chain === Chain.Ethereum
              ? ethWhitelist
              : balance.asset.L1Chain === Chain.Avalanche
              ? avaxWhitelist
              : [];

          if (isTokenWhitelisted(balance.asset, whitelist)) {
            assets.push(balance.asset);
          }
        }
      }
    }
  }

  return assets;
};

export const getRuneToUpgrade = (wallet: Wallet | null): Asset[] | null => {
  if (!wallet) return null;
  const runeToUpgrade = [];

  const bnbRuneBalance = wallet?.BNB?.balance?.find(
    (assetAmount: AssetAmount) => assetAmount.asset.ticker === 'RUNE',
  );
  const ethRuneBalance = wallet?.ETH?.balance?.find(
    (assetAmount: AssetAmount) => assetAmount.asset.ticker === 'RUNE',
  );

  if (bnbRuneBalance?.amount.baseAmount.gt(0)) {
    runeToUpgrade.push(bnbRuneBalance.asset);
  }

  if (ethRuneBalance?.amount.baseAmount.gt(0)) {
    runeToUpgrade.push(ethRuneBalance.asset);
  }

  return runeToUpgrade;
};

// check if any input asset needs tx signing via keystore
export const isKeystoreSignRequired = ({
  wallet,
  inputAssets,
}: {
  wallet: Wallet | null;
  inputAssets: Asset[];
}): boolean => {
  if (!wallet) return false;
  let needSignIn = false;
  for (const asset of inputAssets) {
    if (wallet?.[asset.L1Chain as SupportedChain]?.walletType === WalletOption.KEYSTORE) {
      needSignIn = true;
    }
  }

  return needSignIn;
};

export const getWalletAssets = (wallet: Wallet | null) => {
  const assets: Asset[] = [];

  if (!wallet) return assets;

  Object.keys(wallet).forEach((chain) => {
    const chainWallet = wallet[chain as SupportedChain];
    chainWallet?.balance.forEach((data: AssetAmount) => {
      assets.push(data.asset);
    });
  });

  return assets;
};

export const getAssetBalance = (asset: Asset, wallet: Wallet): AssetAmount => {
  const emptyAmount = new AssetAmount(asset, Amount.fromBaseAmount(0, asset.decimal));

  if (asset.L1Chain in wallet) {
    const chainWallet = wallet?.[asset.L1Chain as SupportedChain];

    return (
      chainWallet?.balance.find((assetData: AssetAmount) => {
        return assetData.asset.eq(asset);
      }) || emptyAmount
    );
  }

  return emptyAmount;
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
  inputAssets: Asset[];
}): boolean => {
  if (!wallet) return false;

  for (const asset of inputAssets) {
    const chainWallet = wallet?.[asset.L1Chain as Chain];

    if (!chainWallet) return false;
  }

  return true;
};
