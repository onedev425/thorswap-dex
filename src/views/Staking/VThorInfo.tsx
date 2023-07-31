import { Text } from '@chakra-ui/react';
import { WalletOption } from '@thorswap-lib/types';
import { Box, Icon, Link, Tooltip } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { InfoTip } from 'components/InfoTip';
import { useFormatPrice } from 'helpers/formatPrice';
import { toOptionalFixed } from 'helpers/number';
import { fetchVthorApr } from 'helpers/staking';
import { memo, useCallback, useEffect, useState } from 'react';
import { fromWei } from 'services/contract';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/router';

import { AddVThorMM } from './AddVThorMM';
import { useV1ThorStakeInfo, useVthorUtil } from './hooks';

type Props = {
  ethAddress?: string;
  walletType?: WalletOption;
};

export const VThorInfo = memo(({ walletType, ethAddress }: Props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isStakeInfoOpen, setStakeInfoOpen] = useState(true);
  const [vthorApr, setVthorApr] = useState(0);
  const { thorStaked, vthorBalance, handleRefresh, thorRedeemable } = useVthorUtil();
  const formatPrice = useFormatPrice({ prefix: '' });
  const { hasStakedV1Thor } = useV1ThorStakeInfo(ethAddress);

  const handleStatsRefresh = useCallback(() => {
    setIsFetching(true);
    handleRefresh();

    setTimeout(() => setIsFetching(false), 1000);
  }, [handleRefresh]);

  const getVthorAPR = useCallback(async () => {
    const stakedAmount = fromWei(thorStaked);

    if (stakedAmount > 0) {
      try {
        const apr = await fetchVthorApr(stakedAmount);
        setVthorApr(apr);
      } catch (error: NotWorth) {
        console.error(error);
        setVthorApr(0);
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
            <Text fontWeight="medium" textStyle="subtitle2">
              {vthorApr > 0 ? `${toOptionalFixed(vthorApr)}%` : '-'}
            </Text>
          </Box>

          <Box alignCenter row className="gap-2" justify="between">
            <Box alignCenter row className="gap-x-1">
              <Text fontWeight="medium" textStyle="caption" variant="secondary">
                {t('views.stakingVThor.redeemableThor')}
              </Text>

              <Tooltip className="cursor-pointer" content={t('views.stakingVThor.totalThorTip')}>
                <Icon color="primaryBtn" name="infoCircle" size={16} />
              </Tooltip>
            </Box>
            <Text fontWeight="medium" textStyle="subtitle2">
              {ethAddress ? formatPrice(thorRedeemable) : '-'}
            </Text>
          </Box>

          <Box alignCenter row className="gap-2" justify="between">
            <Box alignCenter row className="gap-x-1">
              <Text fontWeight="medium" textStyle="caption" variant="secondary">
                {t('views.stakingVThor.vthorBal')}
              </Text>
            </Box>
            <Text fontWeight="medium" textStyle="subtitle2">
              {ethAddress ? formatPrice(fromWei(vthorBalance)) : '-'}
            </Text>
          </Box>
        </Box>
      </InfoTip>
    </Box>
  );
});
