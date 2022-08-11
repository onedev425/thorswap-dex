import { UseFormRegisterReturn } from 'react-hook-form'

import { Box, Typography } from 'components/Atomic'
import { TextField } from 'components/Form'
import { StepActions } from 'components/Stepper'

import { t } from 'services/i18n'

type Props = {
  field: UseFormRegisterReturn<'name'>
  hasError: boolean
}

export const WalletNameStep = ({ field, hasError }: Props) => {
  return (
    <Box className="self-stretch mx-2" col flex={1}>
      <Box className="gap-3" col flex={1}>
        <Typography variant="caption" fontWeight="normal">
          {t('views.multisig.nameYourWalletOptionaly')}
        </Typography>

        <Box col>
          <TextField
            label={t('views.multisig.nameOfNewMultisig')}
            placeholder={t('views.multisig.nameExample')}
            hasError={hasError}
            field={field}
          />
        </Box>
      </Box>

      <StepActions />
    </Box>
  )
}
