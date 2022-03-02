import { SupportedChain, Wallet } from '@thorswap-lib/multichain-sdk'
import { Keystore } from '@thorswap-lib/xchain-crypto'

export interface State {
  isConnectModalOpen: boolean
  keystore: Keystore | null
  wallet: Wallet | null
  chainWalletLoading: { [key in SupportedChain]: boolean }
  walletLoading: boolean
}
