import { useEffect } from 'react'

import { Box, Button, Typography } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'
import { useStepper } from 'components/Stepper/StepperContext'

import { t } from 'services/i18n'

type Props = {
  handleBroadcast: () => void
  isBroadcasting: boolean
  canBroadcast: boolean
}

export function BroadcastTxStep({
  canBroadcast,
  handleBroadcast,
  isBroadcasting,
}: Props) {
  const { setStep } = useStepper()
  useEffect(() => {
    if (canBroadcast) {
      setStep(2)
    }
  }, [canBroadcast, setStep])

  return (
    <Box className="self-stretch mx-2" col flex={1}>
      <Box className="gap-6" col>
        {canBroadcast ? (
          <Typography variant="caption" fontWeight="normal">
            {t('views.multisig.broadcastTxInfo')}
          </Typography>
        ) : (
          <InfoTip
            type="warn"
            content={t('views.multisig.broadcastTxInfoBlocked')}
          />
        )}

        <Button
          variant="primary"
          stretch
          size="lg"
          isFancy
          error={!canBroadcast}
          disabled={!canBroadcast}
          onClick={handleBroadcast}
          loading={isBroadcasting}
        >
          {t('views.multisig.broadcast')}
        </Button>
      </Box>
    </Box>
  )
}
