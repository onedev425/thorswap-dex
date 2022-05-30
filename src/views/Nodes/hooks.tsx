import { useCallback, useEffect, useMemo, useState } from 'react'

import { THORNode } from '@thorswap-lib/midgard-sdk'
import {
  Amount,
  hasWalletConnected,
  Asset,
  hasConnectedWallet,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'
import copy from 'copy-to-clipboard'

import { BondActionType } from 'views/Nodes/types'

import { Box, Button, Icon, Link, Typography } from 'components/Atomic'
import { useInputAmount } from 'components/InputAmount/useInputAmount'
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from 'components/Toast'

import { useWallet } from 'store/wallet/hooks'

import { useBalance } from 'hooks/useBalance'
import useWindowSize from 'hooks/useWindowSize'

import { multichain } from 'services/multichain'

import { shortenAddress } from '../../helpers/shortenAddress'
import { t } from '../../services/i18n'
import { useApp } from '../../store/app/hooks'
import { useMidgard } from '../../store/midgard/hooks'

export const useNodeDetailInfo = (nodeAddress: string | undefined) => {
  const { nodes, getNodes, nodeLoading } = useMidgard()
  const { nodeWatchList, setWatchList } = useApp()

  useEffect(() => {
    if (nodes.length === 0) {
      getNodes()
    }
  }, [getNodes, nodes.length])

  const nodeInfo = useMemo(() => {
    if (nodeLoading) return null
    const activeNode = nodes.find((item) => item.node_address === nodeAddress)

    return activeNode || null
  }, [nodeAddress, nodeLoading, nodes])

  const isFavorite = useMemo(() => {
    return nodeWatchList.includes(nodeAddress || '#')
  }, [nodeAddress, nodeWatchList])

  const handleAddToWatchList = useCallback(
    (address: string) => {
      const isSelected = nodeWatchList.includes(address)
      if (!isSelected) {
        setWatchList([address, ...nodeWatchList])
      } else {
        const newList = nodeWatchList.filter((addr) => addr !== address)
        setWatchList(newList)
      }
    },
    [setWatchList, nodeWatchList],
  )

  return { nodeInfo, nodeLoading, isFavorite, handleAddToWatchList }
}

export const useNodeStats = (nodeInfo: THORNode) => {
  const { isMdActive } = useWindowSize()
  if (!nodeInfo) return []

  return [
    {
      key: 'node_address',
      label: t('views.nodes.address'),
      value: (
        <Button
          className="!px-2 h-auto"
          type="borderless"
          variant="tint"
          endIcon={<Icon size={14} name="copy" />}
          tooltip={t('common.copy')}
          onClick={(e) => {
            copy(nodeInfo.node_address)
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          {isMdActive
            ? nodeInfo.node_address
            : shortenAddress(nodeInfo.node_address, 6, 4)}
        </Button>
      ),
    },
    {
      key: 'bond_address',
      label: t('views.nodes.bondAddress'),
      value: (
        <Button
          className="!px-2 h-auto"
          type="borderless"
          variant="tint"
          endIcon={<Icon size={14} name="copy" />}
          tooltip={t('common.copy')}
          onClick={(e) => {
            copy(nodeInfo.bond_address)
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          {isMdActive
            ? nodeInfo.bond_address
            : shortenAddress(nodeInfo.bond_address, 6, 4)}
        </Button>
      ),
    },
    {
      key: 'ip_address',
      label: t('views.nodes.IPAddress'),
      value: nodeInfo.ip_address,
    },
    {
      key: 'version',
      label: t('views.nodes.version'),
      value: nodeInfo.version,
    },
    {
      key: 'status',
      label: t('views.nodes.status'),
      value: nodeInfo.status,
    },
    {
      key: 'bond',
      label: t('views.nodes.bond'),
      value: Amount.fromMidgard(nodeInfo.bond).toFixed(0),
    },
    {
      key: 'current_award',
      label: t('views.nodes.currentReward'),
      value: Amount.fromMidgard(nodeInfo.current_award).toFixed(0),
    },
    {
      key: 'slash_points',
      label: t('views.nodes.slashPoints'),
      value: `${nodeInfo.slash_points.toString()}`,
    },
    {
      key: 'active_block_height',
      label: t('views.nodes.activeBlock'),
      value: `${Amount.fromNormalAmount(nodeInfo.active_block_height).toFixed(
        0,
      )}`,
    },
    {
      key: 'requested_to_leave',
      label: t('views.nodes.requestedToLeave'),
      value: `${nodeInfo.requested_to_leave ? 'YES' : 'NO'}`,
    },
    {
      key: 'forced_to_leave',
      label: t('views.nodes.forcedToLeave'),
      value: `${nodeInfo.forced_to_leave ? 'YES' : 'NO'}`,
    },
    {
      key: 'leave_height',
      label: t('views.nodes.leaveHeight'),
      value: `${nodeInfo.leave_height.toString()}`,
    },
    {
      key: 'jail_address',
      label: t('views.nodes.jailNodeAddress'),
      value: nodeInfo.jail.node_address
        ? shortenAddress(nodeInfo.jail?.node_address, 6, 4)
        : '',
    },
  ]
}

export const useNodeManager = (nodeAddress?: string) => {
  const tabs = useMemo(
    () =>
      Object.values(BondActionType).map((type) => ({
        label: t(`views.nodes.${type}`),
        value: type,
      })) as { label: string; value: BondActionType }[],
    [],
  )

  const getTab = useCallback(
    (type: BondActionType) => {
      return tabs.find((t) => t.value === type)
    },
    [tabs],
  )

  const [amount, setAmount] = useState(Amount.fromNormalAmount(0))
  const { rawValue, onChange: onAmountChange } = useInputAmount({
    amountValue: amount,
    onAmountChange: setAmount,
  })
  const { wallet, setIsConnectModalOpen } = useWallet()

  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet])

  const thorWalletConnected = useMemo(
    () => hasWalletConnected({ wallet, inputAssets: [Asset.RUNE()] }),
    [wallet],
  )

  const { getMaxBalance } = useBalance()

  const maxInputBalance: Amount = useMemo(
    () => getMaxBalance(Asset.RUNE()),
    [getMaxBalance],
  )

  const [tab, setTab] = useState(tabs[0])

  /**
   * 1. check thor wallet connection
   * 2. check if node address matches to wallet address
   */
  const handleComplete = useCallback(async () => {
    if (!thorWalletConnected) {
      return showInfoToast(
        t('views.nodes.detail.WalletNotConnected'),
        t('views.nodes.detail.ConnectThorChainAgainPlease'),
      )
    }

    const isValidAddress = multichain.validateAddress({
      chain: Chain.THORChain,
      address: nodeAddress || '',
    })
    if (!isValidAddress) {
      return showInfoToast(
        t('views.nodes.detail.InvalidNodeAddress'),
        t('views.nodes.detail.CorrectNodeAddress'),
      )
    }

    try {
      if (tab.value === BondActionType.Bond) {
        // bond action
        const txURL = await multichain.bond(nodeAddress || '', amount)
        showSuccessToast(
          t('views.nodes.detail.ViewBondTx'),
          <Box className="align-center py-2">
            <Typography variant="caption-xs" fontWeight="light">
              {t('views.nodes.detail.transactionSentSuccessfully')}
            </Typography>
            <Link to={txURL} className="no-underline">
              <Button size="sm" variant="tint" type="outline">
                {t('views.nodes.detail.ViewTransaction')}
              </Button>
            </Link>
          </Box>,
        )
      } else if (tab.value === BondActionType.Unbond) {
        const txURL = await multichain.unbond(
          nodeAddress || '',
          amount.assetAmount.toNumber(),
        )
        showSuccessToast(
          t('views.nodes.detail.ViewUnBondTx'),
          <>
            <Typography variant="caption-xs" fontWeight="light">
              {t('views.nodes.detail.transactionSentSuccessfully')}
            </Typography>
            <Link to={txURL} className="no-underline pt-3">
              <Button size="sm" variant="tint" type="outline">
                {t('views.nodes.detail.ViewTransaction')}
              </Button>
            </Link>
          </>,
        )
      } else {
        const txURL = await multichain.leave(nodeAddress || '')
        showSuccessToast(
          t('views.nodes.detail.ViewLeaveTx'),
          <>
            <Typography variant="caption-xs" fontWeight="light">
              {t('views.nodes.detail.transactionSentSuccessfully')}
            </Typography>
            <Link to={txURL} className="no-underline pt-3">
              <Button size="sm" variant="tint" type="outline">
                {t('views.nodes.detail.ViewTransaction')}
              </Button>
            </Link>
          </>,
        )
      }
    } catch (error) {
      showErrorToast(t('views.nodes.detail.TransactionFailed'), `${error}`)
    }
  }, [amount, nodeAddress, tab.value, thorWalletConnected])

  const onTabChange = useCallback(
    (v: string) => setTab(getTab(v as BondActionType) || tabs[0]),
    [getTab, tabs],
  )

  return {
    tabs,
    activeTab: tab,
    handleComplete,
    rawAmount: rawValue,
    onAmountChange,
    onTabChange,
    isWalletConnected,
    setIsConnectModalOpen,
    maxInputBalance,
  }
}
