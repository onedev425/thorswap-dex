import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

export enum WalletStage {
  'WalletSelect' = 'WalletSelect',
  'ChainSelect' = 'ChainSelect',
  'Final' = 'Final',
}

export enum WalletMode {
  'Keystore' = 'Keystore',
  'Create' = 'Create',
  'Phrase' = 'Phrase',
  'Ledger' = 'Ledger',
  'TrustWallet' = 'TrustWallet',
  'MetaMask' = 'MetaMask',
  'Xdefi' = 'Xdefi',
  'Select' = 'Select',
  'Terra' = 'Terra',
}

export const availableChainsByWallet: Record<string, SupportedChain[]> = {
  MetaMask: [Chain.Ethereum],
  Keystore: [
    Chain.THORChain,
    Chain.Terra,
    Chain.Bitcoin,
    Chain.Ethereum,
    Chain.Binance,
    Chain.Doge,
    Chain.Litecoin,
    Chain.BitcoinCash,
  ],
  Ledger: [
    Chain.THORChain,
    Chain.Bitcoin,
    Chain.Binance,
    Chain.Doge,
    Chain.Litecoin,
    Chain.BitcoinCash,
  ],
  TrustWallet: [Chain.THORChain, Chain.Terra, Chain.Ethereum, Chain.Binance],
  Xdefi: [
    Chain.THORChain,
    Chain.Terra,
    Chain.Bitcoin,
    Chain.Ethereum,
    Chain.Binance,
    Chain.Doge,
    Chain.Litecoin,
    Chain.BitcoinCash,
  ],
}
