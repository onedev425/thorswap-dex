import { showSuccessToast } from 'components/Toast';
import { useKeystore } from 'context/wallet/hooks';
import copy from 'copy-to-clipboard';
import { useCallback, useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { t } from 'services/i18n';
import { logEvent } from 'services/logger';

// TODO(@Chillios)
export const usePhraseModal = (isOpen: boolean) => {
  const { keystore, phrase } = useKeystore();
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const [showPhrase, setShowPhrase] = useState(false);
  const passwordField = register('password', { required: true });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setShowPhrase(false);
        reset({ password: '' });
      }, 300);
    }
  }, [isOpen, reset]);

  const handleConfirm = useCallback(
    async ({ password }: FieldValues) => {
      if (!keystore) return;

      const { decryptFromKeystore } = await import('@swapkit/wallet-keystore');

      try {
        const decodedPhrase = await decryptFromKeystore(keystore, password);

        if (phrase === decodedPhrase) {
          setShowPhrase(true);
        } else {
          throw Error('Invalid password');
        }
      } catch (error: NotWorth) {
        logEvent(error.tostring());
        setError('password', { type: 'value' });
      }
    },
    [keystore, phrase, setError],
  );

  const submit = handleSubmit(handleConfirm);

  const handleCopyPhrase = useCallback(() => {
    copy(phrase);
    showSuccessToast(t('views.walletModal.phraseCopied'));
  }, [phrase]);

  return {
    handleConfirm,
    showPhrase,
    errors,
    submit,
    passwordField,
    handleCopyPhrase,
  };
};
