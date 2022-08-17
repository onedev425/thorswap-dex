import { SupportedChain, Chain } from '@thorswap-lib/types'

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

const Keystore = [
  // Chain.Avalanche,
  Chain.Binance,
  Chain.Bitcoin,
  Chain.BitcoinCash,
  Chain.Cosmos,
  Chain.Doge,
  Chain.Ethereum,
  Chain.Litecoin,
  Chain.Solana,
  Chain.THORChain,
] as SupportedChain[]

export const availableChainsByWallet: Record<WalletType, SupportedChain[]> = {
  [WalletType.CreateKeystore]: Keystore,
  [WalletType.Keplr]: [Chain.Cosmos],
  [WalletType.Keystore]: Keystore,
  [WalletType.MetaMask]: [Chain.Ethereum, Chain.Avalanche],
  [WalletType.Phantom]: [Chain.Solana],
  [WalletType.Phrase]: Keystore,
  [WalletType.TrustWallet]: [Chain.THORChain, Chain.Ethereum, Chain.Binance],
  [WalletType.Ledger]: [
    Chain.THORChain,
    Chain.Bitcoin,
    Chain.Ethereum,
    Chain.Binance,
    Chain.Cosmos,
    Chain.Doge,
    Chain.Litecoin,
    Chain.BitcoinCash,
    // TODO: https://linear.app/thorswap/issue/FRT-810/[add]-ledger-support-for-solana
    // Chain.Solana,
  ],
  [WalletType.Xdefi]: [
    Chain.THORChain,
    Chain.Bitcoin,
    Chain.Ethereum,
    Chain.Binance,
    Chain.Doge,
    Chain.Litecoin,
    Chain.BitcoinCash,
  ],
}

const COMMON_WALLETS = [
  WalletType.Keystore,
  WalletType.CreateKeystore,
  WalletType.Phrase,
] as const

export const ALL_WALLET_OPTIONS = [
  WalletType.Xdefi,
  WalletType.MetaMask,
  WalletType.Ledger,
  WalletType.TrustWallet,
  WalletType.Phantom,
  WalletType.Keplr,
  ...COMMON_WALLETS,
]

export const availableWalletsByChain: Record<SupportedChain, WalletType[]> = {
  [Chain.Bitcoin]: [WalletType.Xdefi, WalletType.Ledger, ...COMMON_WALLETS],
  [Chain.Ethereum]: [
    WalletType.MetaMask,
    WalletType.Xdefi,
    WalletType.Ledger,
    WalletType.TrustWallet,
    ...COMMON_WALLETS,
  ],
  [Chain.THORChain]: [
    WalletType.Xdefi,
    WalletType.Ledger,
    WalletType.TrustWallet,
    ...COMMON_WALLETS,
  ],
  [Chain.Solana]: [WalletType.Phantom, ...COMMON_WALLETS],
  [Chain.Binance]: [
    WalletType.Xdefi,
    WalletType.Ledger,
    WalletType.TrustWallet,
    ...COMMON_WALLETS,
  ],
  [Chain.Doge]: [WalletType.Xdefi, WalletType.Ledger, ...COMMON_WALLETS],
  [Chain.Litecoin]: [WalletType.Xdefi, WalletType.Ledger, ...COMMON_WALLETS],
  [Chain.BitcoinCash]: [WalletType.Xdefi, WalletType.Ledger, ...COMMON_WALLETS],
  [Chain.Cosmos]: [WalletType.Keplr, WalletType.Ledger, ...COMMON_WALLETS],
  [Chain.Avalanche]: [WalletType.MetaMask, ...COMMON_WALLETS],
}
