import { AssetTickerType } from 'components/AssetIcon/types';
import { IconName } from 'components/Atomic';

export type WalletTypes = {
  icon: IconName;
  name: string;
  id: string;
};

export const WalletOptions: WalletTypes[] = [
  {
    name: 'XDEFI Wallet',
    icon: 'xdefi',
    id: 'xdefi',
  },
  {
    name: 'Trust Wallet',
    icon: 'trustWallet',
    id: 'trust-wallet',
  },
  {
    name: 'Disable XDEFI Wallet',
    icon: 'metamask',
    id: 'metamask',
  },
  {
    name: 'Ledger',
    icon: 'ledger',
    id: 'ledger',
  },
  {
    name: 'KeyStore',
    icon: 'keystore',
    id: 'keystore',
  },
  {
    name: 'Ethereum Wallets',
    icon: 'ethereum',
    id: 'ethereum',
  },
];

export type ChainListType = {
  name: AssetTickerType;
  isConnected: boolean;
};

export const ChainList: ChainListType[] = [
  { name: 'BTC', isConnected: true },
  { name: 'ETH', isConnected: false },
  { name: 'BNB', isConnected: false },
  { name: 'DOGE', isConnected: false },
  { name: 'LTC', isConnected: false },
  { name: 'BCH', isConnected: false },
];
