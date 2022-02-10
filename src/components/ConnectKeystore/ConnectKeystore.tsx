import classNames from 'classnames'

import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { Input } from 'components/Input'
import { Modal } from 'components/Modal'
import { Tooltip } from 'components/Tooltip'
import { Typography } from 'components/Typography'

import { t } from 'services/i18n'

import { ConnectKeyStoreProps } from './types'

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
          {t('components.connectKeystore.selectKeystoreFile')}
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
            {t('components.connectKeystore.decryptionPassword')}
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
            size="small"
            outline
            bgColor="navy"
            className="group"
            onClick={onUnlock}
            endIcon={
              <Icon
                name="unlock"
                className="ml-4 group-hover:text-white transition"
              />
            }
          >
            {t('components.connectKeystore.unlock')}
          </Button>
          <Button
            size="small"
            outline
            bgColor="primary"
            className="group"
            onClick={onCreateWallet}
            endIcon={
              <Icon
                name="wallet"
                color="primary"
                className="ml-4 group-hover:text-white transition"
              />
            }
          >
            {t('components.connectKeystore.createWallet')}
          </Button>
        </Box>
      </div>
    </Modal>
  )
}
