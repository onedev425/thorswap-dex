import { useCallback, useEffect, useMemo } from 'react'

import { THORNode } from '@thorswap-lib/midgard-sdk'
import { Amount } from '@thorswap-lib/multichain-sdk'

import { useApp } from '../../redux/app/hooks'
import { useMidgard } from '../../redux/midgard/hooks'
import { t } from '../../services/i18n'

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

    if (activeNode === undefined) return null
    return activeNode
  }, [nodeAddress, nodeLoading, nodes])

  const isFavorite = useMemo(() => {
    if (nodeAddress) {
      return nodeWatchList.includes(nodeAddress)
    }
    return false
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

  return { nodes, nodeInfo, nodeLoading, isFavorite, handleAddToWatchList }
}

export const useAccountData = (nodeInfo: THORNode) => {
  if (!nodeInfo) return []
  return [
    {
      key: nodeInfo.node_address,
      label: t('views.nodes.info.Address'),
      value: nodeInfo.node_address,
    },
    {
      key: nodeInfo.bond_address,
      label: t('views.nodes.info.Address'),
      value: nodeInfo.bond_address,
    },
    {
      key: nodeInfo.ip_address,
      label: t('views.nodes.info.IPAddress'),
      value: nodeInfo.ip_address,
    },
    {
      key: nodeInfo.version,
      label: t('views.nodes.info.Version'),
      value: nodeInfo.version,
    },
    {
      key: nodeInfo.status,
      label: t('views.nodes.info.Version'),
      value: nodeInfo.status,
    },
    {
      key: nodeInfo.bond,
      label: t('views.nodes.info.Bond'),
      value: Amount.fromMidgard(nodeInfo.bond).toFixed(0),
    },
    {
      key: nodeInfo.current_award,
      label: t('views.nodes.info.CurrentReward'),
      value: Amount.fromMidgard(nodeInfo.current_award).toFixed(0),
    },
    {
      key: nodeInfo.slash_points,
      label: t('views.nodes.info.SlashPoints'),
      value: `${nodeInfo.slash_points.toString()}`,
    },
    {
      key: nodeInfo.active_block_height,
      label: t('views.nodes.info.JailNodeAddress'),
      value: nodeInfo.jail?.node_address,
    },
    {
      key: nodeInfo.requested_to_leave,
      label: t('views.nodes.info.Bond'),
      value: `${nodeInfo.requested_to_leave ? 'YES' : 'NO'}`,
    },
    {
      key: nodeInfo.forced_to_leave,
      label: t('views.nodes.info.ForcedToLeave'),
      value: `${nodeInfo.forced_to_leave ? 'YES' : 'NO'}`,
    },
    {
      key: nodeInfo.leave_height,
      label: t('views.nodes.info.LeaveHeight'),
      value: `${nodeInfo.leave_height.toString()}`,
    },
    {
      key: nodeInfo.requested_to_leave,
      label: t('views.nodes.info.Bond'),
      value: `${nodeInfo.requested_to_leave ? 'YES' : 'NO'}`,
    },
  ]
}
