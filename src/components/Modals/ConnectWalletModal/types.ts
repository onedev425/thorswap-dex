import { Chain, SupportedChain } from '@thorswap-lib/types';

export enum WalletType {
  Keystore = 'Keystore',
  CreateKeystore = 'CreateKeystore',
  Phrase = 'Phrase',
  Ledger = 'Ledger',
  TrustWallet = 'TrustWallet',
  MetaMask = 'MetaMask',
  Xdefi = 'Xdefi',
  Phantom = 'Phantom',
  Keplr = 'Keplr',
}

// Left as a placeholder for future chains
// const STAGENET_CHAINS = IS_STAGENET ? [Chain.Polkadot] : [];
// ...STAGENET_CHAINS,
const Keystore = [
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
  [WalletType.CreateKeystore]: Keystore,
  [WalletType.Keplr]: [Chain.Cosmos],
  [WalletType.Keystore]: Keystore,
  [WalletType.MetaMask]: [Chain.Ethereum, Chain.Avalanche],
  [WalletType.Phantom]: [Chain.Solana],
  [WalletType.Phrase]: Keystore,
  [WalletType.TrustWallet]: [Chain.THORChain, Chain.Ethereum, Chain.Binance],
  [WalletType.Ledger]: [
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
  ],
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

const COMMON_WALLETS = [WalletType.Keystore, WalletType.CreateKeystore, WalletType.Phrase] as const;

export const ALL_WALLET_OPTIONS = [
  WalletType.Keplr,
  WalletType.Ledger,
  WalletType.MetaMask,
  WalletType.Phantom,
  WalletType.TrustWallet,
  WalletType.Xdefi,
  ...COMMON_WALLETS,
];

export const availableWalletsByChain: Record<SupportedChain, WalletType[]> = {
  [Chain.Avalanche]: [WalletType.Xdefi, WalletType.Ledger, WalletType.MetaMask, ...COMMON_WALLETS],
  [Chain.Bitcoin]: [WalletType.Xdefi, WalletType.Ledger, ...COMMON_WALLETS],
  [Chain.Binance]: [WalletType.Xdefi, WalletType.Ledger, WalletType.TrustWallet, ...COMMON_WALLETS],
  [Chain.BitcoinCash]: [WalletType.Xdefi, WalletType.Ledger, ...COMMON_WALLETS],
  [Chain.Cosmos]: [WalletType.Keplr, WalletType.Ledger, ...COMMON_WALLETS],
  [Chain.Doge]: [WalletType.Xdefi, WalletType.Ledger, ...COMMON_WALLETS],
  [Chain.Ethereum]: [
    WalletType.Ledger,
    WalletType.MetaMask,
    WalletType.TrustWallet,
    WalletType.Xdefi,
    ...COMMON_WALLETS,
  ],
  [Chain.Litecoin]: [WalletType.Xdefi, WalletType.Ledger, ...COMMON_WALLETS],
  [Chain.THORChain]: [
    WalletType.Ledger,
    WalletType.TrustWallet,
    WalletType.Xdefi,
    ...COMMON_WALLETS,
  ],
  [Chain.Solana]: [WalletType.Xdefi, WalletType.Phantom, WalletType.Ledger, ...COMMON_WALLETS],
};
