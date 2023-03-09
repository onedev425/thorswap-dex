import { showSuccessToast } from 'components/Toast';
import copy from 'copy-to-clipboard';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';

// TODO(@Chillios)
export const usePhraseModal = (isOpen: boolean) => {
  const { keystore, phrase } = useWallet();
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

      const { decryptFromKeystore } = await import('@thorswap-lib/keystore');

      try {
        const decodedPhrase = await decryptFromKeystore(keystore, password);

        if (phrase === decodedPhrase) {
          setShowPhrase(true);
        } else {
          throw Error('Invalid password');
        }
      } catch (error: NotWorth) {
        console.error(error);
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
