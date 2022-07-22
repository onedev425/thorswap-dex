import { useCallback } from 'react'

import { FilePicker } from 'react-file-picker'
import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import { useMultisigImport } from 'views/Multisig/MultisigImport/hooks'

import { Box, Button, Icon, Typography } from 'components/Atomic'
import { FieldLabel } from 'components/Form'
import { Input } from 'components/Input'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

const MultisigImport = () => {
  const navigate = useNavigate()
  const onSuccess = useCallback(() => navigate(ROUTES.Multisig), [navigate])
  const {
    onChangeFile,
    fileError,
    onError,
    name,
    setName,
    handleConnectWallet,
    isValid,
    walletData,
  } = useMultisigImport({ onSuccess })

  return (
    <PanelView
      title={t('views.multisig.thorSafeWallet')}
      header={
        <ViewHeader
          withBack
          title={t('views.multisig.connectThorSafeWallet')}
        />
      }
    >
      <Box className="self-stretch gap-8" col>
        <Typography>Select wallet json file and import info</Typography>

        <Box className="gap-8" col>
          <Box col>
            <FieldLabel
              label={t('views.multisig.selectFile')}
              hasError={!!fileError}
            />
            <FilePicker onChange={onChangeFile} onError={onError}>
              <Box
                className="h-10 px-3 border border-solid cursor-pointer rounded-2xl border-light-border-primary dark:border-dark-border-primary hover:border-light-typo-gray dark:hover:border-dark-typo-gray"
                alignCenter
              >
                {!walletData && !fileError && <Icon name="upload" size={18} />}
                {walletData && !fileError && (
                  <Icon name="valid" color="green" size={18} />
                )}
                {fileError && <Icon name="invalid" color="red" size={18} />}
                <Typography
                  className={classNames('text-[11px] opacity-80 ml-2', {
                    'opacity-100': walletData && !fileError,
                  })}
                  variant="caption-xs"
                  fontWeight="semibold"
                >
                  {t('views.walletModal.chooseKeystore')}
                </Typography>
              </Box>
            </FilePicker>
            {!!fileError && (
              <Box className="my-1 mx-2">
                <Typography variant="caption" fontWeight="normal" color="red">
                  {fileError}
                </Typography>
              </Box>
            )}
          </Box>

          <Box col>
            <FieldLabel label={t('views.multisig.thorSafeName')} />
            <Input
              className="py-1"
              stretch
              border="rounded"
              placeholder={t('views.multisig.nameExample')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
        </Box>

        <Box center className="w-full pt-5">
          <Button
            isFancy
            stretch
            size="lg"
            onClick={handleConnectWallet}
            disabled={!isValid}
            error={!!fileError}
          >
            {t('views.multisig.connectThorSafeWallet')}
          </Button>
        </Box>
      </Box>
    </PanelView>
  )
}

export default MultisigImport
