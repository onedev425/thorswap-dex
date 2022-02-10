import { useCallback, useState } from 'react'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { Modal } from 'components/Modal'

import { t } from 'services/i18n'

import { WalletOptions } from './types'

export type Props = {
  onChange: (selectedWallet: string) => void
}

export const ConnectWallet = (props: Props) => {
  const { onChange } = props

  const [isOpened, setIsOpened] = useState(true)

  const onHandleChange = useCallback(
    (selectedWallet: string) => {
      onChange(selectedWallet)
    },
    [onChange],
  )

  return (
    <Modal
      title="Connect Wallet"
      isOpened={isOpened}
      onClose={() => setIsOpened(false)}
    >
      <div className="flex flex-col w-full">
        {WalletOptions.map(({ name, icon, id }) => {
          return (
            <Button
              key={id}
              size="large"
              outline
              bgColor="tertiary"
              onClick={() => onHandleChange(id)}
              className="justify-between w-full mb-1"
              endIcon={<Icon name={icon} color="purple" />}
            >
              {name}
            </Button>
          )
        })}
        <div className="flex justify-between mt-[40px]">
          <Button
            size="large"
            outline
            onClick={() => onHandleChange('create-keystore')}
          >
            {t('components.connectWallet.createKeystore')}
          </Button>
          <Button
            size="large"
            bgColor="secondary"
            outline
            onClick={() => onHandleChange('import-phrase')}
          >
            {t('components.connectWallet.importPhrase')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
