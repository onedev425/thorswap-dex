import { Text } from '@chakra-ui/react';
import type { Keystore } from '@swapkit/wallet-keystore';
import classNames from 'classnames';
import { Box, Button, Icon, Tooltip } from 'components/Atomic';
import { Input } from 'components/Input';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { t } from 'services/i18n';
import { logException } from 'services/logger';
import { useFilePicker } from 'use-file-picker';

type Props = {
  loading?: boolean;
  onConnect: (keystore: Keystore, phrase: string) => Promise<void>;
  onCreate: () => void;
};

export const ConnectKeystoreView = ({ loading, onConnect, onCreate }: Props) => {
  const {
    openFilePicker,
    filesContent: [{ content } = { content: '' }],
    loading: filesLoading,
  } = useFilePicker({ accept: ['.txt', '.json'] });
  const [keystore, setKeystore] = useState<Keystore>();
  const [password, setPassword] = useState<string>('');
  const [invalidStatus, setInvalidStatus] = useState(false);
  const [keystoreError, setKeystoreError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (content) {
      const key = JSON.parse(content as string);
      if (!('version' in key) || !('crypto' in key)) {
        setKeystoreError(t('views.walletModal.keystoreError'));
      } else {
        setKeystoreError('');
        setKeystore(key);
      }
    }
  }, [content]);

  const unlockKeystore = useCallback(async () => {
    if (keystore) {
      setProcessing(true);
      const { decryptFromKeystore } = await import('@swapkit/wallet-keystore');

      try {
        const phrase = await decryptFromKeystore(keystore, password);

        await onConnect(keystore, phrase);
        setPassword('');
        setKeystore(undefined);
        setProcessing(false);
      } catch (error: Todo) {
        console.error(error);
        setProcessing(false);

        setInvalidStatus(true);
        logException(error.toString());
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
      <Text className="mb-2" fontWeight="semibold" textStyle="subtitle2">
        {t('views.walletModal.selectKeystore')}
      </Text>
      <Box
        alignCenter
        className="h-10 px-3 border border-solid cursor-pointer rounded-2xl border-light-border-primary dark:border-dark-border-primary hover:border-light-typo-gray dark:hover:border-dark-typo-gray"
        onClick={openFilePicker}
      >
        {!keystore && !keystoreError && <Icon name="upload" size={18} />}
        {keystore && !keystoreError && <Icon color="green" name="valid" size={18} />}
        {keystoreError && <Icon color="red" name="invalid" size={18} />}
        <Text
          className={classNames('!text-[11px] opacity-80 ml-2', {
            'opacity-100': keystore && !keystoreError,
          })}
          fontWeight="semibold"
          textStyle="caption-xs"
        >
          {t('views.walletModal.chooseKeystore')}
        </Text>
      </Box>

      <Text className="mt-2 ml-3" fontWeight="normal" textStyle="caption" variant="red">
        {keystoreError ? t('views.walletModal.invalidKeystore') : ''}
      </Text>

      <Box row className="space-x-2 mt-6 mb-2">
        <Text textStyle="subtitle2">{t('views.walletModal.keystorePassword')}</Text>
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
        <Text className="mt-2 ml-3" textStyle="caption" variant="orange">
          {t('views.walletModal.wrongPassword')}
        </Text>
      )}

      <Box className="gap-x-4 mt-6">
        <Button
          className="flex-1 group"
          disabled={!ready}
          loading={processing || filesLoading || loading}
          onClick={unlockKeystore}
          rightIcon={<Icon className="transition group-hover:text-white" name="unlock" size={18} />}
          size="sm"
        >
          {t('views.walletModal.unlock')}
        </Button>
        <Button
          className="flex-1 group"
          onClick={onCreate}
          rightIcon={<Icon name="wallet" size={18} />}
          size="sm"
          variant="outlineTint"
        >
          {t('views.walletModal.createWallet')}
        </Button>
      </Box>
    </Box>
  );
};
