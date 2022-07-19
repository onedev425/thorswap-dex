import classNames from 'classnames'

import { useMultisigForm } from 'views/Multisig/hooks'

import { Box, Button, Card, Typography } from 'components/Atomic'
import {
  borderHoverHighlightClass,
  baseBorderClass,
} from 'components/constants'
import { FieldLabel, TextField } from 'components/Form'
import { HoverIcon } from 'components/HoverIcon'
import { Input } from 'components/Input'

import { useAddressUtils } from 'hooks/useAddressUtils'

import { t } from 'services/i18n'

export const MultisigImport = () => {
  const {
    walletAddress,
    formFields,
    submit,
    errors,
    register,
    addMember,
    removeMember,
    isRequiredMember,
  } = useMultisigForm()
  const { handleCopyAddress } = useAddressUtils(walletAddress)

  return (
    <Box>
      <Card className={classNames(borderHoverHighlightClass, baseBorderClass)}>
        <Box className="gap-6" col>
          <Typography variant="subtitle1">
            {t('views.multisig.addMultisigWallet')}
          </Typography>
          <Typography className="my-3" fontWeight="light">
            {t('views.multisig.existingMultisigDescription')}
          </Typography>

          <Box col>
            <Typography className="mx-2 mb-0.5" variant="caption">
              {t('views.multisig.thorchainAddress')}
            </Typography>
            <Input
              className="py-1"
              stretch
              border="rounded"
              disabled
              value={walletAddress}
              placeholder="thor123..."
              suffix={
                walletAddress ? (
                  <HoverIcon
                    iconName="copy"
                    tooltip={t('common.copy')}
                    color="secondary"
                    onClick={handleCopyAddress}
                  />
                ) : null
              }
            />
          </Box>

          <TextField
            label="Name"
            placeholder="Enter a name of the multi-sig wallet"
            hasError={!!errors.name}
            field={formFields.name}
          />

          <Box col>
            <FieldLabel
              hasError={!!errors.signatureValidation}
              label={`${t('views.multisig.members')}${
                errors.signatureValidation
                  ? ` (${errors.signatureValidation.message})`
                  : ''
              }`}
            />

            <Box className="gap-2" col>
              {formFields.members.map((item, index) => (
                <Box className="gap-2" key={item.id}>
                  <Box flex={1}>
                    <TextField
                      placeholder="Member name"
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
            <Button stretch variant="primary" onClick={submit}>
              {t('views.multisig.review')}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
