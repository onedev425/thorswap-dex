import { Text } from '@chakra-ui/react';
import { Chain } from '@thorswap-lib/types';
import { Box, DropdownMenu } from 'components/Atomic';
import { chainName } from 'helpers/chainName';
import { useMimir } from 'hooks/useMimir';
import { StatusType, useNetwork } from 'hooks/useNetwork';
import { memo, useMemo } from 'react';
import { t } from 'services/i18n';
import { MIDGARD_URL, THORNODE_URL } from 'settings/config';
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
    // isBSCChainHalted,
    isBTCChainHalted,
    isDOGEChainHalted,
    isETHChainHalted,
    isFundsCapReached,
    isAVAXChainHalted,
    isGAIAChainHalted,
    isLTCChainHalted,
    isTHORChainHalted,
    isGlobalHalted,
  } = useMimir();

  // Midgard IP on devnet OR on test|chaos|mainnet
  const midgardUrl = getHostnameFromUrl(MIDGARD_URL) || '';

  const liquidityCapLabel = useMemo(() => {
    if (!capPercent) return t('components.statusDropdown.capAvailable');
    if (isFundsCapReached) return `${t('components.statusDropdown.capLimit')} (${capPercent})`;
    return `${t('components.statusDropdown.capAvailable')} (${capPercent})`;
  }, [isFundsCapReached, capPercent]);

  const chainsData = useMemo(
    () => [
      { label: chainName(Chain.THORChain, true), value: isTHORChainHalted },
      { label: chainName(Chain.Cosmos, true), value: isGAIAChainHalted },
      { label: chainName(Chain.Binance, true), value: isBNBChainHalted },
      //   { label: chainName(Chain.BinanceSmartChain, true), value: isBSCChainHalted },
      { label: chainName(Chain.Ethereum, true), value: isETHChainHalted },
      { label: chainName(Chain.Bitcoin, true), value: isBTCChainHalted },
      { label: chainName(Chain.Litecoin, true), value: isLTCChainHalted },
      { label: chainName(Chain.Dogecoin, true), value: isDOGEChainHalted },
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
        value: getHostnameFromUrl(THORNODE_URL) || '',
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

  const dropdownStatus = useMemo(
    () => (isGlobalHalted ? StatusType.Offline : statusType),
    [isGlobalHalted, statusType],
  );

  const menuItems = useMemo(
    () =>
      menuItemData.map(({ label, value, statusType: type }) => ({
        Component: (
          <Box alignCenter row className="min-w-[200px]">
            <StatusBadge status={type || StatusType.Good} />

            <Box col className="ml-2">
              <Text fontWeight="bold" textStyle="caption" textTransform="uppercase">
                {label}
              </Text>
              <Text
                fontWeight="normal"
                textStyle="caption-xs"
                textTransform="uppercase"
                variant="secondary"
              >
                {value}
              </Text>
            </Box>
          </Box>
        ),
        value: label,
      })),
    [menuItemData],
  );

  return (
    <DropdownMenu
      hideIcon
      menuItems={menuItems}
      onChange={() => {}}
      openComponent={<StatusBadge status={dropdownStatus} />}
      placement="top-end"
      tooltipContent={t('components.statusDropdown.networkStatus')}
      value={t('components.statusDropdown.networkStatus')}
    />
  );
});
