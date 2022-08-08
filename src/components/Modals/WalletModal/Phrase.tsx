import { ChangeEvent, useCallback, useState } from 'react'

import { validatePhrase, encryptToKeyStore } from '@thorswap-lib/xchain-crypto'

import { Box, Button, Icon, Typography } from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

import { downloadAsFile } from 'helpers/download'

export const PhraseView = () => {
  const [phrase, setPhrase] = useState('')
  const [invalidPhrase, setInvalidPhrase] = useState(false)

  const [password, setPassword] = useState<string>('')
  const [invalidStatus, setInvalidStatus] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      setInvalidStatus(false)
    },
    [],
  )

  const handlePhraseChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInvalidPhrase(false)
    setPhrase(e.target.value)
  }, [])

  const handleBackupKeystore = useCallback(async () => {
    if (phrase && password) {
      setProcessing(true)

      try {
        const isValidPhrase = validatePhrase(phrase)

        if (!isValidPhrase) {
          setInvalidPhrase(true)
          setProcessing(false)
          return
        }

        const keystore = await encryptToKeyStore(phrase, password)

        await downloadAsFile('thorswap-keystore.txt', JSON.stringify(keystore))

        // clean up
        setPassword('')
        setPhrase('')
      } catch (error) {
        setInvalidStatus(true)
      }
      setProcessing(false)
    }
  }, [phrase, password])

  const ready = password.length > 0 && !invalidPhrase && !processing

  return (
    <Box className="w-full" col>
      <Helmet
        title={t('views.walletModal.importPhrase')}
        content={t('views.walletModal.importPhrase')}
      />
      <Box className="space-x-2" row>
        <Typography className="mb-2" variant="subtitle2" fontWeight="semibold">
          {t('views.walletModal.enterSeed')}
        </Typography>
      </Box>
      <Box className="w-full">
        <Input
          border="rounded"
          name="phrase"
          placeholder={t('views.walletModal.phrase')}
          stretch
          value={phrase}
          onChange={handlePhraseChange}
        />
      </Box>
      {invalidPhrase && (
        <Typography className="mt-2 ml-3" color="red" variant="caption">
          {t('views.walletModal.invalidPhrase')}
        </Typography>
      )}
      <Box className="space-x-2 mt-6 mb-2" row>
        <Typography variant="subtitle2">
          {t('views.walletModal.keystorePassword')}
        </Typography>
      </Box>
      <Box className="w-full">
        <Input
          border="rounded"
          name="password"
          type="password"
          placeholder={t('views.walletModal.confirmPassword')}
          stretch
          disabled={!phrase}
          value={password}
          onChange={handlePasswordChange}
        />
      </Box>
      {invalidStatus && (
        <Typography className="mt-2 ml-3" color="red" variant="caption">
          {t('common.defaultErrMsg')}
        </Typography>
      )}

      <Box className="mt-6">
        <Button
          className="flex-1 group"
          size="sm"
          disabled={!ready}
          loading={processing}
          endIcon={
            <Icon
              className="transition group-hover:text-white"
              name="backup"
              size={18}
            />
          }
          onClick={handleBackupKeystore}
        >
          {t('views.walletModal.backupKeystore')}
        </Button>
      </Box>
    </Box>
  )
}
