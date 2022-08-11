import { useNavigate } from 'react-router'

import { InactiveAccountWarning } from 'views/Multisig/components/InactiveAccountWarning'
import { useMultisigWalletInfo } from 'views/Multisig/hooks'

import { Box, Tooltip, Typography } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { StepActions } from 'components/Stepper'

import { useAppSelector } from 'store/store'

import { useAddressUtils } from 'hooks/useAddressUtils'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

export const WalletSummaryStep = () => {
  const navigate = useNavigate()
  const { address } = useAppSelector((state) => state.multisig)
  const { handleCopyAddress } = useAddressUtils(address)
  const info = useMultisigWalletInfo()

  return (
    <Box className="gap-5" col>
      <Box className="gap-3" col>
        <Typography variant="caption" fontWeight="normal">
          {`${t('views.multisig.thorSafeInfo')}:`}
        </Typography>
        <Tooltip className="flex flex-1" content={t('common.copy')}>
          <Box
            className="gap-2 cursor-pointer"
            flex={1}
            center
            onClick={handleCopyAddress}
          >
            <InfoTable items={info} horizontalInset />
          </Box>
        </Tooltip>
      </Box>

      <InactiveAccountWarning />

      <StepActions
        nextLabel={t('views.multisig.sendRune')}
        nextAction={() => navigate(ROUTES.Multisig)}
      />
    </Box>
  )
}
