import { ChangeEvent } from 'react'

import classNames from 'classnames'

import {
  Icon,
  Box,
  Tooltip,
  Typography,
  Button,
  Modal,
} from 'components/Atomic'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

type ConnectKeyStoreProps = {
  fileName: undefined | string
  password: string
  isOpened: boolean
  onClose: () => void
  onPasswordChange: (event: ChangeEvent) => void
  onFileUpload: (event: ChangeEvent) => void
  onUnlock: () => void
  onCreateWallet: () => void
}

export const ConnectKeystore = ({
  fileName,
  password,
  onFileUpload,
  onPasswordChange,
  onUnlock,
  isOpened,
  onClose,
  onCreateWallet,
}: ConnectKeyStoreProps) => {
  return (
    <Modal title="Connect Wallet" isOpened={isOpened} onClose={onClose}>
      <div>
        <Typography variant="h5" className="mb-[26px]" fontWeight="semibold">
          {t('components.modal.keystore.selectKeystore')}
        </Typography>
        <label className="flex border justify-between px-6 py-[10px] cursor-pointer rounded-[16px] border-solid border-light-border-primary dark:border-dark-border-primary mb-[42px]">
          <input className="hidden" type="file" onChange={onFileUpload} />
          <Typography
            className={classNames('text-[11px] opacity-80', {
              'opacity-100': !!fileName,
            })}
            color={fileName ? 'primary' : 'secondary'}
            fontWeight={fileName ? 'bold' : 'normal'}
          >
            {fileName ? fileName : 'Choose File To Upload'}
          </Typography>
          <Icon
            name="upload"
            color={fileName ? 'primary' : 'secondary'}
            size={18}
          />
        </label>
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
        </div>

        <Box className="gap-x-4">
          <Button
            size="sm"
            variant="accent"
            type="outline"
            className="group"
            onClick={onUnlock}
            endIcon={
              <Icon
                name="unlock"
                className="ml-4 transition group-hover:text-white"
              />
            }
          >
            {t('components.modal.keystore.unlock')}
          </Button>
          <Button
            size="sm"
            type="outline"
            className="group"
            onClick={onCreateWallet}
            endIcon={
              <Icon
                name="wallet"
                color="primary"
                className="ml-4 transition group-hover:text-white"
              />
            }
          >
            {t('components.modal.keystore.createWallet')}
          </Button>
        </Box>
      </div>
    </Modal>
  )
}
