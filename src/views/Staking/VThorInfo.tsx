import { Text } from '@chakra-ui/react';
import type { WalletOption } from '@swapkit/core';
import { Box, Icon, Link, Tooltip } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { InfoTip } from 'components/InfoTip';
import { toOptionalFixed } from 'helpers/number';
import { fetchVthorStats } from 'helpers/staking';
import { memo, useCallback, useEffect, useState } from 'react';
import { t } from 'services/i18n';
import { logException } from 'services/logger';
import { ROUTES } from 'settings/router';

import { AddVThorMM } from './AddVThorMM';
import { useV1ThorStakeInfo, useVthorUtil } from './hooks';

type Props = {
  ethAddress?: string;
  walletType?: WalletOption;
};

const DEFAULT_VTHOR_STATS = {
  apy: 0,
  realYieldApy: 0,
  emissionsApy: 0,
};
export const VThorInfo = memo(({ walletType, ethAddress }: Props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isStakeInfoOpen, setStakeInfoOpen] = useState(true);
  const [vthorApy, setVthorApy] = useState<{
    apy: number;
    realYieldApy: number;
    emissionsApy: number;
  }>(DEFAULT_VTHOR_STATS);
  const { getRate, stakePercentageRate, thorStaked, vthorBalance, handleRefresh } = useVthorUtil();
  const { hasStakedV1Thor } = useV1ThorStakeInfo(ethAddress);
  const handleStatsRefresh = useCallback(() => {
    setIsFetching(true);
    handleRefresh();

    setTimeout(() => setIsFetching(false), 1000);
  }, [handleRefresh]);

  const getVthorAPR = useCallback(async () => {
    if (thorStaked && thorStaked.gt(0)) {
      try {
        const stats = await fetchVthorStats(thorStaked.getValue('number'));
        setVthorApy(stats);
      } catch (error: NotWorth) {
        logException(error.toString());
        setVthorApy(DEFAULT_VTHOR_STATS);
      }
    }
  }, [thorStaked]);

  useEffect(() => {
    getVthorAPR();
  }, [getVthorAPR]);

  useEffect(() => {
    setStakeInfoOpen(hasStakedV1Thor);
  }, [hasStakedV1Thor]);

  return (
    <Box col className="mt-5 gap-2">
      {isStakeInfoOpen && (
        <InfoTip
          content={
            <>
              {t('views.stakingVThor.stakeInfoDescription')}
              <Link className="text-twitter-blue" to={ROUTES.LegacyStake}>
                {t('views.stakingVThor.goToUnstake')}
              </Link>
            </>
          }
          onClose={() => setStakeInfoOpen(false)}
          title={t('views.stakingVThor.stakeInfoTitle')}
          type="warn"
        />
      )}

      <InfoTip type="info">
        <Box col className="self-stretch gap-3 px-3 py-1">
          <Box
            alignCenter
            row
            className="pb-2 border-0 border-b border-solid border-opacity-20 border-light-border-primary dark:border-dark-border-primary"
            justify="between"
          >
            <Text fontWeight="semibold" textStyle="subtitle2">
              {t('views.stakingVThor.statTitle')}
            </Text>

            <Box alignCenter row className="gap-2">
              <AddVThorMM walletType={walletType} />
              <HoverIcon iconName="refresh" onClick={handleStatsRefresh} spin={isFetching} />
            </Box>
          </Box>

          <Box alignCenter row className="gap-2" justify="between">
            <Box alignCenter row className="gap-x-1">
              <Text fontWeight="medium" textStyle="caption" variant="secondary">
                {t('views.stakingVThor.stakingApy')}
              </Text>

              <Tooltip className="cursor-pointer" content={t('views.stakingVThor.apyTip')}>
                <Icon color="primaryBtn" name="infoCircle" size={16} />
              </Tooltip>
            </Box>
            <Box alignCenter row className="gap-2">
              <Text fontWeight="medium" textStyle="subtitle2">
                {vthorApy.apy > 0 ? `${toOptionalFixed(vthorApy.apy, 3)}%` : '-'}
              </Text>
              <Tooltip
                className="cursor-pointer"
                content={`Real yield: ${toOptionalFixed(vthorApy.realYieldApy, 3)}%
                Emissions: ${toOptionalFixed(vthorApy.emissionsApy, 3)}%
              `}
              >
                <Icon color="primaryBtn" name="infoCircle" size={16} />
              </Tooltip>
            </Box>
          </Box>

          <Box alignCenter row className="gap-2" justify="between">
            <Box alignCenter row className="gap-x-1">
              <Text fontWeight="medium" textStyle="caption" variant="secondary">
                {t('views.stakingVThor.totalStaked')}
              </Text>

              <Tooltip className="cursor-pointer" content={t('views.stakingVThor.totalThorTip')}>
                <Icon color="primaryBtn" name="infoCircle" size={16} />
              </Tooltip>
            </Box>
            <Text fontWeight="medium" textStyle="subtitle2">
              {thorStaked.toAbbreviation()} / {stakePercentageRate}%
            </Text>
          </Box>

          <Box alignCenter row className="gap-2" justify="between">
            <Box alignCenter row className="gap-x-1">
              <Text fontWeight="medium" textStyle="caption" variant="secondary">
                {t('views.stakingVThor.redeemableBalance')}
              </Text>
            </Box>

            <Text fontWeight="medium" textStyle="subtitle2">
              {vthorBalance.gt(0)
                ? `${vthorBalance.mul(getRate()).toCurrency('')} / ${vthorBalance.toCurrency('')}`
                : '-'}
            </Text>
          </Box>
        </Box>
      </InfoTip>
    </Box>
  );
});
