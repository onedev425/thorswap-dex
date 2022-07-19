import { AssetAmount } from '@thorswap-lib/multichain-sdk'

export type MultisigMember = { name: string; pubKey: string }

export type MultisigWallet = {
  address: string
  members: MultisigMember[]
  name: string
  treshold: number
}

export type State = MultisigWallet & {
  balances: AssetAmount[]
  loadingBalances: boolean
}
