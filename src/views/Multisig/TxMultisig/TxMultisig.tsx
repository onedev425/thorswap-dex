import { Box, Collapse, Typography } from 'components/Atomic';
import { PanelView } from 'components/PanelView';
import { Stepper } from 'components/Stepper';
import { StepperProvider } from 'components/Stepper/StepperContext';
import { StepType } from 'components/Stepper/types';
import { ViewHeader } from 'components/ViewHeader';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/constants';
import { SignerCheckBox } from 'views/Multisig/components/SignerCheckBox';
import { ScreenState, useTxData } from 'views/Multisig/TxMultisig/hooks';
import { BroadcastTxStep } from 'views/Multisig/TxMultisig/steps/BroadcastTxStep';
import { ExportTxStep } from 'views/Multisig/TxMultisig/steps/ExportTxStep';
import { SignTxStep } from 'views/Multisig/TxMultisig/steps/SignTxStep';
import { TxInfoTip } from 'views/Multisig/TxMultisig/TxInfoTip';

const TxMultisig = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    txBodyStr,
    signatures,
    handleSign,
    canBroadcast,
    handleBroadcast,
    isBroadcasting,
    broadcastedTxHash,
    requiredSigners,
    hasMemberSignature,
    connectedSignature,
    exportTxData,
  } = useTxData(state as ScreenState | null);

  useEffect(() => {
    if (!state) {
      navigate(ROUTES.TxImport);
    }
  });

  const steps: StepType[] = useMemo(
    () => [
      {
        id: 0,
        label: t('views.multisig.signTx'),
        content: <SignTxStep connectedSignature={connectedSignature} handleSign={handleSign} />,
      },
      {
        id: 1,
        label: t('views.multisig.exportTxWithSignatures'),
        content: <ExportTxStep exportTxData={exportTxData} signatures={signatures} />,
        tooltip: t('views.multisig.exportTxWithSignaturesTooltip'),
      },
      {
        id: 2,
        label: t('views.multisig.broadcastTx'),
        content: (
          <BroadcastTxStep
            canBroadcast={canBroadcast}
            handleBroadcast={handleBroadcast}
            isBroadcasting={isBroadcasting}
          />
        ),
        tooltip: t('views.multisig.exportTxWithSignaturesTooltip'),
      },
    ],
    [
      canBroadcast,
      connectedSignature,
      exportTxData,
      handleBroadcast,
      handleSign,
      isBroadcasting,
      signatures,
    ],
  );

  return (
    <Box col>
      <PanelView
        header={<ViewHeader title={t('views.multisig.finalizeTransaction')} />}
        title={t('views.multisig.finalizeTransaction')}
      >
        <Box col className="w-full gap-1">
          <TxInfoTip canBroadcast={canBroadcast} txBodyStr={txBodyStr} txHash={broadcastedTxHash} />

          <Box col flex={1}>
            <Collapse
              className="!bg-light-bg-primary dark:!bg-dark-gray-light "
              title={
                <Box align="end" className="gap-1 my-1.5">
                  <Typography className="leading-[24px]" variant="body">
                    {t('views.multisig.requiredSignatures')}:
                  </Typography>
                  <Typography color="primaryBtn" variant="subtitle1">
                    {signatures.length}
                  </Typography>
                  <Typography className="leading-[24px]" variant="body">
                    of
                  </Typography>
                  <Typography color="primaryBtn" variant="subtitle1">
                    {requiredSigners.length}
                  </Typography>
                </Box>
              }
            >
              <Box col className="gap-1">
                <Typography
                  className="mb-2"
                  color="secondary"
                  fontWeight="normal"
                  variant="caption"
                >
                  {t('views.multisig.txSignaturesInfo')}
                </Typography>

                {requiredSigners.map((s) => (
                  <SignerCheckBox isSelected={hasMemberSignature(s)} key={s.pubKey} signer={s} />
                ))}
              </Box>
            </Collapse>
          </Box>
        </Box>
      </PanelView>

      <Box col className="mt-6 max-w-[480px] self-center w-full">
        <StepperProvider steps={steps}>
          <Stepper />
        </StepperProvider>
      </Box>
    </Box>
  );
};

export default TxMultisig;
