import { useCallback, useState } from 'react'

import { FilePicker } from 'react-file-picker'

import { decryptFromKeystore, Keystore } from '@thorswap-lib/xchain-crypto'
import classNames from 'classnames'

import { Box, Icon, Tooltip, Typography, Button } from 'components/Atomic'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

type Props = {
  isLoading?: boolean
  onConnect: (keystore: Keystore, phrase: string) => void
  onCreate: () => void
}

export const KeystoreView = ({ isLoading, onConnect, onCreate }: Props) => {
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

  const onPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      setInvalidStatus(false)
    },
    [],
  )

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

  const ready = password.length > 0 && !keystoreError && !processing

  return (
    <Box className="w-full space-y-3" col>
      <div>
        <Typography variant="h5" className="mb-[26px]" fontWeight="semibold">
          {t('components.modal.keystore.selectKeystore')}
        </Typography>
        <div className="flex border justify-between px-6 py-[10px] cursor-pointer rounded-[16px] border-solid border-light-border-primary dark:border-dark-border-primary mb-[42px]">
          <FilePicker onChange={onChangeFile} onError={onErrorFile}>
            {keystore && !keystoreError && <Icon name="upload" size={18} />}
            <Typography
              className={classNames('text-[11px] opacity-80', {
                'opacity-100': keystore && !keystoreError,
              })}
            >
              Choose File To Upload
            </Typography>
          </FilePicker>
        </div>
        <div className="flex justify-between mb-[26px]">
          <Typography variant="subtitle2">
            {t('components.modal.keystore.keystorePassword')}
          </Typography>
          <div>
            <Tooltip
              place="top"
              content="Password for recovery"
              iconName="question"
            />
          </div>
        </div>
        <div className="mb-12">
          <Input
            border="rounded"
            type="password"
            name="password"
            placeholder="Password"
            stretch
            value={password}
            onChange={onPasswordChange}
          />
          {invalidStatus && (
            <Typography color="red">
              {t('components.modal.keystore.wrongPassword')}
            </Typography>
          )}
        </div>

        <Box className="gap-x-4">
          <Button
            className="group"
            size="sm"
            variant="accent"
            type="outline"
            disabled={!ready}
            isLoading={processing || isLoading}
            endIcon={
              <Icon
                name="unlock"
                className="ml-4 transition group-hover:text-white"
              />
            }
            onClick={unlockKeystore}
          >
            {t('components.modal.keystore.unlock')}
          </Button>
          <Button
            className="group"
            size="sm"
            type="outline"
            endIcon={
              <Icon
                name="wallet"
                color="primary"
                className="ml-4 transition group-hover:text-white"
              />
            }
            onClick={onCreate}
          >
            {t('components.modal.keystore.createWallet')}
          </Button>
        </Box>
      </div>
    </Box>
  )
}
