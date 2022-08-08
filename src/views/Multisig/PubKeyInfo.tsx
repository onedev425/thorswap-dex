import { useMemo, useState } from 'react'

import { Chain } from '@thorswap-lib/types'
import classNames from 'classnames'
import copy from 'copy-to-clipboard'

import { MultisigModal } from 'views/Multisig/MultisigModal/MultisigModal'

import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'
import { FieldLabel } from 'components/Form'
import { HighlightCard } from 'components/HighlightCard'
import { InfoTip } from 'components/InfoTip'
import { showSuccessToast } from 'components/Toast'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

export const PubKeyInfo = () => {
  const [isMultisigModalOpened, setMultisigModalOpened] = useState(false)
  const { wallet, setIsConnectModalOpen } = useWallet()
  const connectedWalletAddress = wallet?.[Chain.THORChain]?.address || ''
  const pubKey = useMemo(() => {
    return connectedWalletAddress ? multichain.thor.getPubkey() : ''
  }, [connectedWalletAddress])

  const handleCopyPubKey = () => {
    copy(pubKey)
    showSuccessToast(t('views.multisig.pubKeyCopied'))
  }

  return (
    <InfoTip type="info" title="Public key">
      <Box className="self-stretch mx-2" col flex={1}>
        <Box className="gap-1" col flex={1}>
          <Typography className="my-3" fontWeight="light">
            {t('views.multisig.createMultisigPubKeyInfo')}
          </Typography>

          <Box flex={1} align="end">
            {!pubKey ? (
              <Button
                stretch
                variant="primary"
                onClick={() => setIsConnectModalOpen(true)}
              >
                {/* {t('views.multisig.multisigModalTitle')} */}
                Connect wallet
              </Button>
            ) : (
              <Box col flex={1}>
                <FieldLabel label="Your wallet's public key:" />
                <Tooltip className="flex flex-1" content={t('common.copy')}>
                  <Box
                    className="gap-2 cursor-pointer"
                    flex={1}
                    center
                    onClick={handleCopyPubKey}
                  >
                    <HighlightCard
                      className={classNames(
                        genericBgClasses.primary,
                        'truncate overflow-hidden flex-1',
                      )}
                    >
                      <Box justify="between">
                        <Typography
                          className="break-all whitespace-normal"
                          variant="caption"
                          color="secondary"
                        >
                          {pubKey}
                        </Typography>
                        <div>
                          <Icon className="pl-2" name="copy" size={16} />
                        </div>
                      </Box>
                    </HighlightCard>
                  </Box>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>

        <MultisigModal
          isOpen={isMultisigModalOpened}
          onCancel={() => setMultisigModalOpened(false)}
        />
      </Box>
    </InfoTip>
  )
}
