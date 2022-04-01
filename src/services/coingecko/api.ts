import axios from 'axios'

import { geckoCoinIndex } from './coinIndex'

export const getGeckoData = async (symbols: string[]) => {
  const parsedSymbols = symbols.map((symbol) => symbol.split('-')[0])
  const coinIds = parsedSymbols.map((parsedSymbol) => {
    const coinId = geckoCoinIndex.find(
      (coin) => coin.symbol === parsedSymbol.toLowerCase(),
    )

    if (!coinId) return null

    return coinId
  })

  const connectedCoinId = coinIds.map((coinId) => coinId?.id).join(',')

  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${connectedCoinId}&sparkline=true`,
  )

  return data.length > 0 ? { data } : { data: [] }
}
