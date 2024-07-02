import { Box } from "components/Atomic";
import { PanelView } from "components/PanelView";
import { Stepper } from "components/Stepper";
import { StepperProvider } from "components/Stepper/StepperContext";
import type { StepType } from "components/Stepper/types";
import { ViewHeader } from "components/ViewHeader";
import { useMemo } from "react";
import { t } from "services/i18n";
import { useMultisig } from "store/multisig/hooks";
import { useMultisigForm } from "views/Multisig/MultisigCreate/hooks";
import { ExportWalletStep } from "views/Multisig/MultisigCreate/steps/ExportWalletStep";
import { MembersStep } from "views/Multisig/MultisigCreate/steps/MembersStep";
import { PubKeyStep } from "views/Multisig/MultisigCreate/steps/PubKeyStep";
import { WalletNameStep } from "views/Multisig/MultisigCreate/steps/WalletNameStep";
import { WalletSummaryStep } from "views/Multisig/MultisigCreate/steps/WalletSummaryStep";

const MultisigCreate = () => {
  const { pubKey } = useMultisig();

  const { formFields, submit, errors, register, addMember, removeMember, isRequiredMember } =
    useMultisigForm({ pubKey });

  const steps: StepType[] = useMemo(
    () => [
      {
        id: 0,
        label: t("views.multisig.getYourPublicKey"),
        content: <PubKeyStep pubKey={pubKey} />,
      },
      {
        id: 1,
        label: t("views.multisig.nameYourThorSafe"),
        content: <WalletNameStep field={formFields.name} hasError={!!errors.name} />,
      },
      {
        id: 2,
        label: t("views.multisig.membersAndTreshold"),
        content: (
          <MembersStep
            addMember={addMember}
            errors={errors}
            formFields={formFields}
            id={2}
            isRequiredMember={isRequiredMember}
            register={register}
            removeMember={removeMember}
            submit={submit}
          />
        ),
      },
      {
        id: 3,
        label: t("views.multisig.exportWalletToFile"),
        content: <ExportWalletStep />,
      },
      {
        id: 4,
        label: t("views.multisig.review"),
        content: <WalletSummaryStep />,
      },
    ],
    [addMember, errors, formFields, isRequiredMember, pubKey, register, removeMember, submit],
  );

  return (
    <StepperProvider initialStep={pubKey ? 1 : 0} steps={steps}>
      <PanelView
        header={<ViewHeader withBack title={t("views.multisig.createThorSafeWallet")} />}
        title={t("views.multisig.thorSafeWallet")}
      >
        <Box col className="self-stretch" flex={1}>
          <Stepper />
        </Box>
      </PanelView>
    </StepperProvider>
  );
};

export default MultisigCreate;
