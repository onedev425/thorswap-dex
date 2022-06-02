import { memo, useMemo } from 'react'

import { Box, DropdownMenu, Typography } from 'components/Atomic'

import { useMimir } from 'hooks/useMimir'
import { useNetwork, StatusType } from 'hooks/useNetwork'

import { t } from 'services/i18n'
import { midgardApi } from 'services/midgard'
import { globalConfig } from 'services/multichain'

import { getHostnameFromUrl } from 'helpers/url'

import { StatusBadge } from './StatusBadge'

type StatusItem = {
  label: string
  value?: string
  statusType?: StatusType
}

export const StatusDropdown = memo(() => {
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
      return t('components.statusDropdown.capAvailable')
    }

    if (isFundsCapReached) {
      return `${t('components.statusDropdown.capLimit')} (${capPercent})`
    }

    return `${t('components.statusDropdown.capAvailable')} (${capPercent})`
  }, [isFundsCapReached, capPercent])

  const menuItemData: StatusItem[] = useMemo(
    () => [
      {
        label: t('components.statusDropdown.liqCap'),
        value: liquidityCapLabel,
        statusType: isFundsCapReached ? StatusType.Warning : StatusType.Normal,
      },
      {
        label: t('components.statusDropdown.outbound'),
        value: `${t(
          'components.statusDropdown.queue',
        )}: ${outboundQueue} (${outboundQueueLevel})`,
        statusType: statusType,
      },
      {
        label: t('components.statusDropdown.thorNetwork'),
        value: !isTHORChainHalted
          ? t('components.statusDropdown.online')
          : t('components.statusDropdown.offline'),
        statusType: isTHORChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: t('components.statusDropdown.binanceChain'),
        value: !isBNBChainHalted
          ? t('components.statusDropdown.online')
          : t('components.statusDropdown.offline'),
        statusType: isBNBChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: t('components.statusDropdown.bitcoinNetwork'),
        value: !isBTCChainHalted
          ? t('components.statusDropdown.online')
          : t('components.statusDropdown.offline'),
        statusType: isBTCChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: t('components.statusDropdown.ethNetwork'),
        value: !isETHChainHalted
          ? t('components.statusDropdown.online')
          : t('components.statusDropdown.offline'),
        statusType: isETHChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: t('components.statusDropdown.litecoinNetwork'),
        value: !isLTCChainHalted
          ? t('components.statusDropdown.online')
          : t('components.statusDropdown.offline'),
        statusType: isLTCChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: t('components.statusDropdown.dogeNetwork'),
        value: !isDOGEChainHalted
          ? t('components.statusDropdown.online')
          : t('components.statusDropdown.offline'),
        statusType: isDOGEChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: t('components.statusDropdown.terraNetwork'),
        value: !isTERRAChainHalted
          ? t('components.statusDropdown.online')
          : t('components.statusDropdown.offline'),
        statusType: isTERRAChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: t('components.statusDropdown.btcCashNetwork'),
        value: !isBCHChainHalted
          ? t('components.statusDropdown.online')
          : t('components.statusDropdown.offline'),
        statusType: isBCHChainHalted ? StatusType.Error : StatusType.Normal,
      },
      {
        label: t('components.statusDropdown.midgard'),
        value: midgardUrl,
        statusType: StatusType.Normal,
      },
      {
        label: t('components.statusDropdown.thornode'),
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

  const menuItems = useMemo(
    () =>
      menuItemData.map(({ label, value, statusType: type }) => ({
        Component: (
          <Box className="min-w-[200px]" row alignCenter>
            <StatusBadge status={type || StatusType.Normal} />

            <Box className="ml-2" col>
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
      })),
    [menuItemData],
  )

  return (
    <DropdownMenu
      menuItems={menuItems}
      value={t('components.statusDropdown.networkStatus')}
      openComponent={<StatusBadge status={statusType} />}
      onChange={() => {}}
    />
  )
})
