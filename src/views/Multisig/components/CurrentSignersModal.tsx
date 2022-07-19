import { CurrentSignerItem } from 'views/Multisig/components/CurrentSignerItem'
import { useMultisigWalletInfo } from 'views/Multisig/hooks'

import { Box, Modal, Typography } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'

import { t } from 'services/i18n'
import { Signer } from 'services/multisig'

type Props = {
  isOpened: boolean
  onClose: () => void
  signers: Signer[]
}

export const CurrentSignersModal = ({ isOpened, onClose, signers }: Props) => {
  const info = useMultisigWalletInfo()

  return (
    <Modal
      title={t('views.multisig.currentSigners')}
      isOpened={isOpened}
      onClose={onClose}
    >
      <Box className="max-w-[440px] min-w-[250px] gap-6" flex={1} col>
        <InfoTable items={[info[1]]} horizontalInset />

        <Box className="gap-2" flex={1} col>
          {signers.length ? (
            signers.map(({ pubKey, signature }) => (
              <CurrentSignerItem
                key={signature}
                pubKey={pubKey}
                signature={signature}
              />
            ))
          ) : (
            <Box className="my-6" flex={1} center>
              <Typography>{t('views.multisig.noSigners')}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  )
}
