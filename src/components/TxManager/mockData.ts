import { useCallback, useEffect, useState } from 'react'

import { TxTracker, TxTrackerStatus, TxTrackerType } from 'store/midgard/types'

export const mockTxData: TxTracker[] = [
  {
    uuid: '1',
    type: TxTrackerType.AddLiquidity,
    status: TxTrackerStatus.Pending,
    submitTx: {
      txID: '123',
      inAssets: [
        { amount: '100', asset: 'ETH.USDC-0x1928739' },
        { amount: '1000', asset: 'ETH.THOR-0x1928739' },
      ],
    },
    action: null,
    refunded: null,
  },
  {
    uuid: '2',
    type: TxTrackerType.Swap,
    status: TxTrackerStatus.Failed,
    submitTx: {
      inAssets: [{ amount: '100', asset: 'ETH.USDC-0x1928739' }],
      outAssets: [{ amount: '1234.12345678', asset: 'ETH.THOR-0x1928739' }],
    },
    action: null,
    refunded: null,
  },
  {
    uuid: '3',
    type: TxTrackerType.Mint,
    status: TxTrackerStatus.Success,
    submitTx: {
      txID: '123',
      inAssets: [{ amount: '100', asset: 'ETH.USDC-0x1928739' }],
      outAssets: [{ amount: '100', asset: 'THOR.USDC-0x1928739' }],
    },
    action: null,
    refunded: false,
  },
  {
    uuid: '4',
    type: TxTrackerType.Withdraw,
    status: TxTrackerStatus.Success,
    submitTx: {
      txID: '123',
      outAssets: [
        { amount: '100', asset: 'ETH.USDC-0x1928739' },
        { amount: '1000', asset: 'ETH.THOR-0x1928739' },
      ],
    },
    action: null,
    refunded: true,
  },
  {
    uuid: '5',
    type: TxTrackerType.Switch,
    status: TxTrackerStatus.Success,
    submitTx: {
      txID: '123',
      inAssets: [{ amount: '100', asset: 'ETH.RUNE-0x1928739' }],
      outAssets: [{ amount: '100', asset: 'ETH.USDC-0x1928739' }],
    },
    action: null,
    refunded: null,
  },
  {
    uuid: '6',
    type: TxTrackerType.Switch,
    status: TxTrackerStatus.Success,
    submitTx: {
      txID: '123',
      inAssets: [{ amount: '100', asset: 'ETH.RUNE-0x1928739' }],
      outAssets: [{ amount: '100', asset: 'ETH.USDC-0x1928739' }],
    },
    action: null,
    refunded: null,
  },
  {
    uuid: '7',
    type: TxTrackerType.Switch,
    status: TxTrackerStatus.Success,
    submitTx: {
      inAssets: [{ amount: '100', asset: 'ETH.RUNE-0x1928739' }],
      outAssets: [{ amount: '100', asset: 'ETH.USDC-0x1928739' }],
    },
    action: null,
    refunded: null,
  },
]

export const useTxTracker = () => {
  const [txData, setTxData] = useState(mockTxData)
  const [filteredTxData, setFilteredTxData] = useState(mockTxData)
  const [onlyPending, setOnlyPending] = useState(false)

  //Just for demo purposes of pending state
  useEffect(() => {
    setTimeout(() => setTxData(mockTxData.slice(1)), 5000)
  }, [])

  useEffect(() => {
    if (!onlyPending) {
      setFilteredTxData(txData)
      return
    }

    const filteredData = txData.filter(
      (item) => item.status === TxTrackerStatus.Pending,
    )
    console.log('🔥', filteredData)

    setFilteredTxData(filteredData)
  }, [onlyPending, txData])

  const clearTxHistory = useCallback(() => {
    setTxData([])
  }, [])

  return { txData, filteredTxData, clearTxHistory, onlyPending, setOnlyPending }
}
