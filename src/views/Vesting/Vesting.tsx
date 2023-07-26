import { Text } from '@chakra-ui/react';
import { Amount } from '@thorswap-lib/swapkit-core';
import { Box, Button } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { InfoRow } from 'components/InfoRow';
import { InputAmount } from 'components/InputAmount';
import { PanelView } from 'components/PanelView';
import { PercentSelect } from 'components/PercentSelect/PercentSelect';
import { TabsSelect } from 'components/TabsSelect';
import { ViewHeader } from 'components/ViewHeader';
import { toOptionalFixed } from 'helpers/number';
import { useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';
import { useVesting } from 'views/Vesting/hooks';

import { VestingType } from './types';

const Vesting = () => {
  const { wallet, setIsConnectModalOpen } = useWallet();
  const ethAddr = useMemo(() => wallet.ETH?.address, [wallet]);
  const [vestingTab, setVestingTab] = useState(VestingType.THOR);
  const [amount, setAmount] = useState(Amount.fromNormalAmount(0));
  const { vestingInfo, isLoading, loadVestingInfo, handleClaim } = useVesting();
  const {
    vestingPeriod,
    totalClaimedAmount,
    totalVestedAmount,
    startTime,
    claimableAmount,
    cliff,
  } = vestingInfo[vestingTab];

  const handleChangeTokenAmount = useCallback(
    (amount: Amount) => {
      setAmount(amount.gt(claimableAmount) ? Amount.fromNormalAmount(claimableAmount) : amount);
    },
    [claimableAmount],
  );

  const handleChangePercent = useCallback(
    (percent: number) => {
      setAmount(Amount.fromNormalAmount((claimableAmount * percent) / 100));
    },
    [claimableAmount],
  );

  return (
    <PanelView
      header={
        <ViewHeader
          actionsComponent={
            ethAddr && (
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
          value={toOptionalFixed(totalClaimedAmount)}
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
          value={toOptionalFixed(claimableAmount)}
        />

        {ethAddr && (
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

        {ethAddr ? (
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
