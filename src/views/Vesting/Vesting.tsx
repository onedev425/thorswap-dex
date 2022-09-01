import { Box, Button, Typography } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { InfoRow } from 'components/InfoRow';
import { InputAmount } from 'components/InputAmount';
import { PanelView } from 'components/PanelView';
import { PercentSelect } from 'components/PercentSelect/PercentSelect';
import { TabsSelect } from 'components/TabsSelect';
import { ViewHeader } from 'components/ViewHeader';
import { toOptionalFixed } from 'helpers/number';
import { useEffect } from 'react';
import { t } from 'services/i18n';
import { useVesting } from 'views/Vesting/hooks';

import { vestingTabs, VestingType } from './types';

const Vesting = () => {
  const {
    setVestingAction,
    vestingInfo,
    isFetching,
    handleVestingInfo,
    handleClaim,
    isClaiming,
    ethAddr,
    vestingAction,
    tokenAmount,
    setIsConnectModalOpen,
    handleChangePercent,
    handleChangeTokenAmount,
  } = useVesting();

  useEffect(() => {
    handleVestingInfo();
  }, [handleVestingInfo]);

  return (
    <PanelView
      header={
        <ViewHeader
          actionsComponent={
            ethAddr && (
              <HoverIcon
                iconName="refresh"
                onClick={handleVestingInfo}
                size={18}
                spin={isFetching}
              />
            )
          }
          title={t('views.vesting.vesting')}
        />
      }
      title={t('views.vesting.vesting')}
    >
      <Box className="self-stretch">
        <TabsSelect
          onChange={(val: string) => {
            setVestingAction(val as VestingType);
          }}
          tabs={vestingTabs}
          value={vestingAction}
        />
      </Box>
      <Box col className="w-full p-2 pt-0">
        <InfoRow label={t('views.vesting.totalVested')} value={vestingInfo.totalVestedAmount} />
        <InfoRow
          label={t('views.vesting.totalClaimed')}
          value={toOptionalFixed(vestingInfo.totalClaimedAmount)}
        />
        <InfoRow
          label={t('views.vesting.vestingStartTime')}
          value={vestingInfo.totalVestedAmount === '0' ? 'N/A' : vestingInfo.startTime}
        />
        <InfoRow
          label={t('views.vesting.cliff')}
          value={t('views.vesting.cliffValue', {
            cliff: vestingInfo.cliff,
          })}
        />
        <InfoRow
          label={t('views.vesting.vestingPeriod')}
          value={t('views.vesting.vestingPeriodValue', {
            vestingPeriod: vestingInfo.vestingPeriod,
          })}
        />
        <InfoRow
          label={t('views.vesting.claimableAmount')}
          value={toOptionalFixed(vestingInfo.claimableAmount)}
        />

        {ethAddr && (
          <>
            <Box alignCenter row className="!mt-6" justify="between">
              <Typography className="pr-4 min-w-fit">{t('views.vesting.claimAmount')}</Typography>

              <InputAmount
                stretch
                amountValue={tokenAmount}
                border="rounded"
                className="!text-right !text-base"
                onAmountChange={handleChangeTokenAmount}
              />
            </Box>
            <Box className="!mt-4 flex-1">
              <PercentSelect onSelect={handleChangePercent} options={[25, 50, 75, 100]} />
            </Box>
          </>
        )}

        {!ethAddr ? (
          <Button
            isFancy
            stretch
            className="mt-4"
            onClick={() => setIsConnectModalOpen(true)}
            size="lg"
          >
            {t('common.connectWallet')}
          </Button>
        ) : (
          <Button
            isFancy
            stretch
            className="mt-4"
            loading={isClaiming}
            onClick={handleClaim}
            size="lg"
          >
            {t('views.vesting.claim')}
          </Button>
        )}
      </Box>
    </PanelView>
  );
};

export default Vesting;
