import axios from 'axios'

import { geckoCoinIndex } from './coinIndex'

export const getGeckoData = async (symbol: string) => {
  const parsedSymbol = symbol.split('-')[0]
  const coinId = geckoCoinIndex.find(
    (coin) => coin.symbol === parsedSymbol.toLowerCase(),
  )

  if (!coinId) return { symbol, data: {} }

  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId.id}&sparkline=true`,
  )

  return data.length > 0 ? { symbol, data: data[0] } : { symbol, data: {} }
}
