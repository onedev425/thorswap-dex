import { Box, Button, Icon, Typography } from 'components/Atomic';
import { StepActions } from 'components/Stepper';
import { showErrorToast } from 'components/Toast';
import { downloadAsFile } from 'helpers/download';
import { useCallback, useMemo } from 'react';
import { t } from 'services/i18n';
import { ImportedMultisigTx, Signer } from 'services/multisig';
import { useAppSelector } from 'store/store';

const MULTISIG_FILE_NAME = 'thorsafetx';

type Props = {
  exportTxData: ImportedMultisigTx | null;
  signatures: Signer[];
};

export const ExportTxStep = ({ exportTxData, signatures }: Props) => {
  const { members } = useAppSelector((state) => state.multisig);
  const fileNameSuffix = useMemo(() => {
    if (!signatures?.length) {
      return 'unsigned';
    }

    const signerNames = signatures.map(
      (s) => members.find((m) => m.pubKey === s.pubKey)?.name || '',
    );

    if (signerNames.every(Boolean)) {
      return `signed-${signerNames.join('_')}`;
    }

    return `signed-${signatures.length}_members`;
  }, [members, signatures]);

  const handleExport = useCallback(async () => {
    if (!exportTxData) {
      showErrorToast('Missing tx data to export.');
      return;
    }

    try {
      await downloadAsFile(
        `${MULTISIG_FILE_NAME}-${fileNameSuffix}.json`,
        JSON.stringify(exportTxData),
      );
    } catch (error: ErrorType) {
      const message = error.message || t('views.multisig.exportError');
      showErrorToast(message);
    }
  }, [exportTxData, fileNameSuffix]);

  return (
    <Box col className="self-stretch mx-2" flex={1}>
      <Box col className="gap-2 mt-6">
        <Typography fontWeight="normal" variant="caption">
          {t('views.multisig.exportTxInfo')}
        </Typography>
        <Button stretch endIcon={<Icon name="export" />} onClick={handleExport}>
          {t('views.multisig.export')}
        </Button>
      </Box>

      <StepActions />
    </Box>
  );
};
