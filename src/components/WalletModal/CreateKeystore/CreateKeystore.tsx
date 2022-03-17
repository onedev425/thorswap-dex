import { useCallback, useMemo, useState } from 'react'

import {
  validatePhrase,
  generatePhrase,
  encryptToKeyStore,
  Keystore,
} from '@thorswap-lib/xchain-crypto'

import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

import { downloadAsFile } from 'helpers/download'

type Props = {
  onConnect: (keystore: Keystore, phrase: string) => void
  onKeystore: () => void
}

export const KeystoreView = ({ onConnect, onKeystore }: Props) => {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [invalidStatus, setInvalidStatus] = useState(false)
  const [processing, setProcessing] = useState(false)

  const ready = useMemo(
    () => password.length > 0 && password === confirmPassword,
    [password, confirmPassword],
  )

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      setInvalidStatus(false)
    },
    [],
  )

  const handleConfirmPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value)
      if (password !== e.target.value) {
        setInvalidStatus(true)
      } else {
        setInvalidStatus(false)
      }
    },
    [password],
  )

  const handleCreate = useCallback(async () => {
    if (ready) {
      setProcessing(true)

      try {
        const phrase = generatePhrase()
        const isValid = validatePhrase(phrase)
        if (!isValid) {
          return
        }

        const keystore = await encryptToKeyStore(phrase, password)

        await downloadAsFile('thorswap-keystore.txt', JSON.stringify(keystore))

        // clean up
        setPassword('')
        setConfirmPassword('')

        onConnect(keystore, phrase)
      } catch (error) {
        setInvalidStatus(true)
        console.error(error)
      }
      setProcessing(false)
    }
  }, [ready, password, onConnect])

  return (
    <Box className="w-full" col>
      <Helmet title="Create Wallet" content="Create Wallet" />
      <Box className="space-x-2" row>
        <Typography className="mb-2" variant="subtitle2" fontWeight="semibold">
          {t('components.modal.keystore.inputPassword')}
        </Typography>
        <Tooltip
          place="top"
          content="Password for recovery"
          iconName="question"
        />
      </Box>
      <Box className="w-full">
        <Input
          border="rounded"
          name="password"
          type="password"
          placeholder={t('components.modal.keystore.enterPassword')}
          stretch
          value={password}
          onChange={handlePasswordChange}
        />
      </Box>
      <Box className="space-x-2" row mt={24} mb={2}>
        <Typography variant="subtitle2">
          {t('components.modal.keystore.confirmPassword')}
        </Typography>
      </Box>
      <Box className="w-full">
        <Input
          border="rounded"
          name="password"
          type="password"
          placeholder={t('components.modal.keystore.confirmPassword')}
          stretch
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </Box>
      {invalidStatus && (
        <Typography className="mt-2 ml-3" color="red" variant="caption">
          {t('components.modal.keystore.wrongPassword')}
        </Typography>
      )}

      <Box className="gap-x-4" mt={24}>
        <Button
          className="flex-1 group"
          size="sm"
          disabled={!ready}
          isLoading={processing}
          endIcon={
            <Icon
              className="transition dark:group-hover:text-white"
              name="key"
              size={18}
            />
          }
          onClick={handleCreate}
        >
          {t('components.modal.keystore.create')}
        </Button>

        <Button
          className="flex-1 group"
          size="sm"
          variant="accent"
          type="outline"
          endIcon={
            <Icon
              className="transition dark:group-hover:text-white"
              name="wallet"
              size={18}
            />
          }
          onClick={onKeystore}
        >
          {t('components.modal.keystore.connectWallet')}
        </Button>
      </Box>
    </Box>
  )
}
