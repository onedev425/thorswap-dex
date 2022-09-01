import classNames from 'classnames';
import { Box, Button, Typography } from 'components/Atomic';
import { FieldLabel, TextField } from 'components/Form';
import { HoverIcon } from 'components/HoverIcon';
import { Input } from 'components/Input';
import { StepActions } from 'components/Stepper';
import { useStepper } from 'components/Stepper/StepperContext';
import { DeepRequired, FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
import { t } from 'services/i18n';
import {
  MultisigFormFields,
  MultisigFormValues,
  SubmitMultisigForm,
} from 'views/Multisig/MultisigCreate/types';

type Props = {
  id: number;
  addMember: () => void;
  formFields: MultisigFormFields;
  errors: FieldErrorsImpl<DeepRequired<MultisigFormValues>>;
  register: UseFormRegister<MultisigFormValues>;
  removeMember: (id: number) => void;
  submit: SubmitMultisigForm;
  isRequiredMember: (id: number) => boolean;
};

export const MembersStep = ({
  formFields,
  errors,
  addMember,
  register,
  submit,
  removeMember,
  isRequiredMember,
}: Props) => {
  const { nextStep } = useStepper();

  return (
    <Box col className="self-stretch mx-2 gap-6" flex={1}>
      <Box col className="gap-3" flex={1}>
        <Typography fontWeight="normal" variant="caption">
          {t('views.multisig.addMembersToWallet')}
        </Typography>
      </Box>
      <Box className="justify-between">
        <Typography fontWeight="bold" variant="body">
          {t('views.multisig.members')}
        </Typography>
        <HoverIcon
          color="secondary"
          iconName="infoCircle"
          tooltip={t('views.multisig.membersTooltip')}
        />
      </Box>
      <Box col>
        {!!errors.signatureValidation && (
          <FieldLabel hasError label={errors.signatureValidation.message || ''} />
        )}

        <Box className="mx-2">
          <Box flex={1}>
            <Typography variant="caption">{t('views.multisig.memberName')}</Typography>
          </Box>
          <Box flex={2}>
            <Typography variant="caption">{t('common.pubKey')}</Typography>
          </Box>
        </Box>

        <Box col className="gap-4">
          {formFields.members.map((item, index) => (
            <Box className="gap-2" key={item.id}>
              <Box flex={1}>
                <TextField
                  field={register(`members.${index}.name`)}
                  hasError={!!errors.members?.[index]?.name}
                  placeholder={t('views.multisig.memberName')}
                />
              </Box>
              <Box flex={2}>
                <TextField
                  field={register(`members.${index}.pubKey`, {
                    required: isRequiredMember(index),
                  })}
                  hasError={!!errors.members?.[index]?.pubKey}
                  placeholder={t('views.multisig.publicKeyBase64')}
                />
              </Box>

              {isRequiredMember(index) ? (
                <HoverIcon
                  color="secondary"
                  iconName="infoCircle"
                  tooltip={t('views.multisig.requiredMember')}
                />
              ) : (
                <HoverIcon
                  color="secondary"
                  iconName="close"
                  onClick={() => {
                    removeMember(index);
                  }}
                  tooltip={t('views.multisig.removeMember')}
                />
              )}
            </Box>
          ))}

          <Button stretch onClick={addMember} type="outline" variant="tertiary">
            {t('views.multisig.addMember')}
          </Button>
        </Box>
      </Box>
      <Box className="justify-between">
        <Typography fontWeight="bold" variant="body">
          {t('views.multisig.signers')}
        </Typography>
        <HoverIcon
          color="secondary"
          iconName="infoCircle"
          tooltip={t('views.multisig.signersTooltip')}
        />
      </Box>
      <Box center className="mx-1 gap-2">
        <Typography variant="caption">{t('views.multisig.setMultisigSigners')}</Typography>

        <Box center className="gap-2">
          <Input
            stretch
            border="rounded"
            className="py-1 min-w-[25px] text-right"
            containerClassName={classNames({
              '!border-red': !!errors.treshold,
            })}
            {...formFields.treshold}
          />

          <Typography className="whitespace-nowrap" variant="caption">
            {t('views.multisig.outOf')}
            {formFields.members.length}
          </Typography>
        </Box>
      </Box>

      <StepActions nextAction={() => submit(nextStep)} />
    </Box>
  );
};
