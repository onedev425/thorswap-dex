import { Text } from '@chakra-ui/react';
import type { AssetEntity } from '@thorswap-lib/swapkit-core';
import classNames from 'classnames';
import { Box, Button, Modal } from 'components/Atomic';
import { PasswordInput } from 'components/PasswordInput';
import { isKeystoreSignRequired } from 'helpers/wallet';
import type { KeyboardEventHandler, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { IS_LEDGER_LIVE } from 'settings/config';
import { useWallet } from 'store/wallet/hooks';

type Props = {
  inputAssets: AssetEntity[];
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
  const { keystore, phrase, wallet } = useWallet();
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
    const { decryptFromKeystore } = await import('@thorswap-lib/keystore');
    if (!isKeystoreSigningRequired) {
      return handleProceed();
    }

    if (!keystore) return;
    if (!password) return setInvalidPassword(true);

    setValidating(true);

    try {
      const decodedPhrase = await decryptFromKeystore(keystore, password);

      if (decodedPhrase === phrase) {
        handleProceed();
      } else {
        setInvalidPassword(true);
      }
    } catch (error) {
      setInvalidPassword(true);
    }

    setValidating(false);
  }, [isKeystoreSigningRequired, keystore, password, handleProceed, phrase]);

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
      <Box
        col
        className={classNames('gap-y-4 md:min-w-[350px]', { 'min-w-[350px]': IS_LEDGER_LIVE })}
      >
        {children && <div>{children}</div>}

        {isKeystoreSigningRequired && (
          <Box py={2}>
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
          </Box>
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
