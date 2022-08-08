import { FilePicker } from 'react-file-picker'

import classNames from 'classnames'

import { useTxImportForm } from 'views/Multisig/TxImport/hooks'

import { Box, Button, Icon, Typography } from 'components/Atomic'
import { FieldLabel } from 'components/Form'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const TxImport = () => {
  const {
    onChangeFile,
    fileError,
    onError,
    isValid,
    importedTx,
    handleImportTx,
  } = useTxImportForm()

  return (
    <PanelView
      title={t('views.multisig.importTransaction')}
      header={
        <ViewHeader title={t('views.multisig.importTransaction')} withBack />
      }
    >
      <Box className="self-stretch" col>
        <Box className="pb-8">
          <Typography>{t('views.multisig.selectTxJsonFile')}</Typography>
        </Box>
        <FieldLabel
          label={t('views.multisig.selectFile')}
          hasError={!!fileError}
        />
        <FilePicker onChange={onChangeFile} onError={onError}>
          <Box
            className="h-10 px-3 border border-solid cursor-pointer rounded-2xl border-light-border-primary dark:border-dark-border-primary hover:border-light-typo-gray dark:hover:border-dark-typo-gray"
            alignCenter
          >
            {!importedTx && !fileError && <Icon name="upload" size={18} />}
            {importedTx && !fileError && (
              <Icon name="valid" color="green" size={18} />
            )}
            {fileError && <Icon name="invalid" color="red" size={18} />}
            <Typography
              className={classNames('text-[11px] opacity-80 ml-2', {
                'opacity-100': importedTx && !fileError,
              })}
              variant="caption-xs"
              fontWeight="semibold"
            >
              {t('views.walletModal.chooseKeystore')}
            </Typography>
          </Box>
        </FilePicker>
      </Box>

      <Box center className="w-full pt-5">
        <Button
          isFancy
          stretch
          size="lg"
          onClick={handleImportTx}
          disabled={!isValid}
        >
          {t('views.multisig.importTransaction')}
        </Button>
      </Box>
    </PanelView>
  )
}

export default TxImport
