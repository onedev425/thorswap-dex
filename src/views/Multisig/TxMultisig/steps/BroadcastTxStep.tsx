import { Box, Button, Typography } from 'components/Atomic';
import { InfoTip } from 'components/InfoTip';
import { useStepper } from 'components/Stepper/StepperContext';
import { useEffect } from 'react';
import { t } from 'services/i18n';

type Props = {
  handleBroadcast: () => void;
  isBroadcasting: boolean;
  canBroadcast: boolean;
};

export function BroadcastTxStep({ canBroadcast, handleBroadcast, isBroadcasting }: Props) {
  const { setStep } = useStepper();
  useEffect(() => {
    if (canBroadcast) {
      setStep(2);
    }
  }, [canBroadcast, setStep]);

  return (
    <Box col className="self-stretch mx-2" flex={1}>
      <Box col className="gap-6">
        {canBroadcast ? (
          <Typography fontWeight="normal" variant="caption">
            {t('views.multisig.broadcastTxInfo')}
          </Typography>
        ) : (
          <InfoTip content={t('views.multisig.broadcastTxInfoBlocked')} type="warn" />
        )}

        <Button
          isFancy
          stretch
          disabled={!canBroadcast}
          error={!canBroadcast}
          loading={isBroadcasting}
          onClick={handleBroadcast}
          size="lg"
          variant="primary"
        >
          {t('views.multisig.broadcast')}
        </Button>
      </Box>
    </Box>
  );
}
