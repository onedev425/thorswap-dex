import { Chain, WalletOption } from "@swapkit/sdk";
import type { SupportedWalletOptions } from "store/thorswap/types";

export enum WalletType {
  Brave = "Brave",
  CoinbaseExtension = "CoinbaseExtension",
  CoinbaseMobile = "CoinbaseMobile",
  CreateKeystore = "CreateKeystore",
  Keplr = "Keplr",
  Keystore = "Keystore",
  Ledger = "Ledger",
  MetaMask = "MetaMask",
  Okx = "Okx",
  OkxMobile = "OkxMobile",
  Phrase = "Phrase",
  Rainbow = "Rainbow",
  Trezor = "Trezor",
  TrustWallet = "TrustWallet",
  TrustWalletExtension = "TrustWalletExtension",
  Walletconnect = "Walletconnect",
  Xdefi = "Xdefi",
  Keepkey = "Keepkey",
}

export const WalletNameByWalletType: Record<WalletType, string> = {
  [WalletType.Brave]: "Brave",
  [WalletType.CoinbaseExtension]: "Coinbase Extension",
  [WalletType.CoinbaseMobile]: "Coinbase Wallet",
  [WalletType.CreateKeystore]: "Create Keystore",
  [WalletType.Keepkey]: "Keepkey",
  [WalletType.Keplr]: "Keplr",
  [WalletType.Keystore]: "Keystore",
  [WalletType.Ledger]: "Ledger",
  [WalletType.MetaMask]: "MetaMask",
  [WalletType.OkxMobile]: "OKX App",
  [WalletType.Okx]: "OKX",
  [WalletType.Phrase]: "Phrase",
  [WalletType.Rainbow]: "Rainbow",
  [WalletType.Trezor]: "Trezor",
  [WalletType.TrustWalletExtension]: "TrustWallet Extension",
  [WalletType.TrustWallet]: "TrustWallet",
  [WalletType.Walletconnect]: "Walletconnect",
  [WalletType.Xdefi]: "Xdefi",
};

export const WalletOptionByWalletType: Record<WalletType, WalletOption> = {
  [WalletType.Brave]: WalletOption.BRAVE,
  [WalletType.CoinbaseExtension]: WalletOption.COINBASE_WEB,
  [WalletType.CoinbaseMobile]: WalletOption.COINBASE_MOBILE,
  [WalletType.CreateKeystore]: WalletOption.KEYSTORE,
  [WalletType.Keepkey]: WalletOption.KEEPKEY,
  [WalletType.Keplr]: WalletOption.KEPLR,
  [WalletType.Keystore]: WalletOption.KEYSTORE,
  [WalletType.Ledger]: WalletOption.LEDGER,
  [WalletType.MetaMask]: WalletOption.METAMASK,
  [WalletType.OkxMobile]: WalletOption.OKX_MOBILE,
  [WalletType.Okx]: WalletOption.OKX,
  [WalletType.Phrase]: WalletOption.KEYSTORE,
  [WalletType.Rainbow]: WalletOption.WALLETCONNECT,
  [WalletType.Trezor]: WalletOption.TREZOR,
  [WalletType.TrustWalletExtension]: WalletOption.TRUSTWALLET_WEB,
  [WalletType.TrustWallet]: WalletOption.WALLETCONNECT,
  [WalletType.Walletconnect]: WalletOption.WALLETCONNECT,
  [WalletType.Xdefi]: WalletOption.XDEFI,
};

export const WalletNameByWalletOption: Record<SupportedWalletOptions, string> = {
  [WalletOption.BRAVE]: WalletType.Brave,
  [WalletOption.COINBASE_WEB]: "Coinbase Extension",
  [WalletOption.COINBASE_MOBILE]: "Coinbase Wallet App",
  [WalletOption.KEEPKEY]: WalletType.Keepkey,
  [WalletOption.KEPLR]: WalletType.Keplr,
  [WalletOption.KEYSTORE]: WalletType.Keystore,
  [WalletOption.LEDGER]: WalletType.Ledger,
  [WalletOption.METAMASK]: WalletType.MetaMask,
  [WalletOption.OKX]: WalletType.Okx,
  [WalletOption.OKX_MOBILE]: WalletType.OkxMobile,
  [WalletOption.TREZOR]: WalletType.Trezor,
  [WalletOption.TRUSTWALLET_WEB]: "Trustwallet Web",
  [WalletOption.WALLETCONNECT]: WalletType.Walletconnect,
  [WalletOption.XDEFI]: WalletType.Xdefi,
};

const UTXOChainsSupported = [Chain.Bitcoin, Chain.Dogecoin, Chain.Litecoin, Chain.BitcoinCash];
const EVMChainsSupported = [
  Chain.Ethereum,
  Chain.BinanceSmartChain,
  Chain.Avalanche,
  Chain.Arbitrum,
];
const AllChainsSupportedExceptNewProvider = [
  ...EVMChainsSupported,
  ...UTXOChainsSupported,
  Chain.Cosmos,
  Chain.THORChain,
] as Chain[];
const AllChainsSupported = [
  ...AllChainsSupportedExceptNewProvider,
  Chain.Polkadot,
  Chain.Maya,
  Chain.Dash,
  Chain.Kujira,
  Chain.Arbitrum,
] as Chain[];

export const availableChainsByWallet: Record<WalletType, Chain[]> = {
  [WalletType.Brave]: EVMChainsSupported,
  [WalletType.CoinbaseExtension]: EVMChainsSupported,
  [WalletType.CoinbaseMobile]: EVMChainsSupported,
  [WalletType.CreateKeystore]: AllChainsSupported,
  [WalletType.Keepkey]: [...AllChainsSupportedExceptNewProvider, Chain.Dash, Chain.Maya],
  [WalletType.Keplr]: [Chain.Cosmos, Chain.Kujira],
  [WalletType.Keystore]: AllChainsSupported,
  [WalletType.Ledger]: [
    ...AllChainsSupportedExceptNewProvider.filter((chain) => chain !== Chain.BinanceSmartChain),
    Chain.Dash,
  ],
  [WalletType.MetaMask]: EVMChainsSupported,
  [WalletType.OkxMobile]: EVMChainsSupported,
  [WalletType.Okx]: [...EVMChainsSupported, Chain.Bitcoin, Chain.Cosmos],
  [WalletType.Phrase]: AllChainsSupported,
  [WalletType.Rainbow]: [Chain.Ethereum],
  [WalletType.Trezor]: [...EVMChainsSupported, ...UTXOChainsSupported, Chain.Dash],
  [WalletType.TrustWalletExtension]: EVMChainsSupported,
  [WalletType.TrustWallet]: [...EVMChainsSupported, Chain.THORChain],
  [WalletType.Walletconnect]: EVMChainsSupported,
  [WalletType.Xdefi]: [...AllChainsSupportedExceptNewProvider, Chain.Maya, Chain.Kujira],
};
