import { Chain, SupportedChain } from '@thorswap-lib/types';

export enum WalletType {
  Brave = 'Brave',
  CreateKeystore = 'CreateKeystore',
  Keplr = 'Keplr',
  Keystore = 'Keystore',
  Ledger = 'Ledger',
  MetaMask = 'MetaMask',
  Phantom = 'Phantom',
  Phrase = 'Phrase',
  TrustWallet = 'TrustWallet',
  Xdefi = 'Xdefi',
}

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
  Chain.Solana,
  Chain.THORChain,
] as SupportedChain[];

export const availableChainsByWallet: Record<WalletType, SupportedChain[]> = {
  [WalletType.Brave]: [Chain.Ethereum],
  [WalletType.CreateKeystore]: AllChainsSupported,
  [WalletType.Keplr]: [Chain.Cosmos],
  [WalletType.Keystore]: AllChainsSupported,
  [WalletType.Ledger]: AllChainsSupported,
  [WalletType.MetaMask]: [Chain.Ethereum, Chain.Avalanche],
  [WalletType.Phantom]: [Chain.Solana],
  [WalletType.Phrase]: AllChainsSupported,
  [WalletType.TrustWallet]: [Chain.THORChain, Chain.Ethereum, Chain.Binance],
  [WalletType.Xdefi]: [
    Chain.Avalanche,
    Chain.Binance,
    Chain.Bitcoin,
    Chain.BitcoinCash,
    Chain.Doge,
    Chain.Ethereum,
    Chain.Litecoin,
    Chain.Solana,
    Chain.THORChain,
  ],
};

const COMMON_WALLETS = [
  WalletType.CreateKeystore,
  WalletType.Keystore,
  WalletType.Ledger,
  WalletType.Phrase,
] as const;

export const availableWalletsByChain: Record<SupportedChain, WalletType[]> = {
  [Chain.Avalanche]: [...COMMON_WALLETS, WalletType.MetaMask, WalletType.Xdefi],
  [Chain.Binance]: [...COMMON_WALLETS, WalletType.TrustWallet, WalletType.Xdefi],
  [Chain.BitcoinCash]: [...COMMON_WALLETS, WalletType.Xdefi],
  [Chain.Bitcoin]: [...COMMON_WALLETS, WalletType.Xdefi],
  [Chain.Cosmos]: [...COMMON_WALLETS, WalletType.Keplr],
  [Chain.Doge]: [...COMMON_WALLETS, WalletType.Xdefi],
  [Chain.Litecoin]: [...COMMON_WALLETS, WalletType.Xdefi],
  [Chain.Solana]: [...COMMON_WALLETS, WalletType.Xdefi, WalletType.Phantom],
  [Chain.THORChain]: [...COMMON_WALLETS, WalletType.TrustWallet, WalletType.Xdefi],
  [Chain.Ethereum]: [
    ...COMMON_WALLETS,
    WalletType.MetaMask,
    WalletType.TrustWallet,
    WalletType.Xdefi,
  ],
};
