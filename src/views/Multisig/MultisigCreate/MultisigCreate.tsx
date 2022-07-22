import { useMemo, useState } from 'react'

import classNames from 'classnames'

import { useMultisigForm } from 'views/Multisig/hooks'

import { Box, Button, Typography } from 'components/Atomic'
import { FieldLabel, TextField } from 'components/Form'
import { HoverIcon } from 'components/HoverIcon'
import { Input } from 'components/Input'
import { PanelView } from 'components/PanelView'
import { Stepper } from 'components/Stepper'
import { StepType } from 'components/Stepper/types'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const MultisigCreate = () => {
  const [step, setStep] = useState(0)
  const {
    formFields,
    submit,
    errors,
    register,
    addMember,
    removeMember,
    isRequiredMember,
  } = useMultisigForm()

  const steps: StepType[] = useMemo(
    () => [
      {
        id: 0,
        label: 'Step 1',
        content: (
          <Box className="gap-6" col>
            <Typography className="mx-2 my-3" variant="caption">
              {t('views.multisig.nameYourMultisigWallet')}
            </Typography>

            <Box col>
              <TextField
                label={t('views.multisig.nameOfNewMultisig')}
                placeholder={t('views.multisig.nameExample')}
                hasError={!!errors.name}
                field={formFields.name}
              />
            </Box>

            <Box col>
              <FieldLabel
                hasError={!!errors.signatureValidation}
                label={`${t('views.multisig.members')}${
                  errors.signatureValidation
                    ? ` (${errors.signatureValidation.message})`
                    : ''
                }`}
              />
              <Typography
                className="mx-2 my-3"
                fontWeight="semibold"
                variant="caption-xs"
              >
                {t('views.multisig.addMembersDescription')}
              </Typography>
              <Box className="mx-2">
                <Box flex={1}>
                  <Typography variant="caption">
                    {t('views.multisig.walletName')}
                  </Typography>
                </Box>
                <Box flex={2}>
                  <Typography variant="caption">
                    {t('common.pubKey')}
                  </Typography>
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

                <Button
                  stretch
                  type="outline"
                  variant="tertiary"
                  onClick={addMember}
                >
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

            <Box className="mt-8" flex={1}>
              <Button stretch variant="secondary" onClick={submit}>
                {t('views.multisig.create')}
              </Button>
            </Box>
          </Box>
        ),
      },
      {
        id: 1,
        label: 'Step 2',
        content: 'Step 22',
      },
    ],
    [
      addMember,
      errors.members,
      errors.name,
      errors.signatureValidation,
      errors.treshold,
      formFields.members,
      formFields.name,
      formFields.treshold,
      isRequiredMember,
      register,
      removeMember,
      submit,
    ],
  )

  return (
    <PanelView
      title={t('views.multisig.thorSafeWallet')}
      header={
        <ViewHeader withBack title={t('views.multisig.createThorSafeWallet')} />
      }
    >
      <Box className="self-stretch" col flex={1}>
        <Stepper activeStep={step} onStepChange={setStep} steps={steps} />
      </Box>
    </PanelView>
  )
}

export default MultisigCreate
