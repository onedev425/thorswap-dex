import React, { useCallback, useEffect, useState } from 'react'

import { useFilePicker } from 'react-sage'

import { decryptFromKeystore, Keystore } from '@thorswap-lib/xchain-crypto'
import classNames from 'classnames'

import { Box, Icon, Tooltip, Typography, Button } from 'components/Atomic'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

import { loadFile } from './utils'

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

  const { files, onClick, HiddenFileInput } = useFilePicker()

  const onLoadHandler = useCallback((reader: FileReader) => {
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
  }, [])

  const onErrorFile = useCallback(() => {
    setKeystoreError('Selecting a key file failed')
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

  const onPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      setInvalidStatus(false)
    },
    [],
  )

  const onPasswordKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        unlockKeystore()
      }
    },
    [unlockKeystore],
  )

  useEffect(() => {
    if (files) {
      loadFile(files[0], onLoadHandler, onErrorFile)
    }
  }, [files, onErrorFile, onLoadHandler])

  const ready = password.length > 0 && !keystoreError && !processing

  return (
    <Box className="w-full" col>
      <Typography className="mb-2" variant="subtitle2" fontWeight="semibold">
        {t('components.modal.keystore.selectKeystore')}
      </Typography>
      <Box
        className="h-10 px-3 border border-solid cursor-pointer rounded-2xl border-light-border-primary dark:border-dark-border-primary hover:border-light-typo-gray dark:hover:border-dark-typo-gray"
        alignCenter
        onClick={onClick}
      >
        <HiddenFileInput multiple={false} />
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
        >
          Choose File To Upload
        </Typography>
      </Box>
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
          {t('components.modal.keystore.keystorePassword')}
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
          placeholder="Password"
          stretch
          value={password}
          onChange={onPasswordChange}
          onKeyDown={onPasswordKeyDown}
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
          {t('components.modal.keystore.unlock')}
        </Button>
        <Button
          className="flex-1 group"
          size="sm"
          variant="tint"
          type="outline"
          endIcon={<Icon name="wallet" size={18} />}
          onClick={onCreate}
        >
          {t('components.modal.keystore.createWallet')}
        </Button>
      </Box>
    </Box>
  )
}
