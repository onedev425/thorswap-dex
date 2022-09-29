import { Chain } from '@thorswap-lib/types';
import { Box, DropdownMenu, Typography } from 'components/Atomic';
import { chainName } from 'helpers/chainName';
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
    isAVAXChainHalted,
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

  const chainsData = useMemo(
    () => [
      { label: chainName(Chain.THORChain, true), value: isTHORChainHalted },
      { label: chainName(Chain.Cosmos, true), value: isGAIAChainHalted },
      { label: chainName(Chain.Binance, true), value: isBNBChainHalted },
      { label: chainName(Chain.Ethereum, true), value: isETHChainHalted },
      { label: chainName(Chain.Bitcoin, true), value: isBTCChainHalted },
      { label: chainName(Chain.Litecoin, true), value: isLTCChainHalted },
      { label: chainName(Chain.Doge, true), value: isDOGEChainHalted },
      { label: chainName(Chain.BitcoinCash, true), value: isBCHChainHalted },
      { label: chainName(Chain.Avalanche, true), value: isAVAXChainHalted },
    ],
    [
      isAVAXChainHalted,
      isBCHChainHalted,
      isBNBChainHalted,
      isBTCChainHalted,
      isDOGEChainHalted,
      isETHChainHalted,
      isGAIAChainHalted,
      isLTCChainHalted,
      isTHORChainHalted,
    ],
  );

  const menuItemData: StatusItem[] = useMemo(
    () => [
      {
        label: t('components.statusDropdown.outbound'),
        value: `${t('components.statusDropdown.queue')}: ${outboundQueue} (${outboundQueueLevel})`,
        statusType: statusType,
      },
      {
        label: t('components.statusDropdown.liqCap'),
        value: liquidityCapLabel,
        statusType: isFundsCapReached ? StatusType.Slow : StatusType.Good,
      },
      ...chainsData.map(({ label, value }) => ({
        label,
        statusType: value ? StatusType.Busy : StatusType.Good,
        value: value
          ? t('components.statusDropdown.offline')
          : t('components.statusDropdown.online'),
      })),
      {
        label: t('components.statusDropdown.midgard'),
        value: midgardUrl,
        statusType: StatusType.Good,
      },
      {
        label: t('components.statusDropdown.thornode'),
        value: getHostnameFromUrl(globalConfig.thornodeMainnetApiUrl) || '',
        statusType: StatusType.Good,
      },
    ],
    [
      outboundQueue,
      outboundQueueLevel,
      statusType,
      liquidityCapLabel,
      isFundsCapReached,
      chainsData,
      midgardUrl,
    ],
  );

  const menuItems = useMemo(
    () =>
      menuItemData.map(({ label, value, statusType: type }) => ({
        Component: (
          <Box alignCenter row className="min-w-[200px]">
            <StatusBadge status={type || StatusType.Good} />

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
      openComponent={<StatusBadge withLabel status={statusType} />}
      value={t('components.statusDropdown.networkStatus')}
    />
  );
});
