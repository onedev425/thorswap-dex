import { useCallback, useState } from 'react'

import { MultisigCreate } from 'views/Multisig/MultisigCreate'
import { MultisigImport } from 'views/Multisig/MultisigImport'
import { MultisigInfo } from 'views/Multisig/MultisigInfo'

import { Box, Typography } from 'components/Atomic'
import { HoverIcon } from 'components/HoverIcon'
import { Confirm } from 'components/Modals/Confirm'

import { useMultisig } from 'store/multisig/hooks'
import { useAppSelector } from 'store/store'

import { t } from 'services/i18n'

const Multisig = () => {
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const hasWallet = useAppSelector((state) => !!state.multisig.address)
  const { clearMultisigWallet } = useMultisig()

  const handleClearWallet = useCallback(() => {
    clearMultisigWallet()
    setIsConfirmVisible(false)
  }, [clearMultisigWallet, setIsConfirmVisible])

  return (
    <Box col>
      <Box className="gap-5">
        <Box justify="between" alignCenter flex={1}>
          <Typography className="mb-5 mx-3" variant="h3">
            {t('views.multisig.multisigWallet')}
          </Typography>

          {hasWallet && (
            <Box className="mb-5">
              <HoverIcon
                onClick={() => setIsConfirmVisible(true)}
                iconName="trash"
                tooltip={t('views.multisig.removeWallet')}
                color="secondary"
              />
            </Box>
          )}
        </Box>
        <Box flex={1} />
      </Box>

      <Box className="flex-col md:flex-row gap-5">
        <Box className="basis-full">
          {hasWallet ? <MultisigInfo /> : <MultisigImport />}
        </Box>
        <Box className="basis-full">
          <MultisigCreate />
        </Box>
      </Box>

      <Confirm
        title={t('common.pleaseConfirm')}
        description={t('views.multisig.confirmWalletRemoval')}
        isOpened={isConfirmVisible}
        onCancel={() => setIsConfirmVisible(false)}
        onConfirm={handleClearWallet}
      />
    </Box>
  )
}

export default Multisig
