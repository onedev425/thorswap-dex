import { useNavigate } from 'react-router'

import classNames from 'classnames'
import copy from 'copy-to-clipboard'

import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic'
import { genericBgClasses, lightInputBorder } from 'components/constants'
import { FieldLabel } from 'components/Form'
import { HighlightCard } from 'components/HighlightCard'
import { StepActions } from 'components/Stepper'
import { showSuccessToast } from 'components/Toast'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

type Props = {
  pubKey: string
}

export const PubKeyStep = ({ pubKey }: Props) => {
  const navigate = useNavigate()
  const { setIsConnectModalOpen } = useWallet()

  const handleCopyPubKey = () => {
    copy(pubKey)
    showSuccessToast(t('views.multisig.pubKeyCopied'))
  }

  return (
    <Box className="self-stretch mx-2" col flex={1}>
      <Box className="gap-5" col flex={1}>
        <Typography variant="caption" fontWeight="normal">
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
                      '!px-2 !py-3 truncate overflow-hidden flex-1 !border-opacity-20 hover:!border-opacity-100',
                      lightInputBorder,
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
                        <Icon className="px-2" name="copy" size={16} />
                      </div>
                    </Box>
                  </HighlightCard>
                </Box>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>

      <StepActions
        backLabel={t('common.cancel')}
        backAction={() => navigate(ROUTES.Multisig)}
      />
    </Box>
  )
}
