import { IconName } from 'components/Icon'

export type WalletTypes = {
  icon: IconName
  name: string
  id: string
}

export const WalletOptions: WalletTypes[] = [
  {
    name: 'XDEFI Wallet',
    icon: 'xdefi',
    id: 'xdefi',
  },
  {
    name: 'WalletConnect',
    icon: 'walletConnect',
    id: 'wallet-connect',
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
]
