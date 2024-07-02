import type { InfoRowConfig } from "components/InfoRow/types";
import { InfoWithTooltip } from "components/InfoWithTooltip";
import { useMemo } from "react";
import { t } from "services/i18n";

type Params = {
  assetName: string;
  assetValue: string;
  fee?: string;
};

export const useApproveInfoItems = ({ assetValue, assetName, fee = "N/A" }: Params) => {
  const confirmInfoItems: InfoRowConfig[] = useMemo(
    () => [
      {
        label: t("views.liquidity.approve"),
        value: `${assetValue} ${assetName.toUpperCase()}`,
      },
      {
        label: t("common.transactionFee"),
        value: <InfoWithTooltip tooltip={t("common.transactionFee")} value={fee} />,
      },
    ],
    [fee, assetName, assetValue],
  );

  return confirmInfoItems;
};
