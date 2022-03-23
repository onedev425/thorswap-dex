import { useMemo } from 'react'

import {
  AssetAmount,
  chainToSigAsset,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'
import { GeckoData } from '@thorswap-lib/thorswap-client/lib/redux/wallet/types'
import {
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
  DOGEChain,
  TERRAChain,
} from '@thorswap-lib/xchain-util'
import { BigNumber } from 'bignumber.js'

import { useWallet } from 'redux/wallet/hooks'

import { formatPrice } from 'helpers/formatPrice'

const emptyWallet = {
  [BTCChain]: null,
  [BNBChain]: null,
  [THORChain]: null,
  [ETHChain]: null,
  [LTCChain]: null,
  [BCHChain]: null,
  [DOGEChain]: null,
  [TERRAChain]: null,
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

  return formatPrice(total.toNumber())
}

export const useAccountData = (chain: SupportedChain) => {
  const sigAsset = chainToSigAsset(chain)
  const {
    geckoData,
    wallet: reduxWallet,
    chainWalletLoading,
    setIsConnectModalOpen,
  } = useWallet()
  const wallet = reduxWallet || emptyWallet
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

  const chainInfo = useMemo(
    () =>
      (walletBalance as AssetAmount[]).reduce((acc, item) => {
        if (item.asset.eq(sigAsset)) {
          acc.unshift(item)
        } else {
          acc.push(item)
        }

        return acc as AssetAmount[]
      }, [] as AssetAmount[]),
    [walletBalance, sigAsset],
  )

  const data = useMemo(
    () => ({
      activeAsset24hChange: price24hChangePercent,
      activeAssetPrice: formatPrice(currentPrice),
      balance: getBalanceByChain(walletBalance, geckoData),
      chainAddress,
      chainInfo,
      chainWalletLoading,
      geckoData,
      setIsConnectModalOpen,
    }),
    [
      chainAddress,
      chainInfo,
      chainWalletLoading,
      currentPrice,
      geckoData,
      price24hChangePercent,
      setIsConnectModalOpen,
      walletBalance,
    ],
  )

  return data
}

export const useChartData = (chain: SupportedChain) => {
  const sigAsset = chainToSigAsset(chain)
  const { geckoData } = useWallet()
  const prices = useMemo(
    () => geckoData[sigAsset.symbol]?.sparkline_in_7d?.price || [],
    [geckoData, sigAsset.symbol],
  )

  const chartData = useMemo(
    () => ({
      label: `${chain} Price`,
      values: prices.slice(-prices.length / 2),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prices.length],
  )

  return chartData
}
