import { useMemo } from 'react'

import {
  Amount,
  Asset,
  AssetAmount,
  SupportedChain,
  chainToSigAsset,
} from '@thorswap-lib/multichain-sdk'
import {
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
  DOGEChain,
  TERRAChain,
  SOLChain,
  CosmosChain,
} from '@thorswap-lib/xchain-util'
import { BigNumber } from 'bignumber.js'
import { takeRight } from 'lodash'

import { useMidgard } from 'store/midgard/hooks'
import { useWallet } from 'store/wallet/hooks'
import { GeckoData } from 'store/wallet/types'

const emptyWallet = {
  [BTCChain]: null,
  [BNBChain]: null,
  [THORChain]: null,
  [ETHChain]: null,
  [LTCChain]: null,
  [BCHChain]: null,
  [DOGEChain]: null,
  [TERRAChain]: null,
  [SOLChain]: null,
  [CosmosChain]: null,
}

const getBalanceByChain = (
  balance: AssetAmount[],
  geckoData: Record<string, GeckoData>,
) => {
  if (!balance?.length) return 0
  let total = new BigNumber(0)

  balance.forEach(({ asset, amount }) => {
    const usdPrice = geckoData?.[asset.symbol]?.current_price || 0
    total = total.plus(amount.assetAmount.multipliedBy(usdPrice))
  })

  return total.toNumber()
}

export const useAccountData = (chain: SupportedChain) => {
  const sigAsset = chainToSigAsset(chain)
  const { stats } = useMidgard()
  const {
    geckoData,
    wallet: reduxWallet,
    chainWalletLoading,
    setIsConnectModalOpen,
    disconnectWalletByChain,
  } = useWallet()
  const wallet = reduxWallet || emptyWallet
  const chainWallet = wallet[chain]
  const { balance: walletBalance, address: chainAddress } = wallet[chain] || {
    balance: [] as AssetAmount[],
    address: '',
  }
  const {
    price_change_percentage_24h: price24hChangePercent,
    current_price: currentPrice,
  } = geckoData[sigAsset.symbol] || {
    price_change_percentage_24h: 0,
    current_price: 0,
  }

  const runePrice = stats?.runePriceUSD

  const chainInfo = useMemo(() => {
    const info: AssetAmount[] = (walletBalance as AssetAmount[]).reduce(
      (acc, item) => {
        if (item.asset.eq(sigAsset)) {
          acc.unshift(item)
        } else {
          acc.push(item)
        }

        return acc as AssetAmount[]
      },
      [] as AssetAmount[],
    )

    if (chainAddress && !info.length) {
      info.push(getNoBalanceAsset(sigAsset))
    }

    return info
  }, [walletBalance, sigAsset, chainAddress])

  const data = useMemo(
    () => ({
      activeAsset24hChange: price24hChangePercent,
      activeAssetPrice:
        sigAsset.isRUNE() && runePrice ? parseFloat(runePrice) : currentPrice,
      balance: getBalanceByChain(walletBalance, geckoData),
      chainAddress,
      chainInfo,
      chainWallet,
      chainWalletLoading,
      disconnectWalletByChain,
      geckoData,
      setIsConnectModalOpen,
    }),
    [
      chainAddress,
      chainInfo,
      chainWallet,
      chainWalletLoading,
      currentPrice,
      disconnectWalletByChain,
      geckoData,
      price24hChangePercent,
      runePrice,
      setIsConnectModalOpen,
      sigAsset,
      walletBalance,
    ],
  )

  return data
}

export const useChartData = (asset: Asset) => {
  const { stats } = useMidgard()
  const { geckoData } = useWallet()

  const runePrice = stats?.runePriceUSD

  const prices = useMemo(() => {
    const priceData = geckoData[asset.symbol]?.sparkline_in_7d?.price || []

    if (asset.isRUNE() && runePrice) {
      return [...priceData, parseFloat(runePrice)]
    }

    return priceData
  }, [runePrice, geckoData, asset])

  const chartData = useMemo(
    () => ({
      label: `${asset.symbol} Price`,
      values: takeRight(prices, 64),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prices.length],
  )

  return chartData
}

export const useWalletChainActions = (chain: SupportedChain) => {
  const { wallet, refreshWalletByChain, chainWalletLoading } = useWallet()

  const isLoading = chainWalletLoading?.[chain]

  const handleRefreshChain = () => {
    if (wallet?.[chain]) {
      refreshWalletByChain(chain)
    }
  }

  return { handleRefreshChain, isLoading }
}

const getNoBalanceAsset = (asset: Asset): AssetAmount => {
  return new AssetAmount(asset, Amount.fromNormalAmount(0))
}
