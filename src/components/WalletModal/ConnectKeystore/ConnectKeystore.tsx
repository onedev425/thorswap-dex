import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react'

import { FilePicker } from 'react-file-picker'

import { decryptFromKeystore, Keystore } from '@thorswap-lib/xchain-crypto'
import classNames from 'classnames'

import { Box, Icon, Tooltip, Typography, Button } from 'components/Atomic'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

type Props = {
  loading?: boolean
  onConnect: (keystore: Keystore, phrase: string) => void
  onCreate: () => void
}

export const KeystoreView = ({ loading, onConnect, onCreate }: Props) => {
  const [keystore, setKeystore] = useState<Keystore>()
  const [password, setPassword] = useState<string>('')
  const [invalidStatus, setInvalidStatus] = useState(false)
  const [keystoreError, setKeystoreError] = useState('')
  const [processing, setProcessing] = useState(false)

  const onChangeFile = useCallback((file: Blob) => {
    const reader = new FileReader()
    const onLoadHandler = () => {
      try {
        const key = JSON.parse(reader.result as string)
        if (!('version' in key) || !('crypto' in key)) {
          setKeystoreError('Not a valid keystore file')
        } else {
          setKeystoreError('')
          setKeystore(key)
        }
      } catch {
        setKeystoreError('Not a valid json file')
      }
    }
    reader.addEventListener('load', onLoadHandler)
    reader.readAsText(file)
    return () => {
      reader.removeEventListener('load', onLoadHandler)
    }
  }, [])

  const onErrorFile = useCallback((error: Error) => {
    setKeystoreError(`Selecting a key file failed: ${error}`)
  }, [])

  const unlockKeystore = useCallback(async () => {
    if (keystore) {
      setProcessing(true)

      try {
        const phrase = await decryptFromKeystore(keystore, password)

        // clean up
        setPassword('')
        setKeystore(undefined)
        setProcessing(false)
        onConnect(keystore, phrase)
      } catch (error) {
        setProcessing(false)

        setInvalidStatus(true)
        console.error(error)
      }
    }
  }, [keystore, password, onConnect])

  const onPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setInvalidStatus(false)
  }, [])

  const onPasswordKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        unlockKeystore()
      }
    },
    [unlockKeystore],
  )

  const ready = password.length > 0 && !keystoreError && !processing

  return (
    <Box className="w-full" col>
      <Typography className="mb-2" variant="subtitle2" fontWeight="semibold">
        {t('views.walletModal.selectKeystore')}
      </Typography>
      <FilePicker onChange={onChangeFile} onError={onErrorFile}>
        <Box
          className="h-10 px-3 border border-solid cursor-pointer rounded-2xl border-light-border-primary dark:border-dark-border-primary hover:border-light-typo-gray dark:hover:border-dark-typo-gray"
          alignCenter
        >
          {!keystore && !keystoreError && <Icon name="upload" size={18} />}
          {keystore && !keystoreError && (
            <Icon name="valid" color="green" size={18} />
          )}
          {keystoreError && <Icon name="invalid" color="red" size={18} />}
          <Typography
            className={classNames('text-[11px] opacity-80 ml-2', {
              'opacity-100': keystore && !keystoreError,
            })}
            variant="caption-xs"
            fontWeight="semibold"
          >
            {t('views.walletModal.chooseKeystore')}
          </Typography>
        </Box>
      </FilePicker>
      <Typography
        className="mt-2 ml-3"
        color="red"
        variant="caption"
        fontWeight="normal"
      >
        {keystoreError ? t('views.walletModal.invalidKeystore') : ''}
      </Typography>
      <Box className="space-x-2" row mt={24} mb={2}>
        <Typography variant="subtitle2">
          {t('views.walletModal.keystorePassword')}
        </Typography>
        <Tooltip
          place="top"
          content="Password for recovery"
          iconName="question"
        />
      </Box>
      <Box className="flex-1 w-full">
        <Input
          border="rounded"
          name="password"
          type="password"
          placeholder="Password"
          stretch
          value={password}
          onChange={onPasswordChange}
          onKeyDown={onPasswordKeyDown}
        />
      </Box>
      {invalidStatus && (
        <Typography className="mt-2 ml-3" color="orange" variant="caption">
          {t('views.walletModal.wrongPassword')}
        </Typography>
      )}

      <Box className="gap-x-4" mt={24}>
        <Button
          className="flex-1 group"
          size="sm"
          disabled={!ready}
          loading={processing || loading}
          endIcon={
            <Icon
              className="transition group-hover:text-white"
              name="unlock"
              size={18}
            />
          }
          onClick={unlockKeystore}
        >
          {t('views.walletModal.unlock')}
        </Button>
        <Button
          className="flex-1 group"
          size="sm"
          variant="tint"
          type="outline"
          endIcon={<Icon name="wallet" size={18} />}
          onClick={onCreate}
        >
          {t('views.walletModal.createWallet')}
        </Button>
      </Box>
    </Box>
  )
}
