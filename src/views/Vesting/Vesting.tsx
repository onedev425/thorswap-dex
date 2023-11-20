import { Text } from '@chakra-ui/react';
import { SwapKitNumber } from '@swapkit/core';
import { Box, Button } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { InfoRow } from 'components/InfoRow';
import { InputAmount } from 'components/InputAmount';
import { PanelView } from 'components/PanelView';
import { PercentSelect } from 'components/PercentSelect/PercentSelect';
import { TabsSelect } from 'components/TabsSelect';
import { ViewHeader } from 'components/ViewHeader';
import { useWalletConnectModal } from 'context/wallet/hooks';
import { useCallback, useState } from 'react';
import { t } from 'services/i18n';
import { useVesting } from 'views/Vesting/hooks';

import { VestingType } from './types';

const Vesting = () => {
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const [vestingTab, setVestingTab] = useState(VestingType.THOR);
  const [amount, setAmount] = useState(new SwapKitNumber({ value: 0, decimal: 1 }));
  const { ethAddress, vestingInfo, isLoading, loadVestingInfo, handleClaim } = useVesting();
  const {
    vestingPeriod,
    totalClaimedAmount,
    totalVestedAmount,
    startTime,
    claimableAmount,
    cliff,
  } = vestingInfo[vestingTab];

  const handleChangeTokenAmount = useCallback(
    (amount: SwapKitNumber) => {
      setAmount(amount.gt(claimableAmount) ? claimableAmount : amount);
    },
    [claimableAmount],
  );

  const handleChangePercent = useCallback(
    (percent: number) => {
      setAmount(
        new SwapKitNumber({
          value: (claimableAmount.getValue('number') * percent) / 100,
          decimal: 1,
        }),
      );
    },
    [claimableAmount],
  );

  return (
    <PanelView
      header={
        <ViewHeader
          actionsComponent={
            ethAddress && (
              <HoverIcon iconName="refresh" onClick={loadVestingInfo} size={18} spin={isLoading} />
            )
          }
          title={t('views.vesting.vesting')}
        />
      }
      title={t('views.vesting.vesting')}
    >
      <Box className="self-stretch">
        <TabsSelect
          onChange={(v) => setVestingTab(v as VestingType)}
          tabs={[
            { label: t('views.vesting.vestingThor'), value: VestingType.THOR },
            { label: t('views.vesting.vestingVthor'), value: VestingType.VTHOR },
          ]}
          value={vestingTab}
        />
      </Box>
      <Box col className="w-full p-2 pt-0">
        <InfoRow label={t('views.vesting.totalVested')} value={totalVestedAmount} />
        <InfoRow
          label={t('views.vesting.totalClaimed')}
          value={totalClaimedAmount.toSignificant(10)}
        />
        <InfoRow
          label={t('views.vesting.vestingStartTime')}
          value={totalVestedAmount === '0' ? 'N/A' : startTime}
        />
        <InfoRow
          label={t('views.vesting.cliff')}
          value={t('views.vesting.cliffValue', { cliff })}
        />
        <InfoRow
          label={t('views.vesting.vestingPeriod')}
          value={t('views.vesting.vestingPeriodValue', { vestingPeriod })}
        />
        <InfoRow
          label={t('views.vesting.claimableAmount')}
          value={claimableAmount.toSignificant(10)}
        />

        {ethAddress && (
          <>
            <Box alignCenter row className="!mt-6" justify="between">
              <Text className="pr-4 min-w-fit">{t('views.vesting.claimAmount')}</Text>

              <InputAmount
                stretch
                amountValue={amount}
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

        {ethAddress ? (
          <Button
            stretch
            className="mt-4"
            loading={isLoading}
            onClick={() => handleClaim({ vestingAction: vestingTab, amount })}
            size="lg"
            variant="fancy"
          >
            {t('views.vesting.claim')}
          </Button>
        ) : (
          <Button
            stretch
            className="mt-4"
            onClick={() => setIsConnectModalOpen(true)}
            size="lg"
            variant="fancy"
          >
            {t('common.connectWallet')}
          </Button>
        )}
      </Box>
    </PanelView>
  );
};

export default Vesting;
