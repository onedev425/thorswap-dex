import { showErrorToast } from 'components/Toast';
import { downloadAsFile } from 'helpers/download';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { useAppSelector } from 'store/store';

const MULTISIG_FILE_NAME = 'thorsafe';

export const useMultisigExport = () => {
  const { members, treshold, address, name } = useAppSelector((state) => state.multisig);
  const fileSuffix = name || 'wallet';

  const hasWallet = !!address;

  const handleExport = useCallback(async () => {
    try {
      const walletData = { members, treshold };
      await downloadAsFile(`${MULTISIG_FILE_NAME}-${fileSuffix}.json`, JSON.stringify(walletData));
    } catch (error: NotWorth) {
      console.error(error);
      const message = error.message || t('views.multisig.exportError');
      showErrorToast(message);
    }
  }, [fileSuffix, members, treshold]);

  return { hasWallet, handleExport };
};
