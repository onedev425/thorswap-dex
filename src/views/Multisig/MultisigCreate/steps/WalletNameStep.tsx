import { Box, Typography } from 'components/Atomic';
import { TextField } from 'components/Form';
import { StepActions } from 'components/Stepper';
import { UseFormRegisterReturn } from 'react-hook-form';
import { t } from 'services/i18n';

type Props = {
  field: UseFormRegisterReturn<'name'>;
  hasError: boolean;
};

export const WalletNameStep = ({ field, hasError }: Props) => {
  return (
    <Box col className="self-stretch mx-2" flex={1}>
      <Box col className="gap-3" flex={1}>
        <Typography fontWeight="normal" variant="caption">
          {t('views.multisig.nameYourWalletOptionaly')}
        </Typography>

        <Box col>
          <TextField
            field={field}
            hasError={hasError}
            label={t('views.multisig.nameOfNewMultisig')}
            placeholder={t('views.multisig.nameExample')}
          />
        </Box>
      </Box>

      <StepActions />
    </Box>
  );
};
