import { Keystore } from '@thorswap-lib/types';
import { decryptFromKeystore } from '@thorswap-lib/xchain-crypto';
import classNames from 'classnames';
import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic';
import { Input } from 'components/Input';
import { ChangeEvent, useCallback, useState } from 'react';
import { FilePicker } from 'react-file-picker';
import { t } from 'services/i18n';

type Props = {
  loading?: boolean;
  onConnect: (keystore: Keystore, phrase: string) => void;
  onCreate: () => void;
};

export const ConnectKeystoreView = ({ loading, onConnect, onCreate }: Props) => {
  const [keystore, setKeystore] = useState<Keystore>();
  const [password, setPassword] = useState<string>('');
  const [invalidStatus, setInvalidStatus] = useState(false);
  const [keystoreError, setKeystoreError] = useState('');
  const [processing, setProcessing] = useState(false);

  const onChangeFile = useCallback((file: Blob) => {
    const reader = new FileReader();
    const onLoadHandler = () => {
      try {
        const key = JSON.parse(reader.result as string);
        if (!('version' in key) || !('crypto' in key)) {
          setKeystoreError(t('views.walletModal.keystoreError'));
        } else {
          setKeystoreError('');
          setKeystore(key);
        }
      } catch {
        setKeystoreError(t('views.walletModal.jsonError'));
      }
    };
    reader.addEventListener('load', onLoadHandler);
    reader.readAsText(file);
    return () => {
      reader.removeEventListener('load', onLoadHandler);
    };
  }, []);

  const onErrorFile = useCallback((error: Error) => {
    setKeystoreError(`${t('views.walletModal.selectingKeyError')} ${error}`);
  }, []);

  const unlockKeystore = useCallback(async () => {
    if (keystore) {
      setProcessing(true);

      try {
        const phrase = await decryptFromKeystore(keystore, password);

        // clean up
        setPassword('');
        setKeystore(undefined);
        setProcessing(false);
        onConnect(keystore, phrase);
      } catch (error) {
        setProcessing(false);

        setInvalidStatus(true);
        console.error(error);
      }
    }
  }, [keystore, password, onConnect]);

  const onPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setInvalidStatus(false);
  }, []);

  const ready = password.length > 0 && !keystoreError && !processing;

  const handleKeypress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') {
        unlockKeystore();
      }
    },
    [unlockKeystore],
  );
  return (
    <Box col className="w-full">
      <Typography className="mb-2" fontWeight="semibold" variant="subtitle2">
        {t('views.walletModal.selectKeystore')}
      </Typography>
      <FilePicker onChange={onChangeFile} onError={onErrorFile}>
        <Box
          alignCenter
          className="h-10 px-3 border border-solid cursor-pointer rounded-2xl border-light-border-primary dark:border-dark-border-primary hover:border-light-typo-gray dark:hover:border-dark-typo-gray"
        >
          {!keystore && !keystoreError && <Icon name="upload" size={18} />}
          {keystore && !keystoreError && <Icon color="green" name="valid" size={18} />}
          {keystoreError && <Icon color="red" name="invalid" size={18} />}
          <Typography
            className={classNames('!text-[11px] opacity-80 ml-2', {
              'opacity-100': keystore && !keystoreError,
            })}
            fontWeight="semibold"
            variant="caption-xs"
          >
            {t('views.walletModal.chooseKeystore')}
          </Typography>
        </Box>
      </FilePicker>

      <Typography className="mt-2 ml-3" color="red" fontWeight="normal" variant="caption">
        {keystoreError ? t('views.walletModal.invalidKeystore') : ''}
      </Typography>

      <Box row className="space-x-2 mt-6 mb-2">
        <Typography variant="subtitle2">{t('views.walletModal.keystorePassword')}</Typography>
        <Tooltip
          content={t('views.walletModal.recoveryPassword')}
          iconName="question"
          place="top"
        />
      </Box>
      <Box className="flex-1 w-full">
        <Input
          stretch
          border="rounded"
          name="password"
          onChange={onPasswordChange}
          onKeyDown={handleKeypress}
          placeholder="Password"
          type="password"
          value={password}
        />
      </Box>
      {invalidStatus && (
        <Typography className="mt-2 ml-3" color="orange" variant="caption">
          {t('views.walletModal.wrongPassword')}
        </Typography>
      )}

      <Box className="gap-x-4 mt-6">
        <Button
          className="flex-1 group"
          disabled={!ready}
          endIcon={<Icon className="transition group-hover:text-white" name="unlock" size={18} />}
          loading={processing || loading}
          onClick={unlockKeystore}
          size="sm"
        >
          {t('views.walletModal.unlock')}
        </Button>
        <Button
          className="flex-1 group"
          endIcon={<Icon name="wallet" size={18} />}
          onClick={onCreate}
          size="sm"
          type="outline"
          variant="tint"
        >
          {t('views.walletModal.createWallet')}
        </Button>
      </Box>
    </Box>
  );
};
