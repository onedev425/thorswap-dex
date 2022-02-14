import { AssetTickerType } from 'components/AssetIcon/types'

export type SelectChainProps = {
  isOpened: boolean
  handleClose: () => void
  chainList: ChainListType[]
  handleChainSelected: (chain: AssetTickerType) => void
  handleConnnect: () => void
}

export type ChainListType = {
  name: AssetTickerType
  isConnected: boolean
}

export const ChainList: ChainListType[] = [
  {
    name: 'BTC',
    isConnected: true,
  },
  {
    name: 'ETH',
    isConnected: false,
  },
  {
    name: 'BNB',
    isConnected: false,
  },
  {
    name: 'DOGE',
    isConnected: false,
  },
  {
    name: 'LTC',
    isConnected: false,
  },
  {
    name: 'BCH',
    isConnected: false,
  },
]
