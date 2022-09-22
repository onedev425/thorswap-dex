import { Box, DropdownMenu, Typography } from 'components/Atomic';
import { useMimir } from 'hooks/useMimir';
import { StatusType, useNetwork } from 'hooks/useNetwork';
import { memo, useMemo } from 'react';
import { t } from 'services/i18n';
import { midgardApi } from 'services/midgard';
import { globalConfig } from 'services/multichain';
import { parse } from 'url';

import { StatusBadge } from './StatusBadge';

type StatusItem = {
  label: string;
  value?: string;
  statusType?: StatusType;
};

const getHostnameFromUrl = (u: string): string | null => {
  if (typeof u !== 'string') return null;

  const parsed = parse(u, true);
  return parsed?.hostname ?? null;
};

export const StatusDropdown = memo(() => {
  const { statusType, outboundQueue, outboundQueueLevel } = useNetwork();
  const {
    capPercent,
    isBCHChainHalted,
    isBNBChainHalted,
    isBTCChainHalted,
    isDOGEChainHalted,
    isETHChainHalted,
    isFundsCapReached,
    isGAIAChainHalted,
    isLTCChainHalted,
    isTHORChainHalted,
  } = useMimir();

  // Midgard IP on devnet OR on test|chaos|mainnet
  const midgardUrl = getHostnameFromUrl(midgardApi.getBaseUrl()) || '';

  const liquidityCapLabel = useMemo(() => {
    if (!capPercent) {
      return t('components.statusDropdown.capAvailable');
    }

    if (isFundsCapReached) {
      return `${t('components.statusDropdown.capLimit')} (${capPercent})`;
    }

    return `${t('components.statusDropdown.capAvailable')} (${capPercent})`;
  }, [isFundsCapReached, capPercent]);

  const menuItemData: StatusItem[] = useMemo(
    () => [
      {
        label: t('components.statusDropdown.liqCap'),
        value: liquidityCapLabel,
        statusType: isFundsCapReached ? StatusType.Warning : StatusType.Normal,
      },
      {
        label: t('components.statusDropdown.outbound'),
        value: `${t('components.statusDropdown.queue')}: ${outboundQueue} (${outboundQueueLevel})`,
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
        label: 'Cosmos Chain',
        value: !isGAIAChainHalted
          ? t('components.statusDropdown.online')
          : t('components.statusDropdown.offline'),
        statusType: isGAIAChainHalted ? StatusType.Error : StatusType.Normal,
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
      isGAIAChainHalted,
      isBTCChainHalted,
      isETHChainHalted,
      isBNBChainHalted,
      isLTCChainHalted,
      isBCHChainHalted,
      isDOGEChainHalted,
    ],
  );

  const menuItems = useMemo(
    () =>
      menuItemData.map(({ label, value, statusType: type }) => ({
        Component: (
          <Box alignCenter row className="min-w-[200px]">
            <StatusBadge status={type || StatusType.Normal} />

            <Box col className="ml-2">
              <Typography fontWeight="bold" transform="uppercase" variant="caption">
                {label}
              </Typography>
              <Typography
                color="secondary"
                fontWeight="normal"
                transform="uppercase"
                variant="caption-xs"
              >
                {value}
              </Typography>
            </Box>
          </Box>
        ),
        value: label,
      })),
    [menuItemData],
  );

  return (
    <DropdownMenu
      menuItems={menuItems}
      onChange={() => {}}
      openComponent={<StatusBadge status={statusType} />}
      value={t('components.statusDropdown.networkStatus')}
    />
  );
});
