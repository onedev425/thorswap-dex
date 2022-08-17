import { SupportedChain, Chain } from '@thorswap-lib/types'

export enum WalletStage {
  WalletSelect = 'WalletSelect',
  ChainSelect = 'ChainSelect',
  Final = 'Final',
}

export enum WalletType {
  Keystore = 'Keystore',
  CreateKeystore = 'CreateKeystore',
  Phrase = 'Phrase',
  Ledger = 'Ledger',
  TrustWallet = 'TrustWallet',
  MetaMask = 'MetaMask',
  Xdefi = 'Xdefi',
  Select = 'Select',
  Phantom = 'Phantom',
  Keplr = 'Keplr',
}

const Keystore = [
  Chain.THORChain,
  Chain.Bitcoin,
  Chain.Solana,
  Chain.Ethereum,
  Chain.Binance,
  Chain.Doge,
  Chain.Litecoin,
  Chain.BitcoinCash,
  Chain.Cosmos,
] as SupportedChain[]

export const availableChainsByWallet: Record<string, SupportedChain[]> = {
  MetaMask: [Chain.Ethereum, Chain.Avalanche],
  Phantom: [Chain.Solana],
  Keplr: [Chain.Cosmos],
  Keystore,
  Ledger: [
    Chain.THORChain,
    Chain.Bitcoin,
    // TODO: https://linear.app/thorswap/issue/FRT-810/[add]-ledger-support-for-solana
    // Chain.Solana,
    Chain.Ethereum,
    Chain.Binance,
    Chain.Cosmos,
    Chain.Doge,
    Chain.Litecoin,
    Chain.BitcoinCash,
  ],
  TrustWallet: [Chain.THORChain, Chain.Ethereum, Chain.Binance],
  Xdefi: [
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
  WalletType.CreateKeystore,
  WalletType.Keystore,
  WalletType.Phrase,
] as const

export const ALL_WALLET_OPTIONS = [
  ...COMMON_WALLETS,
  WalletType.Ledger,
  WalletType.TrustWallet,
  WalletType.MetaMask,
  WalletType.Xdefi,
  WalletType.Phantom,
  WalletType.Keplr,
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
  [Chain.Doge]: [WalletType.Xdefi, ...COMMON_WALLETS],
  [Chain.Litecoin]: [WalletType.Xdefi, ...COMMON_WALLETS],
  [Chain.BitcoinCash]: [WalletType.Xdefi, ...COMMON_WALLETS],
  [Chain.Cosmos]: [WalletType.Keplr, ...COMMON_WALLETS],
  [Chain.Avalanche]: [WalletType.MetaMask, ...COMMON_WALLETS],
}
