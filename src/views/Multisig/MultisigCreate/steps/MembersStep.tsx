import { DeepRequired, FieldErrorsImpl, UseFormRegister } from 'react-hook-form'

import classNames from 'classnames'

import {
  MultisigFormFields,
  MultisigFormValues,
  SubmitMultisigForm,
} from 'views/Multisig/MultisigCreate/types'

import { Box, Button, Typography } from 'components/Atomic'
import { FieldLabel, TextField } from 'components/Form'
import { HoverIcon } from 'components/HoverIcon'
import { Input } from 'components/Input'
import { StepActions } from 'components/Stepper'
import { useStepper } from 'components/Stepper/StepperContext'

import { t } from 'services/i18n'

type Props = {
  id: number
  addMember: () => void
  formFields: MultisigFormFields
  errors: FieldErrorsImpl<DeepRequired<MultisigFormValues>>
  register: UseFormRegister<MultisigFormValues>
  removeMember: (id: number) => void
  submit: SubmitMultisigForm
  isRequiredMember: (id: number) => boolean
}

export const MembersStep = ({
  formFields,
  errors,
  addMember,
  register,
  submit,
  removeMember,
  isRequiredMember,
}: Props) => {
  const { nextStep } = useStepper()

  return (
    <Box className="self-stretch mx-2 gap-6" col flex={1}>
      <Box className="gap-3" col flex={1}>
        <Typography variant="caption" fontWeight="normal">
          Add members to your wallet. You will need their public keys. We
          prefilled your public key for you - remember that order of keys
          matters
        </Typography>
      </Box>

      <Box col>
        {!!errors.signatureValidation && (
          <FieldLabel
            hasError
            label={errors.signatureValidation.message || ''}
          />
        )}

        <Box className="mx-2">
          <Box flex={1}>
            <Typography variant="caption">
              {t('views.multisig.memberName')}
            </Typography>
          </Box>
          <Box flex={2}>
            <Typography variant="caption">{t('common.pubKey')}</Typography>
          </Box>
        </Box>

        <Box className="gap-4" col>
          {formFields.members.map((item, index) => (
            <Box className="gap-2" key={item.id}>
              <Box flex={1}>
                <TextField
                  placeholder={t('views.multisig.memberName')}
                  hasError={!!errors.members?.[index]?.name}
                  field={register(`members.${index}.name`)}
                />
              </Box>
              <Box flex={2}>
                <TextField
                  placeholder="Member public key (base 64)"
                  hasError={!!errors.members?.[index]?.pubKey}
                  field={register(`members.${index}.pubKey`, {
                    required: isRequiredMember(index),
                  })}
                />
              </Box>

              {isRequiredMember(index) ? (
                <HoverIcon
                  iconName="infoCircle"
                  tooltip={t('views.multisig.requiredMember')}
                  color="secondary"
                />
              ) : (
                <HoverIcon
                  iconName="close"
                  tooltip={t('views.multisig.removeMember')}
                  color="secondary"
                  onClick={() => {
                    removeMember(index)
                  }}
                />
              )}
            </Box>
          ))}

          <Button stretch type="outline" variant="tertiary" onClick={addMember}>
            {t('views.multisig.addMember')}
          </Button>
        </Box>
      </Box>

      <Box className="mx-1 gap-2" center>
        <Typography variant="caption">
          {t('views.multisig.setMultisigSigners')}
        </Typography>

        <Box className="gap-2" center>
          <Input
            className="py-1 min-w-[25px] text-right"
            containerClassName={classNames({
              '!border-red': !!errors.treshold,
            })}
            stretch
            border="rounded"
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
  )
}
