import { Chain, WalletOption } from '@thorswap-lib/types';
import { IS_BETA, IS_DEV_API } from 'settings/config';

export enum WalletType {
  Brave = 'Brave',
  CreateKeystore = 'CreateKeystore',
  Keplr = 'Keplr',
  Keystore = 'Keystore',
  Ledger = 'Ledger',
  MetaMask = 'MetaMask',
  Phrase = 'Phrase',
  Trezor = 'Trezor',
  // TODO: Remove when trustwallet is removed from SK
  TrustWallet = 'TrustWallet',
  Walletconnect = 'Walletconnect',
  TrustWalletExtension = 'TrustWalletExtension',
  CoinbaseExtension = 'CoinbaseExtension',
  Xdefi = 'Xdefi',
}

export const WalletNameByWalletType: Record<WalletType, string> = {
  [WalletType.Brave]: 'Brave',
  [WalletType.CreateKeystore]: 'Create Keystore',
  [WalletType.Keplr]: 'Keplr',
  [WalletType.Keystore]: 'Keystore',
  [WalletType.Ledger]: 'Ledger',
  [WalletType.MetaMask]: 'MetaMask',
  [WalletType.Phrase]: 'Phrase',
  [WalletType.Trezor]: 'Trezor',
  // TODO: Remove when trustwallet is removed from SK
  [WalletType.TrustWallet]: 'TrustWallet',
  [WalletType.TrustWalletExtension]: 'TrustWallet Extension',
  [WalletType.CoinbaseExtension]: 'Coinbase Extension',
  [WalletType.Xdefi]: 'Xdefi',
  [WalletType.Walletconnect]: 'Walletconnect',
};

export const WalletOptionByWalletType: Record<WalletType, WalletOption> = {
  [WalletType.Brave]: WalletOption.BRAVE,
  [WalletType.CreateKeystore]: WalletOption.KEYSTORE,
  [WalletType.Keplr]: WalletOption.KEPLR,
  [WalletType.Keystore]: WalletOption.KEYSTORE,
  [WalletType.Ledger]: WalletOption.LEDGER,
  [WalletType.MetaMask]: WalletOption.METAMASK,
  [WalletType.Phrase]: WalletOption.KEYSTORE,
  [WalletType.Trezor]: WalletOption.TREZOR,
  // TODO: Remove when trustwallet is removed from SK
  [WalletType.TrustWallet]: WalletOption.TRUSTWALLET,
  [WalletType.TrustWalletExtension]: WalletOption.TRUSTWALLET_WEB,
  [WalletType.CoinbaseExtension]: WalletOption.COINBASE_WEB,
  [WalletType.Xdefi]: WalletOption.XDEFI,
  [WalletType.Walletconnect]: WalletOption.WALLETCONNECT,
};

export const WalletNameByWalletOption: Record<WalletOption, string> = {
  [WalletOption.BRAVE]: WalletType.Brave,
  [WalletOption.KEPLR]: WalletType.Keplr,
  [WalletOption.LEDGER]: WalletType.Ledger,
  [WalletOption.METAMASK]: WalletType.MetaMask,
  [WalletOption.TREZOR]: WalletType.Trezor,
  // TODO: Remove when trustwallet is removed from SK
  [WalletOption.TRUSTWALLET]: WalletType.TrustWallet,
  [WalletOption.TRUSTWALLET_WEB]: 'Trustwallet Web',
  [WalletOption.WALLETCONNECT]: WalletType.Walletconnect,
  [WalletOption.COINBASE_WEB]: 'Coinbase Extension',
  [WalletOption.XDEFI]: WalletType.Xdefi,
  [WalletOption.KEYSTORE]: WalletType.Keystore,
};

const BETA_CHAINS = IS_BETA || IS_DEV_API ? [Chain.BinanceSmartChain] : [];

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
].concat(BETA_CHAINS) as Chain[];

const EVMChainsSupported = [Chain.Ethereum, Chain.Avalanche].concat(BETA_CHAINS) as Chain[];

export const availableChainsByWallet: Record<WalletType, Chain[]> = {
  [WalletType.Brave]: EVMChainsSupported,
  [WalletType.CoinbaseExtension]: EVMChainsSupported,
  [WalletType.CreateKeystore]: AllChainsSupported,
  [WalletType.Keplr]: [Chain.Cosmos],
  [WalletType.Keystore]: AllChainsSupported,
  [WalletType.Ledger]: AllChainsSupported,
  [WalletType.MetaMask]: EVMChainsSupported,
  [WalletType.Phrase]: AllChainsSupported,
  [WalletType.Trezor]: [
    ...EVMChainsSupported,
    Chain.Bitcoin,
    Chain.Doge,
    Chain.Litecoin,
    Chain.BitcoinCash,
  ],
  [WalletType.TrustWalletExtension]: EVMChainsSupported,
  // TODO: Remove when trustwallet is removed from SK
  [WalletType.TrustWallet]: [],
  [WalletType.Xdefi]: AllChainsSupported,
  [WalletType.Walletconnect]: [Chain.Ethereum, Chain.Avalanche],
};
