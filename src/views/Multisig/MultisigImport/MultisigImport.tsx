import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Button, Icon } from 'components/Atomic';
import { FieldLabel } from 'components/Form';
import { Input } from 'components/Input';
import { PanelView } from 'components/PanelView';
import { ViewHeader } from 'components/ViewHeader';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/router';
import { useFilePicker } from 'use-file-picker';
import { useMultisigImport } from 'views/Multisig/MultisigImport/hooks';

const MultisigImport = () => {
  const navigate = useNavigate();
  const {
    openFilePicker,
    filesContent: [{ content } = { content: '' }],
    loading: filesLoading,
    errors: fileErrors,
  } = useFilePicker({ accept: ['.txt', '.json'] });

  const onSuccess = useCallback(() => navigate(ROUTES.Multisig), [navigate]);
  const {
    onChangeFile,
    fileError,
    onError,
    name,
    setName,
    handleConnectWallet,
    isValid,
    walletData,
  } = useMultisigImport({ onSuccess });

  useEffect(() => {
    if (content) {
      onChangeFile(content);
    } else if (fileErrors) {
      onError(fileErrors?.[0]?.name);
    }
  }, [content, fileErrors, onChangeFile, onError]);

  return (
    <PanelView
      header={<ViewHeader withBack title={t('views.multisig.connectThorSafeWallet')} />}
      title={t('views.multisig.thorSafeWallet')}
    >
      <Box col className="self-stretch gap-8">
        <Text>{t('views.multisig.selectWalletJson')}</Text>

        <Box col className="gap-8">
          <Box col>
            <FieldLabel hasError={!!fileError} label={t('views.multisig.selectFile')} />
            <Box
              alignCenter
              className="h-10 px-3 border border-solid cursor-pointer rounded-2xl border-light-border-primary dark:border-dark-border-primary hover:border-light-typo-gray dark:hover:border-dark-typo-gray"
              onClick={openFilePicker}
            >
              {!walletData && !fileError && <Icon name="upload" size={18} />}
              {walletData && !fileError && <Icon color="green" name="valid" size={18} />}
              {fileError && <Icon color="red" name="invalid" size={18} />}
              <Text
                className={classNames('text-[11px] opacity-80 ml-2', {
                  'opacity-100': walletData && !fileError,
                })}
                fontWeight="semibold"
                textStyle="caption-xs"
              >
                {t('views.walletModal.chooseKeystore')}
              </Text>
            </Box>

            {!!fileError && (
              <Box className="my-1 mx-2">
                <Text fontWeight="normal" textStyle="caption" variant="red">
                  {fileError}
                </Text>
              </Box>
            )}
          </Box>

          <Box col>
            <FieldLabel label={t('views.multisig.thorSafeName')} />
            <Input
              stretch
              border="rounded"
              className="py-1"
              onChange={(e) => setName(e.target.value)}
              placeholder={t('views.multisig.nameExample')}
              value={name}
            />
          </Box>
        </Box>

        <Box center className="w-full pt-5">
          <Button
            stretch
            disabled={!isValid}
            error={!!fileError}
            loading={filesLoading}
            onClick={handleConnectWallet}
            size="lg"
            variant="fancy"
          >
            {t('common.connect')}
          </Button>
        </Box>
      </Box>
    </PanelView>
  );
};

export default MultisigImport;
