import classNames from 'classnames';
import { Box, Button, DropdownMenu, Modal } from 'components/Atomic';
import { useButtonClasses } from 'components/Atomic/Button/useButtonClasses';
import { FieldLabel } from 'components/Form';
import { Controller } from 'react-hook-form';
import { t } from 'services/i18n';
import { Signer } from 'services/multisig';
import { useImportSignatureForm } from 'views/Multisig/components/hooks';
import { TextareaPaste } from 'views/Multisig/components/TextareaPaste';

type Props = {
  isOpened: boolean;
  onClose: () => void;
  onSubmit: (signer: Signer) => void;
};

export const ImportSignatureModal = ({ isOpened, onSubmit, onClose }: Props) => {
  const { formFields, errors, setSignature, submit, membersOptions, control, reset } =
    useImportSignatureForm(onSubmit);

  const { backgroundClass } = useButtonClasses({
    size: 'sm',
    variant: 'tint',
    isFancy: false,
    error: false,
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal isOpened={isOpened} onClose={handleClose} title={t('views.multisig.importSignature')}>
      <Box col className="max-w-[440px] md:min-w-[350px] self-stretch gap-6">
        <Box col className="gap-1">
          <FieldLabel hasError={!!errors.memberPubKey} label={t('views.multisig.selectMember')} />

          <Controller
            control={control}
            name="memberPubKey"
            render={({ field }) => (
              <DropdownMenu
                buttonClassName={classNames(
                  backgroundClass,
                  'shadow-none text-left !py-3 overflow-hidden',
                )}
                menuItems={membersOptions}
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
        </Box>
        <Box col className="gap-1">
          <FieldLabel hasError={!!errors.signature} label={t('views.multisig.signature')} />
          <TextareaPaste
            hasError={!!errors.signature}
            onPasteClick={setSignature}
            placeholder={t('views.multisig.pasteSignature')}
            {...formFields.signature}
          />
        </Box>

        <Button stretch onClick={submit} variant="secondary">
          {t('views.multisig.submitSignature')}
        </Button>
      </Box>
    </Modal>
  );
};
