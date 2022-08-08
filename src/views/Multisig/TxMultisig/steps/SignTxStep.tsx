import { useCallback, useState } from 'react'

import { Chain } from '@thorswap-lib/types'

import { CurrentSignerItem } from 'views/Multisig/components/CurrentSignerItem'
import { ImportSignatureModal } from 'views/Multisig/components/ImportSignatureModal'

import { Box, Button, Typography } from 'components/Atomic'
import { StepActions } from 'components/Stepper'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'
import { Signer } from 'services/multisig'

type Props = {
  handleSign: () => void
  connectedSignature: Signer | null
  addSigner: (signer: Signer) => void
}

export function SignTxStep({
  handleSign,
  connectedSignature,
  addSigner,
}: Props) {
  const { wallet, setIsConnectModalOpen } = useWallet()
  const [isImportModalOpened, setIsImportModalOpened] = useState(false)

  const connectedWalletAddress = wallet?.[Chain.THORChain]?.address || ''

  const handleSignClick = useCallback(() => {
    if (!connectedWalletAddress) {
      setIsConnectModalOpen(true)
      return
    }

    handleSign()
  }, [connectedWalletAddress, setIsConnectModalOpen, handleSign])

  return (
    <Box className="self-stretch mx-2" col flex={1}>
      <Box className="gap-2" col>
        <Typography variant="caption" fontWeight="normal">
          {t('views.multisig.addYourSignatureInfo')}
        </Typography>
        {!connectedSignature ? (
          <Button variant="primary" stretch onClick={handleSignClick}>
            {connectedWalletAddress
              ? t('views.multisig.signTx')
              : t('common.connectWallet')}
          </Button>
        ) : (
          <CurrentSignerItem
            pubKey={connectedSignature.pubKey}
            signature={connectedSignature.signature}
          />
        )}
      </Box>

      <Box className="gap-2 mt-6" col>
        <Typography variant="caption" fontWeight="normal">
          {t('views.multisig.importSignatureInfo')}
        </Typography>
        <Button
          variant="secondary"
          stretch
          onClick={() => setIsImportModalOpened(true)}
        >
          {t('views.multisig.importSignature')}
        </Button>
      </Box>

      <StepActions backHidden />

      <ImportSignatureModal
        isOpened={isImportModalOpened}
        onClose={() => setIsImportModalOpened(false)}
        onSubmit={(signature) => {
          setIsImportModalOpened(false)
          addSigner(signature)
        }}
      />
    </Box>
  )
}
