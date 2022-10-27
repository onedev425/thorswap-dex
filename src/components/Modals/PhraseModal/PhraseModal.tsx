import classNames from 'classnames';
import { Box, Button, Icon, Modal, Typography } from 'components/Atomic';
import { borderHoverHighlightClass, genericBgClasses } from 'components/constants';
import { Input } from 'components/Input';
import { usePhraseModal } from 'components/Modals/PhraseModal/usePhraseModal';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';

export type PhraseModalProps = {
  isOpen: boolean;
  onCancel?: () => void;
};

export const PhraseModal = ({ isOpen, onCancel = () => {} }: PhraseModalProps): JSX.Element => {
  const { showPhrase, submit, passwordField, errors, handleCopyPhrase } = usePhraseModal(isOpen);
  const phrases = useMemo(() => (isOpen ? multichain().getPhrase().split(' ') : []), [isOpen]);

  return (
    <Modal isOpened={isOpen} onClose={onCancel} title={t('views.walletModal.phrase')}>
      <Box className="md:!min-w-[350px]">
        {showPhrase ? (
          <Box col className="gap-2">
            <Box justify="end">
              <Button
                endIcon={<Icon color="primaryBtn" name="copy" />}
                onClick={handleCopyPhrase}
                type="borderless"
                variant="tint"
              >
                {t('views.walletModal.copyPhrase')}
              </Button>
            </Box>
            <Box
              className={classNames(
                'grid p-2.5 rounded-2xl grid-cols-4',
                genericBgClasses.primary,
                borderHoverHighlightClass,
              )}
            >
              {phrases.map((phrase: string, index: number) => {
                return (
                  <Box alignCenter className="p-1.5" key={phrase}>
                    <Typography>
                      {index + 1}. {phrase}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : (
          <Box col className="gap-1.5" flex={1}>
            <Box className="px-1.5">
              <Typography>{t('views.walletModal.enterKeystorePassword')}</Typography>
            </Box>
            <Input
              autoFocus
              stretch
              autoComplete="new-password"
              border="rounded"
              className="!text-md p-1.5 flex-1 border"
              icon="lock"
              placeholder={t('common.password')}
              type="password"
              {...passwordField}
            />
            {errors.password && (
              <Box className="px-1.5">
                <Typography color="orange">{t('views.walletModal.wrongPassword')}</Typography>
              </Box>
            )}
            <Box justifyCenter className="mt-4">
              <Button stretch onClick={submit}>
                {t('views.walletModal.viewPhrase')}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
