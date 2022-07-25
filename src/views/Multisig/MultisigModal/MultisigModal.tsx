import classNames from 'classnames'

import { useMultisigForm } from 'views/Multisig/MultisigCreate/hooks'

import { Box, Button, Modal, Typography } from 'components/Atomic'
import { FieldLabel, TextField } from 'components/Form'
import { HoverIcon } from 'components/HoverIcon'
import { Input } from 'components/Input'
import { Scrollbar } from 'components/Scrollbar'

import { t } from 'services/i18n'

type Props = {
  isOpen: boolean
  onCancel?: () => void
}

export const MultisigModal = ({
  isOpen,
  onCancel = () => {},
}: Props): JSX.Element => {
  const {
    formFields,
    submit,
    errors,
    register,
    addMember,
    removeMember,
    isRequiredMember,
  } = useMultisigForm()

  return (
    <Modal
      title={t('views.multisig.multisigModalTitle')}
      isOpened={isOpen}
      onClose={onCancel}
    >
      <Box col>
        <Box
          className="!w-[300px] md:!w-[450px] gap-3 max-h-[80vh] lg:max-h-[65vh] overflow-y-auto -mr-7"
          col
        >
          <Scrollbar maxHeight="65vh">
            <Box className="gap-6 pr-7" col>
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
                <Button
                  stretch
                  variant="secondary"
                  onClick={() => submit(onCancel)}
                >
                  {t('views.multisig.create')}
                </Button>
              </Box>
            </Box>
          </Scrollbar>
        </Box>
      </Box>
    </Modal>
  )
}
