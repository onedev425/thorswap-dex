import { Controller } from 'react-hook-form'

import classNames from 'classnames'

import { useImportSignatureForm } from 'views/Multisig/components/hooks'
import { TextareaPaste } from 'views/Multisig/components/TextareaPaste'

import { Box, Button, DropdownMenu, Modal } from 'components/Atomic'
import { useButtonClasses } from 'components/Atomic/Button/useButtonClasses'
import { FieldLabel } from 'components/Form'

import { t } from 'services/i18n'
import { Signer } from 'services/multisig'

type Props = {
  isOpened: boolean
  onClose: () => void
  onSubmit: (signer: Signer) => void
}

export const ImportSignatureModal = ({
  isOpened,
  onSubmit,
  onClose,
}: Props) => {
  const {
    formFields,
    errors,
    setSignature,
    submit,
    membersOptions,
    control,
    reset,
  } = useImportSignatureForm(onSubmit)

  const { backgroundClass } = useButtonClasses({
    size: 'sm',
    variant: 'tint',
    isFancy: false,
    error: false,
  })

  const handleClose = () => {
    onClose()
    reset()
  }

  return (
    <Modal
      title={t('views.multisig.importSignature')}
      isOpened={isOpened}
      onClose={handleClose}
    >
      <Box className="max-w-[440px] md:min-w-[350px] self-stretch gap-6" col>
        <Box className="gap-1" col>
          <FieldLabel
            label={t('views.multisig.selectMember')}
            hasError={!!errors.memberPubKey}
          />

          <Controller
            name="memberPubKey"
            control={control}
            render={({ field }) => (
              <DropdownMenu
                menuItems={membersOptions}
                value={field.value}
                onChange={field.onChange}
                buttonClassName={classNames(
                  backgroundClass,
                  'shadow-none text-left !py-3 overflow-hidden',
                )}
              />
            )}
          />
        </Box>
        <Box className="gap-1" col>
          <FieldLabel
            label={t('views.multisig.signature')}
            hasError={!!errors.signature}
          />
          <TextareaPaste
            placeholder={t('views.multisig.pasteSignature')}
            onPasteClick={setSignature}
            hasError={!!errors.signature}
            {...formFields.signature}
          />
        </Box>

        <Button variant="secondary" stretch onClick={submit}>
          {t('views.multisig.submitSignature')}
        </Button>
      </Box>
    </Modal>
  )
}
