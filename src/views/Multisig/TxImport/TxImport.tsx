import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Button, Icon } from 'components/Atomic';
import { FieldLabel } from 'components/Form';
import { HoverIcon } from 'components/HoverIcon';
import { PanelView } from 'components/PanelView';
import { ViewHeader } from 'components/ViewHeader';
import { useEffect } from 'react';
import { t } from 'services/i18n';
import { useFilePicker } from 'use-file-picker';
import { useTxImportForm } from 'views/Multisig/TxImport/hooks';

const TxImport = () => {
  const { onChangeFile, fileError, onError, isValid, importedTx, handleImportTx } =
    useTxImportForm();

  const {
    openFilePicker,
    filesContent: [{ content } = { content: '' }],
    loading: filesLoading,
    errors: fileErrors,
  } = useFilePicker({ accept: '.txt' });

  useEffect(() => {
    if (content) {
      onChangeFile(content);
    } else if (fileErrors) {
      onError(fileErrors?.[0]?.name);
    }
  }, [content, fileErrors, onChangeFile, onError]);

  return (
    <PanelView
      header={<ViewHeader withBack title={t('views.multisig.importTransaction')} />}
      title={t('views.multisig.importTransaction')}
    >
      <Box col className="self-stretch">
        <Box className="pb-8">
          <Text>{t('views.multisig.selectTxJsonFile')}</Text>
          <HoverIcon
            color="secondary"
            iconName="infoCircle"
            tooltip={t('views.multisig.thorsafeFileTooltip')}
          />
        </Box>
        <FieldLabel hasError={!!fileError} label={t('views.multisig.chooseFileToUpload')} />
        <Box
          alignCenter
          className="h-10 px-3 border border-solid cursor-pointer rounded-2xl border-light-border-primary dark:border-dark-border-primary hover:border-light-typo-gray dark:hover:border-dark-typo-gray"
          onClick={openFilePicker}
        >
          {!importedTx && !fileError && <Icon name="upload" size={18} />}
          {importedTx && !fileError && <Icon color="green" name="valid" size={18} />}
          {fileError && <Icon color="red" name="invalid" size={18} />}
          <Text
            className={classNames('text-[11px] opacity-80 ml-2', {
              'opacity-100': importedTx && !fileError,
            })}
            fontWeight="semibold"
            textStyle="caption-xs"
          >
            {t('views.walletModal.chooseKeystore')}
          </Text>
        </Box>
      </Box>

      <Box center className="w-full pt-5">
        <Button
          stretch
          disabled={!isValid}
          loading={filesLoading}
          onClick={handleImportTx}
          size="lg"
          variant="fancy"
        >
          {t('views.multisig.importTransaction')}
        </Button>
      </Box>
    </PanelView>
  );
};

export default TxImport;
