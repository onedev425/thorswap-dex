import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Button, Icon, Modal } from 'components/Atomic';
import { borderHoverHighlightClass, genericBgClasses } from 'components/constants';
import { Input } from 'components/Input';
import { usePhraseModal } from 'components/Modals/PhraseModal/usePhraseModal';
import { useKeystore } from 'context/wallet/hooks';
import { useMemo } from 'react';
import { t } from 'services/i18n';

export type PhraseModalProps = {
  isOpen: boolean;
  onCancel?: () => void;
};

export const PhraseModal = ({ isOpen, onCancel = () => {} }: PhraseModalProps): JSX.Element => {
  const { phrase } = useKeystore();
  const { showPhrase, submit, passwordField, errors, handleCopyPhrase } = usePhraseModal(isOpen);
  const phrases = useMemo(() => (isOpen ? phrase.split(' ') : []), [isOpen, phrase]);

  return (
    <Modal isOpened={isOpen} onClose={onCancel} title={t('views.walletModal.phrase')}>
      <Box className="md:!min-w-[350px]">
        {showPhrase ? (
          <Box col className="gap-2">
            <Box justify="end">
              <Button
                onClick={handleCopyPhrase}
                rightIcon={<Icon color="primaryBtn" name="copy" />}
                variant="borderlessTint"
              >
                {t('views.walletModal.copyPhrase')}
              </Button>
            </Box>
            <Box
              className={classNames(
                'ph-no-capture grid p-2.5 rounded-2xl grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
                genericBgClasses.primary,
                borderHoverHighlightClass,
              )}
            >
              {phrases.map((phrase: string, index: number) => {
                return (
                  <Box alignCenter className="p-1.5" key={phrase}>
                    <Text>
                      {index + 1}. {phrase}
                    </Text>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : (
          <Box col className="gap-1.5" flex={1}>
            <Box className="px-1.5">
              <Text>{t('views.walletModal.enterKeystorePassword')}</Text>
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
                <Text variant="orange">{t('views.walletModal.wrongPassword')}</Text>
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
