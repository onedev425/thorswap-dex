import { useEffect, useMemo, useState } from 'react'

import {
  Asset,
  hasConnectedWallet,
  hasWalletConnected,
  QuoteMode,
} from '@thorswap-lib/multichain-sdk'
import { SupportedChain, WalletOption } from '@thorswap-lib/types'
import { TS_AGGREGATOR_PROXY_ADDRESS } from 'config/constants'

import { useMidgard } from 'store/midgard/hooks'
import { TxTrackerStatus } from 'store/midgard/types'
import { useWallet } from 'store/wallet/hooks'

import { multichain } from 'services/multichain'

type Params = {
  force?: boolean
  asset: Asset
  quoteMode: QuoteMode
  contract: string
}

const useApproveResult = ({
  asset,
  contractAddress,
  hasWallet,
  skip,
}: {
  asset: Asset
  contractAddress?: string
  hasWallet: boolean
  skip: boolean
}) => {
  const { approveStatus } = useMidgard()
  const { wallet } = useWallet()
  const [isApproved, setApproved] = useState(hasWallet ? null : true)
  const [isLoading, setIsLoading] = useState(false)

  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet])

  useEffect(() => {
    if (skip) {
      return setApproved(false)
    }

    if (!hasWallet || !isWalletConnected) {
      setApproved(true)
    } else {
      const checkApproved = async () => {
        if (approveStatus?.[asset.toString()] === TxTrackerStatus.Success) {
          setApproved(true)
        }

        setIsLoading(true)
        const approved = await (contractAddress
          ? multichain().isAssetApprovedForContract(asset, contractAddress)
          : multichain().isAssetApproved(asset))
        setApproved(approved)
        setIsLoading(false)
      }

      try {
        checkApproved()
      } catch {
        setIsLoading(false)
      }
    }
  }, [
    asset,
    approveStatus,
    hasWallet,
    isWalletConnected,
    contractAddress,
    skip,
  ])

  return { isApproved, isLoading }
}

export const useIsAssetApproved = ({
  force,
  contract,
  asset,
  quoteMode,
}: Params) => {
  const { wallet, chainWalletLoading } = useWallet()

  const isLedger = useMemo(() => {
    if (!wallet) return false

    return (
      wallet[asset.L1Chain as SupportedChain]?.walletType ===
      WalletOption.LEDGER
    )
  }, [asset.L1Chain, wallet])

  const isAssetWalletConnected = useMemo(
    () => asset && hasWalletConnected({ wallet, inputAssets: [asset] }),
    [asset, wallet],
  )

  const assetApprove = useApproveResult({
    skip: typeof force === 'boolean' ? !force : isLedger,
    asset,
    contractAddress: [
      QuoteMode.ETH_TO_TC_SUPPORTED,
      QuoteMode.ETH_TO_ETH,
    ].includes(quoteMode)
      ? quoteMode === QuoteMode.ETH_TO_TC_SUPPORTED
        ? TS_AGGREGATOR_PROXY_ADDRESS
        : contract
      : undefined,
    hasWallet:
      !chainWalletLoading?.[asset?.L1Chain as SupportedChain] ||
      isAssetWalletConnected,
  })

  return assetApprove
}
