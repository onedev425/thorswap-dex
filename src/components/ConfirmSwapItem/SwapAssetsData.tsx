import { AssetDataType } from 'components/ConfirmSwapItem/types'

export const swapItem = [
  {
    title: 'Send',
    amount: '1',
    assetTicker: 'RUNE',
    icon: 'RUNE',
  },
  {
    title: 'Receive',
    amount: '0.013219',
    assetTicker: 'BTC',
    icon: 'BTC',
  },
  {
    title: 'Recipent Address',
    amount: 'bc234567898765432112345',
  },

  {
    title: 'Slip',
    amount: '0.002%',
    infoIcon: 'info',
  },
  {
    title: 'Min Received',
    amount: '0.0130868',
    assetTicker: 'BTC',
    infoIcon: 'info',
  },
  {
    title: 'Network Fee',
    amount: '0.001125',
    assetTicker: 'BTC',
    infoIcon: 'info',
  },
  {
    title: 'Total Fee',
    amount: '$ 5.00',
    infoIcon: 'info',
  },
  {
    title: 'Estimated Time',
    amount: '<5s',
    infoIcon: 'info',
  },
] as AssetDataType[]
