import { useMemo } from 'react'

import {
  AssetAmount,
  chainToSigAsset,
  SupportedChain,
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
} from '@thorswap-lib/xchain-util'
import { BigNumber } from 'bignumber.js'

import { useWallet } from 'redux/wallet/hooks'
import { GeckoData } from 'redux/wallet/types'

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

  return total
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
  const { balance, address: chainAddress } = wallet[chain] || {
    balance: [] as AssetAmount[],
    address: '',
  }

  const { activeAsset24hChange, activeAssetPrice } = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { price_change_percentage_24h, current_price } = geckoData[
      sigAsset.symbol
    ] || {
      price_change_percentage_24h: 0,
      current_price: 0,
    }

    return {
      activeAsset24hChange: price_change_percentage_24h,
      activeAssetPrice: current_price,
    }
  }, [geckoData, sigAsset.symbol])

  const chainInfo = useMemo(
    () =>
      balance.reduce((acc, item) => {
        if (item.asset.eq(sigAsset)) {
          acc.unshift(item)
        } else {
          acc.push(item)
        }

        return acc as AssetAmount[]
      }, [] as AssetAmount[]),
    [balance, sigAsset],
  )

  const data = useMemo(
    () => ({
      activeAsset24hChange,
      activeAssetPrice,
      balance: getBalanceByChain(balance, geckoData),
      chainAddress,
      chainInfo,
      chainWalletLoading,
      geckoData,
      setIsConnectModalOpen,
    }),
    [
      activeAsset24hChange,
      activeAssetPrice,
      balance,
      chainAddress,
      chainInfo,
      chainWalletLoading,
      geckoData,
      setIsConnectModalOpen,
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
