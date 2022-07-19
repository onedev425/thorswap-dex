import { TextareaPaste } from 'views/Multisig/components/TextareaPaste'
import { useMultisigWalletInfo } from 'views/Multisig/hooks'
import { useTxImportForm } from 'views/Multisig/TxImport/hooks'

import { Box, Button } from 'components/Atomic'
import { FieldLabel } from 'components/Form'
import { InfoTable } from 'components/InfoTable'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const TxImport = () => {
  const info = useMultisigWalletInfo()

  const { formFields, errors, submit, setTx } = useTxImportForm()

  return (
    <PanelView
      title={t('views.multisig.importTransaction')}
      header={
        <ViewHeader title={t('views.multisig.importTransaction')} withBack />
      }
    >
      <Box className="w-full gap-1 my-4" col>
        <InfoTable items={[info[1]]} size="lg" horizontalInset />

        <Box className="mt-6 gap-1" flex={1} col>
          <FieldLabel label={t('views.multisig.txSignature')} />
          <TextareaPaste
            placeholder="To import an existing transaction simply paste the JSON Transaction Form  generated when you created a transaction."
            onPasteClick={setTx}
            hasError={!!errors.tx}
            {...formFields.tx}
          />
        </Box>
      </Box>

      <Box center className="w-full pt-5">
        <Button isFancy stretch size="lg" onClick={submit}>
          {t('views.multisig.importTransaction')}
        </Button>
      </Box>
    </PanelView>
  )
}

export default TxImport
