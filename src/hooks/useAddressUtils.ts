import { showSuccessToast } from "components/Toast";
import copy from "copy-to-clipboard";
import { shortenAddress } from "helpers/shortenAddress";
import { useCallback, useMemo } from "react";
import { t } from "services/i18n";

export const useAddressUtils = (address: string) => {
  const miniAddress = useMemo(() => shortenAddress(address || ""), [address]);
  const shortAddress = useMemo(() => shortenAddress(address || "", 7, 4), [address]);

  const handleCopyAddress = useCallback(() => {
    copy(address);
    showSuccessToast(t("common.addressCopied"));
  }, [address]);

  return {
    miniAddress,
    shortAddress,
    handleCopyAddress,
  };
};
