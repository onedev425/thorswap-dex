import { showErrorToast } from "components/Toast";
import { downloadAsFile } from "helpers/download";
import { useCallback } from "react";
import { t } from "services/i18n";
import { logException } from "services/logger";
import { useAppSelector } from "store/store";

const MULTISIG_FILE_NAME = "thorsafe";

export const useMultisigExport = () => {
  const { members, threshold, address, name } = useAppSelector(({ multisig }) => multisig);
  const fileSuffix = name || "wallet";

  const hasWallet = !!address;

  const handleExport = useCallback(async () => {
    try {
      const walletData = { members, threshold };
      await downloadAsFile(`${MULTISIG_FILE_NAME}-${fileSuffix}.json`, JSON.stringify(walletData));
    } catch (error) {
      logException(error as Error);
      const message = (error as Todo).message || t("views.multisig.exportError");
      showErrorToast(message, undefined, undefined, error as Error);
    }
  }, [fileSuffix, members, threshold]);

  return { hasWallet, handleExport };
};
