import { Chain, WalletOption } from '@thorswap-lib/types';

export enum WalletType {
  Brave = 'Brave',
  CreateKeystore = 'CreateKeystore',
  Keplr = 'Keplr',
  Keystore = 'Keystore',
  Ledger = 'Ledger',
  MetaMask = 'MetaMask',
  Phrase = 'Phrase',
  TrustWallet = 'TrustWallet',
  TrustWalletExtension = 'TrustWalletExtension',
  Xdefi = 'Xdefi',
}

export const WalletNameByWalletOption: Record<WalletOption, string> = {
  [WalletOption.BRAVE]: WalletType.Brave,
  [WalletOption.KEPLR]: WalletType.Keplr,
  [WalletOption.LEDGER]: WalletType.Ledger,
  [WalletOption.METAMASK]: WalletType.MetaMask,
  [WalletOption.TRUSTWALLET]: WalletType.TrustWallet,
  [WalletOption.TRUSTWALLET_WEB]: 'Trustwallet Web',
  [WalletOption.XDEFI]: WalletType.Xdefi,
  [WalletOption.KEYSTORE]: WalletType.Keystore,
};

// Left as a placeholder for future chains
// const STAGENET_CHAINS = IS_STAGENET ? [] : [];

const AllChainsSupported = [
  Chain.Avalanche,
  Chain.Binance,
  Chain.Bitcoin,
  Chain.BitcoinCash,
  Chain.Cosmos,
  Chain.Doge,
  Chain.Ethereum,
  Chain.Litecoin,
  Chain.THORChain,
] as Chain[];

export const availableChainsByWallet: Record<WalletType, Chain[]> = {
  [WalletType.Brave]: [Chain.Ethereum],
  [WalletType.CreateKeystore]: AllChainsSupported,
  [WalletType.Keplr]: [Chain.Cosmos],
  [WalletType.Keystore]: AllChainsSupported,
  [WalletType.Ledger]: AllChainsSupported,
  [WalletType.MetaMask]: [Chain.Ethereum, Chain.Avalanche],
  [WalletType.Phrase]: AllChainsSupported,
  [WalletType.TrustWallet]: [Chain.THORChain, Chain.Ethereum, Chain.Binance],
  [WalletType.TrustWalletExtension]: [Chain.Ethereum, Chain.Avalanche],
  [WalletType.Xdefi]: AllChainsSupported,
};

const COMMON_WALLETS = [
  WalletType.CreateKeystore,
  WalletType.Keystore,
  WalletType.Ledger,
  WalletType.Phrase,
] as const;

export const availableWalletsByChain: Record<Chain, WalletType[]> = {
  [Chain.Avalanche]: [...COMMON_WALLETS, WalletType.MetaMask, WalletType.Xdefi],
  [Chain.Binance]: [...COMMON_WALLETS, WalletType.TrustWallet, WalletType.Xdefi],
  [Chain.BitcoinCash]: [...COMMON_WALLETS, WalletType.Xdefi],
  [Chain.Bitcoin]: [...COMMON_WALLETS, WalletType.Xdefi],
  [Chain.Cosmos]: [...COMMON_WALLETS, WalletType.Keplr],
  [Chain.Doge]: [...COMMON_WALLETS, WalletType.Xdefi],
  [Chain.Litecoin]: [...COMMON_WALLETS, WalletType.Xdefi],
  [Chain.THORChain]: [...COMMON_WALLETS, WalletType.TrustWallet, WalletType.Xdefi],
  [Chain.Ethereum]: [
    ...COMMON_WALLETS,
    WalletType.MetaMask,
    WalletType.TrustWallet,
    WalletType.Xdefi,
  ],
  [Chain.BinanceSmartChain]: [],
};
