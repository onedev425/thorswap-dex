import { useEffect, useMemo } from 'react'

import { useLocation, useNavigate } from 'react-router'

import { SignerCheckBox } from 'views/Multisig/components/SignerCheckBox'
import { ScreenState, useTxData } from 'views/Multisig/TxMultisig/hooks'
import { BroadcastTxStep } from 'views/Multisig/TxMultisig/steps/BroadcastTxStep'
import { ExportTxStep } from 'views/Multisig/TxMultisig/steps/ExportTxStep'
import { SignTxStep } from 'views/Multisig/TxMultisig/steps/SignTxStep'
import { TxInfoTip } from 'views/Multisig/TxMultisig/TxInfoTip'

import { Box, Typography, Collapse } from 'components/Atomic'
import { PanelView } from 'components/PanelView'
import { Stepper } from 'components/Stepper'
import { StepperProvider } from 'components/Stepper/StepperContext'
import { StepType } from 'components/Stepper/types'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

const TxMultisig = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const {
    txBodyStr,
    signatures,
    addSigner,
    handleSign,
    canBroadcast,
    handleBroadcast,
    isBroadcasting,
    broadcastedTxHash,
    requiredSigners,
    hasMemberSignature,
    connectedSignature,
    exportTxData,
  } = useTxData(state as ScreenState | null)

  useEffect(() => {
    if (!state) {
      navigate(ROUTES.TxImport)
    }
  })

  const steps: StepType[] = useMemo(
    () => [
      {
        id: 0,
        label: 'Sign transaction',
        content: (
          <SignTxStep
            handleSign={handleSign}
            connectedSignature={connectedSignature}
            addSigner={addSigner}
          />
        ),
      },
      {
        id: 1,
        label: 'Export transaction with signatures',
        content: <ExportTxStep exportTxData={exportTxData} />,
      },
      {
        id: 2,
        label: 'Broadcast transaction',
        content: (
          <BroadcastTxStep
            canBroadcast={canBroadcast}
            isBroadcasting={isBroadcasting}
            handleBroadcast={handleBroadcast}
          />
        ),
      },
    ],
    [
      addSigner,
      canBroadcast,
      connectedSignature,
      exportTxData,
      handleBroadcast,
      handleSign,
      isBroadcasting,
    ],
  )

  return (
    <Box col>
      <PanelView
        title={t('views.multisig.multisigTransaction')}
        header={<ViewHeader title={t('views.multisig.multisigTransaction')} />}
      >
        <Box className="w-full gap-1" col>
          <TxInfoTip
            txHash={broadcastedTxHash}
            canBroadcast={canBroadcast}
            txBodyStr={txBodyStr}
          />

          <Box flex={1} col>
            <Collapse
              className="!bg-light-bg-primary dark:!bg-dark-gray-light "
              title={
                <Box className="gap-1 my-1.5" align="end">
                  <Typography className="leading-[24px]" variant="body">
                    {t('views.multisig.requiredSignatures')}:
                  </Typography>
                  <Typography variant="subtitle1" color="primaryBtn">
                    {signatures.length}
                  </Typography>
                  <Typography className="leading-[24px]" variant="body">
                    of
                  </Typography>
                  <Typography variant="subtitle1" color="primaryBtn">
                    {requiredSigners.length}
                  </Typography>
                </Box>
              }
            >
              <Box className="gap-1" col>
                <Typography
                  className="mb-2"
                  variant="caption"
                  fontWeight="normal"
                  color="secondary"
                >
                  {t('views.multisig.txSignaturesInfo')}
                </Typography>

                {requiredSigners.map((s) => (
                  <SignerCheckBox
                    key={s.pubKey}
                    signer={s}
                    isSelected={hasMemberSignature(s)}
                  />
                ))}
              </Box>
            </Collapse>
          </Box>
        </Box>
      </PanelView>

      <Box className="mt-6 max-w-[480px] self-center w-full" col>
        <StepperProvider steps={steps}>
          <Stepper />
        </StepperProvider>
      </Box>
    </Box>
  )
}

export default TxMultisig
