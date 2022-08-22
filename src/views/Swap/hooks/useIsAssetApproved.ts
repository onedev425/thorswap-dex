import { useMemo } from 'react'

import {
  Asset,
  hasWalletConnected,
  QuoteMode,
} from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'
import { TS_AGGREGATOR_PROXY_ADDRESS } from 'config/constants'

import { useWallet } from 'store/wallet/hooks'

import { useApprove } from 'hooks/useApprove'
import { useApproveContract } from 'hooks/useApproveContract'

type Params = {
  asset: Asset
  quoteMode: QuoteMode
  contract: string
}

export const useIsAssetApproved = ({ contract, asset, quoteMode }: Params) => {
  const { wallet, chainWalletLoading } = useWallet()

  const isAssetWalletConnected = useMemo(
    () => asset && hasWalletConnected({ wallet, inputAssets: [asset] }),
    [asset, wallet],
  )
  const assetApprove = useApprove(asset, isAssetWalletConnected)

  const contractApprove = useApproveContract(
    asset,
    quoteMode === QuoteMode.ETH_TO_TC_SUPPORTED
      ? TS_AGGREGATOR_PROXY_ADDRESS
      : contract,
    !chainWalletLoading?.[asset?.L1Chain as SupportedChain] ||
      isAssetWalletConnected,
  )

  return useMemo(
    () =>
      [QuoteMode.ETH_TO_TC_SUPPORTED, QuoteMode.ETH_TO_ETH].includes(quoteMode)
        ? contractApprove
        : assetApprove,
    [assetApprove, contractApprove, quoteMode],
  )
}
