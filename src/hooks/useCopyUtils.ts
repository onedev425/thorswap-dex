import { showSuccessToast } from "components/Toast";
import copy from "copy-to-clipboard";
import { useCallback } from "react";
import { t } from "services/i18n";

export const useCopyUtils = (value: string) => {
  const handleCopyValue = useCallback(() => {
    copy(value);
    showSuccessToast(t("common.copied"));
  }, [value]);

  return {
    handleCopyValue,
  };
};
