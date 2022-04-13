import axios from 'axios'

import { GeckoData, GeckoDataWithSymbols } from 'store/wallet/types'
const coinIndex = import('./coinIndex').then(
  ({ geckoCoinIndex }) => geckoCoinIndex,
)

export const getGeckoData = async (
  symbols: string[],
): Promise<{ data: GeckoDataWithSymbols[] }> => {
  const symbolsMap: Record<string, string> = {}
  const parsedSymbols: string[] = []

  symbols.forEach((symbol) => {
    const coinSymbol = symbol.split('-')[0]
    parsedSymbols.push(coinSymbol)
    symbolsMap[coinSymbol] = symbol
  })

  const coinGeckoIndex = await coinIndex
  const coinIds = parsedSymbols.map((parsedSymbol) => {
    const coinId = coinGeckoIndex.find(
      (coin) => coin.symbol === parsedSymbol.toLowerCase(),
    )

    if (!coinId) return null

    return coinId
  })

  const connectedCoinId = coinIds.map((coinId) => coinId?.id).join(',')

  const { data } = await axios.get<GeckoData[]>(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${connectedCoinId}&sparkline=true`,
  )

  if (data?.length) {
    const dataWithSymbols = data.map((geckoData) => ({
      symbol: symbolsMap[geckoData.symbol.toUpperCase()],
      geckoData,
    }))

    return { data: dataWithSymbols }
  }

  return { data: [] }
}
