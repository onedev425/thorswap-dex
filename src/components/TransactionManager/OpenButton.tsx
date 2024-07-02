import { Button, Icon, Tooltip } from "components/Atomic";
import useWindowSize from "hooks/useWindowSize";
import { memo } from "react";
import { t } from "services/i18n";

type Props = {
  pendingCount: number;
  hasHistory: boolean;
};

const getTooltipContent = (hasHistory: boolean, pendingCount: number) =>
  pendingCount > 0
    ? `${t("common.pendingTransactions")}:${"\u00A0\u00A0"}${pendingCount}`
    : hasHistory
      ? t("txManager.transactionHistory")
      : t("common.noTxHistory");

export const OpenButton = memo(({ pendingCount, hasHistory }: Props) => {
  const { isMdActive } = useWindowSize();

  return (
    <Tooltip content={getTooltipContent(hasHistory, pendingCount)}>
      <Button
        className="!px-2"
        disabled={!hasHistory}
        leftIcon={
          pendingCount ? (
            <Icon spin name="loader" />
          ) : (
            <Icon name="history" size={isMdActive ? 24 : 20} />
          )
        }
        variant="borderlessTint"
      />
    </Tooltip>
  );
});
