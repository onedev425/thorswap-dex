import { Amount, Asset, AssetAmount, ChainWallet, Pool } from '@thorswap-lib/multichain-sdk';
import { Chain, SupportedChain } from '@thorswap-lib/types';

type Wallet = Record<SupportedChain, ChainWallet | null>;

enum WalletOption {
  'KEYSTORE' = 'KEYSTORE',
  'XDEFI' = 'XDEFI',
  'METAMASK' = 'METAMASK',
  'TRUSTWALLET' = 'TRUSTWALLET',
  'LEDGER' = 'LEDGER',
  'PHANTOM' = 'PHANTOM',
  'KEPLR' = 'KEPLR',
}

type TokenType = {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
};

const tokenList = import('./1inchTokenList').then(({ tokenList }) => tokenList);

export const isTokenWhitelisted = async (asset: Asset) => {
  if (asset.L1Chain !== Chain.Ethereum) return true;

  const assetAddress = asset.symbol.split('-')?.[1] ?? '';
  const tokenList1Inch = await tokenList;

  const isWhitelisted = tokenList1Inch.tokens.find(
    (data: TokenType) => data.address.toLowerCase() === assetAddress.toLowerCase(),
  );

  return !!isWhitelisted;
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
      if (poolAssets.find((poolAsset) => poolAsset.eq(data.asset))) {
        assets.push(data.asset);
      }
    });
  });

  return assets;
};

export const getInputAssetsForCreate = async ({
  wallet,
  pools,
}: {
  wallet: Wallet | null;
  pools: Pool[];
}): Promise<Asset[]> => {
  const assets: Asset[] = [];

  const poolAssets = pools.map((pool) => pool.asset);

  if (!wallet) return poolAssets;

  if (pools.length === 0) return [];

  for (const chain of Object.keys(wallet)) {
    const chainWallet = wallet[chain as SupportedChain];
    const balances = chainWallet?.balance || [];

    for (const balance of balances) {
      // 1. if non-pool asset exists
      // 2. asset shouldn't be THORChain asset
      if (
        !poolAssets.find((poolAsset) => poolAsset.eq(balance.asset)) &&
        balance.asset.chain !== Chain.THORChain
      ) {
        // if erc20 token is whitelisted for THORChain
        if (await isTokenWhitelisted(balance.asset)) {
          assets.push(balance.asset);
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

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < inputAssets.length; i++) {
    const asset = inputAssets[i];

    const chainWallet = wallet?.[asset.L1Chain as SupportedChain];

    if (chainWallet?.walletType === WalletOption.KEYSTORE) {
      return true;
    }
  }

  return false;
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
