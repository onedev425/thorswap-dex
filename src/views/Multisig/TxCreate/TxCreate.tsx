import { useMemo } from 'react'

import { RefreshButton } from 'views/Multisig/components/RefreshButton'
import { SelectSignersStep } from 'views/Multisig/TxCreate/steps/SelectSignersStep'
import { TxDetailsStep } from 'views/Multisig/TxCreate/steps/TxDetailsStep'
import { TxCreateProvider } from 'views/Multisig/TxCreate/TxCreateContext'

import { Box } from 'components/Atomic'
import { PanelView } from 'components/PanelView'
import { Stepper } from 'components/Stepper'
import { StepperProvider } from 'components/Stepper/StepperContext'
import { StepType } from 'components/Stepper/types'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const TxCreate = () => {
  const steps: StepType[] = useMemo(
    () => [
      {
        id: 0,
        label: 'Select Signers',
        content: <SelectSignersStep />,
      },
      { id: 1, label: 'Transaction details', content: <TxDetailsStep /> },
    ],
    [],
  )

  return (
    <TxCreateProvider>
      <StepperProvider steps={steps}>
        <PanelView
          title={t('views.multisig.createTransaction')}
          header={
            <Box className="w-full justify-between align-center">
              <ViewHeader
                title={t('views.multisig.createTransaction')}
                withBack
              />
              <Box className="px-6">
                <RefreshButton />
              </Box>
            </Box>
          }
        >
          <Box className="self-stretch" col flex={1}>
            <Stepper />
          </Box>
        </PanelView>
      </StepperProvider>
    </TxCreateProvider>
  )
}

export default TxCreate
