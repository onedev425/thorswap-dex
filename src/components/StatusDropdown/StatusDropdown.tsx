import { useMemo } from 'react'

import { Box, DropdownMenu, Typography } from 'components/Atomic'
import { StatusBadge } from 'components/StatusBadge'

import { useMimir } from 'hooks/useMimir'
import { useNetwork, StatusType } from 'hooks/useNetwork'

import { midgardApi } from 'services/midgard'
import { globalConfig } from 'services/multichain'

import { getHostnameFromUrl } from 'helpers/url'

import { StatusItem } from './types'

export const StatusDropdown = () => {
  const { statusType, outboundQueue, outboundQueueLevel } = useNetwork()
  const {
    isFundsCapReached,
    capPercent,
    isTHORChainHalted,
    isBTCChainHalted,
    isETHChainHalted,
    isBNBChainHalted,
    isLTCChainHalted,
    isBCHChainHalted,
    isDOGEChainHalted,
    isTERRAChainHalted,
  } = useMimir()

  // Midgard IP on devnet OR on test|chaos|mainnet
  const midgardUrl = getHostnameFromUrl(midgardApi.getBaseUrl()) || ''

  const liquidityCapLabel = useMemo(() => {
    if (!capPercent) {
      return 'Funds Cap available'
    }

    if (isFundsCapReached) {
      return `Funds Cap reached limit (${capPercent})`
    }

    return `Funds Cap available (${capPercent})`
  }, [isFundsCapReached, capPercent])

  const menuItemData: StatusItem[] = useMemo(
    () => [
      {
        label: 'Liquidity Cap',
        value: liquidityCapLabel,
        statusType: isFundsCapReached ? StatusType.Warning : StatusType.Normal,
      },
      {
        label: 'Outbound',
        value: `Queue: ${outboundQueue} (${outboundQueueLevel})`,
        statusType: statusType,
      },
      {
        label: 'THORChain Network',
        value: !isTHORChainHalted ? 'Online' : 'Offline',
        statusType: isTHORChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: 'Binance Chain',
        value: !isBNBChainHalted ? 'Online' : 'Offline',
        statusType: isBNBChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: 'Bitcoin Network',
        value: !isBTCChainHalted ? 'Online' : 'Offline',
        statusType: isBTCChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: 'Ethereum Network',
        value: !isETHChainHalted ? 'Online' : 'Offline',
        statusType: isETHChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: 'Litecoin Network',
        value: !isLTCChainHalted ? 'Online' : 'Offline',
        statusType: isLTCChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: 'Dogecoin Network',
        value: !isDOGEChainHalted ? 'Online' : 'Offline',
        statusType: isDOGEChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: 'Terra Network',
        value: !isTERRAChainHalted ? 'Online' : 'Offline',
        statusType: isTERRAChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: 'Bitcoin Cash Network',
        value: !isBCHChainHalted ? 'Online' : 'Offline',
        statusType: isBCHChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: 'Midgard',
        value: midgardUrl,
        statusType: StatusType.Normal,
      },
      {
        label: 'THORNODE',
        value: getHostnameFromUrl(globalConfig.thornodeMainnetApiUrl) || '',
        statusType: StatusType.Normal,
      },
    ],
    [
      midgardUrl,
      statusType,
      outboundQueue,
      outboundQueueLevel,
      liquidityCapLabel,
      isFundsCapReached,
      isTHORChainHalted,
      isBTCChainHalted,
      isETHChainHalted,
      isBNBChainHalted,
      isLTCChainHalted,
      isBCHChainHalted,
      isDOGEChainHalted,
      isTERRAChainHalted,
    ],
  )

  const menuItems = useMemo(() => {
    return menuItemData.map(({ label, value, statusType: type }) => {
      return {
        Component: (
          <Box minWidth="200px" row alignCenter>
            <StatusBadge status={type || StatusType.Normal} />
            <Box ml={2} col>
              <Typography
                variant="caption"
                fontWeight="bold"
                transform="uppercase"
              >
                {label}
              </Typography>
              <Typography
                variant="caption-xs"
                color="secondary"
                fontWeight="normal"
                transform="uppercase"
              >
                {value}
              </Typography>
            </Box>
          </Box>
        ),
        value: label,
      }
    })
  }, [menuItemData])

  return (
    <DropdownMenu
      menuItems={menuItems}
      value="Network Status"
      openComponent={<StatusBadge status={statusType} />}
      onChange={() => {}}
    />
  )
}
