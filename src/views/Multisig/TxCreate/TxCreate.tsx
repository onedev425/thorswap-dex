import { Box } from 'components/Atomic';
import { PanelView } from 'components/PanelView';
import { Stepper } from 'components/Stepper';
import { StepperProvider } from 'components/Stepper/StepperContext';
import { StepType } from 'components/Stepper/types';
import { ViewHeader } from 'components/ViewHeader';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { RefreshButton } from 'views/Multisig/components/RefreshButton';
import { useMultisigProtectedRoute } from 'views/Multisig/hooks';
import { SelectSignersStep } from 'views/Multisig/TxCreate/steps/SelectSignersStep';
import { TxDetailsStep } from 'views/Multisig/TxCreate/steps/TxDetailsStep';
import { TxCreateProvider } from 'views/Multisig/TxCreate/TxCreateContext';

const TxCreate = () => {
  useMultisigProtectedRoute();

  const steps: StepType[] = useMemo(
    () => [
      {
        id: 0,
        label: t('views.multisig.selectSigners'),
        content: <SelectSignersStep />,
      },
      {
        id: 1,
        label: t('views.multisig.txDetails'),
        content: <TxDetailsStep />,
        tooltip: t('views.multisig.transationDetailsTooltip'),
      },
    ],
    [],
  );

  return (
    <TxCreateProvider>
      <StepperProvider steps={steps}>
        <PanelView
          header={
            <Box className="w-full justify-between align-center">
              <ViewHeader withBack title={t('views.multisig.createTransaction')} />
              <Box className="px-6">
                <RefreshButton />
              </Box>
            </Box>
          }
          title={t('views.multisig.createTransaction')}
        >
          <Box col className="self-stretch" flex={1}>
            <Stepper />
          </Box>
        </PanelView>
      </StepperProvider>
    </TxCreateProvider>
  );
};

export default TxCreate;
