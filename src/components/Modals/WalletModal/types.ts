import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import { IS_STAGENET_OR_DEV } from 'settings/config'

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
  Terra = 'Terra',
  TerraMobile = 'TerraMobile',
  Phantom = 'Phantom',
  Keplr = 'Keplr',
}

const stagenetChains = IS_STAGENET_OR_DEV ? [Chain.Cosmos] : []

const Keystore = [
  Chain.THORChain,
  Chain.Terra,
  Chain.Bitcoin,
  Chain.Solana,
  Chain.Ethereum,
  Chain.Binance,
  Chain.Doge,
  Chain.Litecoin,
  Chain.BitcoinCash,
].concat(stagenetChains) as SupportedChain[]

export const availableChainsByWallet: Record<string, SupportedChain[]> = {
  MetaMask: [Chain.Ethereum],
  Phantom: [Chain.Solana],
  Keplr: [Chain.Cosmos],
  Keystore,
  Ledger: [
    Chain.THORChain,
    Chain.Bitcoin,
    // TODO: https://linear.app/thorswap/issue/FRT-810/[add]-ledger-support-for-solana
    // Chain.Solana,
    Chain.Binance,
    Chain.Doge,
    Chain.Litecoin,
    Chain.BitcoinCash,
  ],
  TrustWallet: [Chain.THORChain, Chain.Ethereum, Chain.Binance],
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
