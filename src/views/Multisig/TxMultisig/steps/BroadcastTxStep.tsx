import { Text } from "@chakra-ui/react";
import { Box, Button } from "components/Atomic";
import { InfoTip } from "components/InfoTip";
import { useStepper } from "components/Stepper/StepperContext";
import { useEffect } from "react";
import { t } from "services/i18n";

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
          <Text fontWeight="normal" textStyle="caption">
            {t("views.multisig.broadcastTxInfo")}
          </Text>
        ) : (
          <InfoTip content={t("views.multisig.broadcastTxInfoBlocked")} type="warn" />
        )}

        <Button
          stretch
          disabled={!canBroadcast}
          error={!canBroadcast}
          loading={isBroadcasting}
          onClick={handleBroadcast}
          size="lg"
          variant="fancy"
        >
          {t("views.multisig.broadcast")}
        </Button>
      </Box>
    </Box>
  );
}
