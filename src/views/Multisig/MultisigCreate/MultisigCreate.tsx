import { useMemo } from 'react'

import { Chain } from '@thorswap-lib/types'

import { useMultisigForm } from 'views/Multisig/MultisigCreate/hooks'
import { ExportWalletStep } from 'views/Multisig/MultisigCreate/steps/ExportWalletStep'
import { MembersStep } from 'views/Multisig/MultisigCreate/steps/MembersStep'
import { PubKeyStep } from 'views/Multisig/MultisigCreate/steps/PubKeyStep'
import { WalletNameStep } from 'views/Multisig/MultisigCreate/steps/WalletNameStep'
import { WalletSummaryStep } from 'views/Multisig/MultisigCreate/steps/WalletSummaryStep'

import { Box } from 'components/Atomic'
import { PanelView } from 'components/PanelView'
import { Stepper } from 'components/Stepper'
import { StepperProvider } from 'components/Stepper/StepperContext'
import { StepType } from 'components/Stepper/types'
import { ViewHeader } from 'components/ViewHeader'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

const MultisigCreate = () => {
  const { wallet } = useWallet()
  const connectedWalletAddress = wallet?.[Chain.THORChain]?.address || ''
  const pubKey = useMemo(() => {
    return connectedWalletAddress ? multichain.thor.getPubkey() : ''
  }, [connectedWalletAddress])

  const {
    formFields,
    submit,
    errors,
    register,
    addMember,
    removeMember,
    isRequiredMember,
  } = useMultisigForm({ pubKey })

  const steps: StepType[] = useMemo(
    () => [
      {
        id: 0,
        label: 'Get your public key',
        content: <PubKeyStep pubKey={pubKey} />,
      },
      {
        id: 1,
        label: 'Name your THORSafe',
        content: (
          <WalletNameStep field={formFields.name} hasError={!!errors.name} />
        ),
      },
      {
        id: 2,
        label: 'Members and treshold',
        content: (
          <MembersStep
            id={2}
            addMember={addMember}
            errors={errors}
            formFields={formFields}
            isRequiredMember={isRequiredMember}
            removeMember={removeMember}
            submit={submit}
            register={register}
          />
        ),
      },
      { id: 3, label: 'Export wallet to file', content: <ExportWalletStep /> },
      { id: 4, label: 'Summary', content: <WalletSummaryStep /> },
    ],
    [
      addMember,
      errors,
      formFields,
      isRequiredMember,
      pubKey,
      register,
      removeMember,
      submit,
    ],
  )

  return (
    <StepperProvider steps={steps}>
      <PanelView
        title={t('views.multisig.thorSafeWallet')}
        header={
          <ViewHeader
            withBack
            title={t('views.multisig.createThorSafeWallet')}
          />
        }
      >
        <Box className="self-stretch" col flex={1}>
          <Stepper />
        </Box>
      </PanelView>
    </StepperProvider>
  )
}

export default MultisigCreate
