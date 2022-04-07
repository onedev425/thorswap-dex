import { useEffect, useState, useMemo } from 'react'

import { Asset, hasConnectedWallet } from '@thorswap-lib/multichain-sdk'

import { useMidgard } from 'store/midgard/hooks'
import { TxTrackerStatus } from 'store/midgard/types'
import { useWallet } from 'store/wallet/hooks'

import { multichain } from 'services/multichain'

export const useApprove = (asset: Asset, hasWallet = true) => {
  const { approveStatus } = useMidgard()
  const { wallet } = useWallet()
  const [isApproved, setApproved] = useState<boolean | null>(
    hasWallet ? null : true,
  )

  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet])

  useEffect(() => {
    if (!hasWallet || !isWalletConnected) {
      setApproved(true)
      return
    }

    const checkApproved = async () => {
      if (approveStatus?.[asset.toString()] === TxTrackerStatus.Success) {
        setApproved(true)
      }
      const approved = await multichain.isAssetApproved(asset)
      setApproved(approved)
    }

    checkApproved()
  }, [asset, approveStatus, hasWallet, isWalletConnected])

  const assetApproveStatus = useMemo(
    () => approveStatus?.[asset.toString()],
    [approveStatus, asset],
  )

  return {
    assetApproveStatus,
    isApproved,
  }
}
