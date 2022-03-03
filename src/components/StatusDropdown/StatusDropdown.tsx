import { useMemo } from 'react'

import { DropdownMenu, Icon } from 'components/Atomic'

import { useMimir } from 'hooks/useMimir'
import { useNetwork, StatusType } from 'hooks/useNetwork'

import { midgardApi } from 'services/midgard'
import { globalConfig } from 'services/multichain'

import { getHostnameFromUrl } from 'helpers/url'

import { StatusItem, statusColorOptions } from './types'

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
          <div>
            <Icon
              name="valid"
              color={statusColorOptions[type || StatusType.Normal]}
            />
            {label}
            <br />
            {value}
          </div>
        ),
        value: label,
      }
    })
  }, [menuItemData])

  return (
    <DropdownMenu
      menuItems={menuItems}
      value="Network Status"
      OpenComponent={<Icon name="lightning" />}
      onChange={() => {}}
    />
  )
}
