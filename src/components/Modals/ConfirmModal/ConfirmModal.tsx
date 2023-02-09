import { Text } from '@chakra-ui/react';
import { Asset } from '@thorswap-lib/multichain-core';
import { decryptFromKeystore } from '@thorswap-lib/xchain-crypto';
import { Box, Button, Modal } from 'components/Atomic';
import { PasswordInput } from 'components/PasswordInput';
import { isKeystoreSignRequired } from 'helpers/wallet';
import { KeyboardEventHandler, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useWallet } from 'store/wallet/hooks';

type Props = {
  inputAssets: Asset[];
  isOpened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children?: ReactNode;
  buttonDisabled?: boolean;
};

const MODAL_CLOSE_DELAY = 60 * 1000;

export const ConfirmModal = ({
  buttonDisabled,
  children,
  inputAssets,
  isOpened,
  onClose,
  onConfirm,
}: Props) => {
  const { keystore, wallet } = useWallet();
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [validating, setValidating] = useState(false);

  const [password, setPassword] = useState('');

  // check if keystore wallet is connected for input assets
  const isKeystoreSigningRequired = useMemo(
    () => isKeystoreSignRequired({ wallet, inputAssets }),
    [wallet, inputAssets],
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isOpened) {
      timeout = setTimeout(() => {
        onClose();
      }, MODAL_CLOSE_DELAY);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isOpened, onClose]);
  // reset password on visible update
  useEffect(() => {
    setPassword('');
    setInvalidPassword(false);
    setValidating(false);
  }, [isOpened]);

  // handler after password is verified
  const handleProceed = useCallback(() => {
    if (!onConfirm || !isOpened) {
      return;
    }

    onConfirm();
  }, [onConfirm, isOpened]);

  const handleCancel = useCallback(() => {
    if (onClose) {
      setPassword('');
      setInvalidPassword(false);
      setValidating(false);
      onClose();
    }
  }, [onClose]);

  const handleClickConfirm = useCallback(async () => {
    if (!isKeystoreSigningRequired) {
      return handleProceed();
    }

    if (!keystore) return;
    if (!password) return setInvalidPassword(true);

    setValidating(true);
    try {
      const phrase = await decryptFromKeystore(keystore, password);
      const isValid = multichain().getPhrase() === phrase;

      if (isValid) {
        handleProceed();
      } else {
        setInvalidPassword(true);
      }
    } catch (error) {
      setInvalidPassword(true);
    }

    setValidating(false);
  }, [keystore, password, handleProceed, isKeystoreSigningRequired]);

  const onPasswordKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.code === 'Enter' && !validating) {
        handleClickConfirm();
      }
    },
    [handleClickConfirm, validating],
  );

  return (
    <Modal isOpened={isOpened} onClose={handleCancel} title={t('common.confirm')}>
      <Box col className="gap-y-4 md:!min-w-[350px]">
        {children && <div>{children}</div>}

        {isKeystoreSigningRequired && (
          <>
            <PasswordInput
              onChange={({ target }) => setPassword(target.value)}
              onKeyDown={onPasswordKeyDown}
              value={password}
            />

            {invalidPassword && (
              <Text className="ml-2" fontWeight="medium" textStyle="caption" variant="orange">
                {t('views.walletModal.wrongPassword')}
              </Text>
            )}
          </>
        )}

        <Button
          stretch
          disabled={buttonDisabled}
          loading={validating}
          onClick={handleClickConfirm}
          size="md"
          variant="fancy"
        >
          {t('common.confirm')}
        </Button>
      </Box>
    </Modal>
  );
};
