import { Chain, WalletOption } from '@thorswap-lib/types';
import { IS_PROTECTED, IS_STAGENET } from 'settings/config';

export enum WalletType {
  Brave = 'Brave',
  CoinbaseExtension = 'CoinbaseExtension',
  CreateKeystore = 'CreateKeystore',
  Keplr = 'Keplr',
  Keystore = 'Keystore',
  Ledger = 'Ledger',
  MetaMask = 'MetaMask',
  Okx = 'Okx',
  Phrase = 'Phrase',
  Rainbow = 'Rainbow',
  Trezor = 'Trezor',
  TrustWallet = 'TrustWallet',
  TrustWalletExtension = 'TrustWalletExtension',
  Walletconnect = 'Walletconnect',
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
  [WalletType.Rainbow]: 'Rainbow',
  [WalletType.Trezor]: 'Trezor',
  [WalletType.TrustWallet]: 'TrustWallet',
  [WalletType.TrustWalletExtension]: 'TrustWallet Extension',
  [WalletType.CoinbaseExtension]: 'Coinbase Extension',
  [WalletType.Xdefi]: 'Xdefi',
  [WalletType.Walletconnect]: 'Walletconnect',
  [WalletType.Okx]: 'Okx',
};

export const WalletOptionByWalletType: Record<WalletType, WalletOption> = {
  [WalletType.Brave]: WalletOption.BRAVE,
  [WalletType.CreateKeystore]: WalletOption.KEYSTORE,
  [WalletType.Keplr]: WalletOption.KEPLR,
  [WalletType.Keystore]: WalletOption.KEYSTORE,
  [WalletType.Ledger]: WalletOption.LEDGER,
  [WalletType.MetaMask]: WalletOption.METAMASK,
  [WalletType.Phrase]: WalletOption.KEYSTORE,
  [WalletType.Rainbow]: WalletOption.WALLETCONNECT,
  [WalletType.Trezor]: WalletOption.TREZOR,
  [WalletType.TrustWallet]: WalletOption.WALLETCONNECT,
  [WalletType.TrustWalletExtension]: WalletOption.TRUSTWALLET_WEB,
  [WalletType.CoinbaseExtension]: WalletOption.COINBASE_WEB,
  [WalletType.Xdefi]: WalletOption.XDEFI,
  [WalletType.Walletconnect]: WalletOption.WALLETCONNECT,
  [WalletType.Okx]: WalletOption.OKX,
};

export const WalletNameByWalletOption: Record<WalletOption, string> = {
  [WalletOption.BRAVE]: WalletType.Brave,
  [WalletOption.KEPLR]: WalletType.Keplr,
  [WalletOption.LEDGER]: WalletType.Ledger,
  [WalletOption.METAMASK]: WalletType.MetaMask,
  [WalletOption.TREZOR]: WalletType.Trezor,
  [WalletOption.TRUSTWALLET_WEB]: 'Trustwallet Web',
  [WalletOption.WALLETCONNECT]: WalletType.Walletconnect,
  [WalletOption.COINBASE_WEB]: 'Coinbase Extension',
  [WalletOption.XDEFI]: WalletType.Xdefi,
  [WalletOption.KEYSTORE]: WalletType.Keystore,
  [WalletOption.OKX]: WalletType.Okx,
};

const BETA_CHAINS = IS_PROTECTED || IS_STAGENET ? [Chain.BinanceSmartChain] : [];

const AllChainsSupported = [
  Chain.Avalanche,
  Chain.Binance,
  Chain.Bitcoin,
  Chain.BitcoinCash,
  Chain.Cosmos,
  Chain.Dogecoin,
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
  [WalletType.Rainbow]: [Chain.Ethereum],
  [WalletType.Trezor]: [
    ...EVMChainsSupported,
    Chain.Bitcoin,
    Chain.Dogecoin,
    Chain.Litecoin,
    Chain.BitcoinCash,
  ],
  [WalletType.TrustWallet]: [Chain.Avalanche, Chain.Ethereum, Chain.THORChain, ...BETA_CHAINS],
  [WalletType.TrustWalletExtension]: EVMChainsSupported,
  [WalletType.Xdefi]: AllChainsSupported,
  [WalletType.Walletconnect]: [Chain.Ethereum, Chain.Avalanche, ...BETA_CHAINS],
  [WalletType.Okx]: [Chain.Avalanche, Chain.Bitcoin, Chain.Ethereum, Chain.Cosmos].concat(
    BETA_CHAINS,
  ),
};
