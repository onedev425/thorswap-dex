import { Text } from "@chakra-ui/react";
import { Box, Tooltip } from "components/Atomic";
import { InfoTable } from "components/InfoTable";
import { StepActions } from "components/Stepper";
import { useAddressUtils } from "hooks/useAddressUtils";
import { useNavigate } from "react-router";
import { t } from "services/i18n";
import { ROUTES } from "settings/router";
import { useAppSelector } from "store/store";
import { InactiveAccountWarning } from "views/Multisig/components/InactiveAccountWarning";
import { useMultisigWalletInfo } from "views/Multisig/hooks";

export const WalletSummaryStep = () => {
  const navigate = useNavigate();
  const address = useAppSelector(({ multisig }) => multisig.address);
  const { handleCopyAddress } = useAddressUtils(address);
  const info = useMultisigWalletInfo();

  return (
    <Box col className="gap-5">
      <Box col className="gap-3">
        <Text fontWeight="normal" textStyle="caption">
          {`${t("views.multisig.thorSafeInfo")}:`}
        </Text>
        <Tooltip className="flex flex-1" content={t("common.copy")}>
          <Box center className="gap-2 cursor-pointer" flex={1} onClick={handleCopyAddress}>
            <InfoTable horizontalInset items={info} />
          </Box>
        </Tooltip>
      </Box>

      <InactiveAccountWarning />

      <StepActions
        nextAction={() => navigate(ROUTES.Multisig)}
        nextLabel={t("views.multisig.sendRune")}
      />
    </Box>
  );
};
