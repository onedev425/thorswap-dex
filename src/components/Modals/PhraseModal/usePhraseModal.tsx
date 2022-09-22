import { decryptFromKeystore } from '@thorswap-lib/xchain-crypto';
import { showSuccessToast } from 'components/Toast';
import copy from 'copy-to-clipboard';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useWallet } from 'store/wallet/hooks';

// TODO(@Chillios)
export const usePhraseModal = (isOpen: boolean) => {
  const { keystore } = useWallet();
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

      try {
        const phrase = await decryptFromKeystore(keystore, password);
        const isValid = multichain().getPhrase() === phrase;

        if (isValid) {
          setShowPhrase(true);
        } else {
          throw Error('Invalid password');
        }
      } catch (error) {
        setError('password', { type: 'value' });
      }
    },
    [keystore, setError],
  );

  const submit = handleSubmit(handleConfirm);

  const handleCopyPhrase = useCallback(() => {
    copy(multichain().getPhrase());
    showSuccessToast(t('views.walletModal.phraseCopied'));
  }, []);

  return {
    handleConfirm,
    showPhrase,
    errors,
    submit,
    passwordField,
    handleCopyPhrase,
  };
};
