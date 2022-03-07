import { useCallback, useState } from 'react'

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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      setInvalidStatus(false)
    },
    [],
  )

  const handlePhraseChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInvalidPhrase(false)
      setPhrase(e.target.value)
    },
    [],
  )

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
        console.error(error)
      }
      setProcessing(false)
    }
  }, [phrase, password])

  const ready = password.length > 0 && !invalidPhrase && !processing

  return (
    <Box className="w-full" col>
      <Helmet title="Import Phrase" content="Import Phrase" />
      <Box className="space-x-2" row>
        <Typography className="mb-2" variant="subtitle2" fontWeight="semibold">
          {t('components.modal.keystore.enterSeed')}
        </Typography>
      </Box>
      <Box className="w-full">
        <Input
          border="rounded"
          name="phrase"
          placeholder={t('components.modal.keystore.phrase')}
          stretch
          value={phrase}
          onChange={handlePhraseChange}
        />
      </Box>
      {invalidPhrase && (
        <Typography className="mt-2 ml-3" color="red" variant="caption">
          {t('components.modal.keystore.invalidPhrase')}
        </Typography>
      )}
      <Box className="space-x-2" row mt={24} mb={2}>
        <Typography variant="subtitle2">
          {t('components.modal.keystore.keystorePassword')}
        </Typography>
      </Box>
      <Box className="w-full">
        <Input
          border="rounded"
          name="password"
          type="password"
          placeholder={t('components.modal.keystore.confirmPassword')}
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

      <Box mt={24}>
        <Button
          className="flex-1 group"
          size="sm"
          disabled={!ready}
          isLoading={processing}
          endIcon={
            <Icon
              className="transition group-hover:text-white"
              name="backup"
              size={18}
            />
          }
          onClick={handleBackupKeystore}
        >
          {t('components.modal.keystore.backupKeystore')}
        </Button>
      </Box>
    </Box>
  )
}
