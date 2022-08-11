import classNames from 'classnames'

import { MultisigExport } from 'views/Multisig/components/MultisigExport/MultisigExport'

import { Box, Icon, Tooltip, Typography } from 'components/Atomic'
import { genericBgClasses, lightInputBorder } from 'components/constants'
import { HighlightCard } from 'components/HighlightCard'
import { StepActions } from 'components/Stepper'

import { useAppSelector } from 'store/store'

import { useAddressUtils } from 'hooks/useAddressUtils'

import { t } from 'services/i18n'

export const ExportWalletStep = () => {
  const { address } = useAppSelector((state) => state.multisig)
  const { handleCopyAddress } = useAddressUtils(address)

  return (
    <Box className="gap-5" col>
      <Box className="gap-3" col>
        <Typography variant="caption" fontWeight="normal">
          {`${t('views.multisig.createdWalletAddress')}:`}
        </Typography>
        <Tooltip className="flex flex-1" content={t('common.copy')}>
          <Box
            className="gap-2 cursor-pointer"
            flex={1}
            center
            onClick={handleCopyAddress}
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
                  {address}
                </Typography>
                <div>
                  <Icon className="px-2" name="copy" size={16} />
                </div>
              </Box>
            </HighlightCard>
          </Box>
        </Tooltip>
      </Box>

      <Box className="gap-2">
        <Typography variant="caption">
          {t('views.multisig.exportWalletInfoToFile')}
        </Typography>
        <MultisigExport />
      </Box>

      <StepActions />
    </Box>
  )
}
