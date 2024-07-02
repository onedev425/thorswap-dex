import type { IconColor, IconName } from "components/Atomic";
import { Icon } from "components/Atomic";
import { memo, useMemo } from "react";
import type { TransactionStatus } from "store/transactions/types";

type Props = {
  size?: number;
  status?: TransactionStatus;
};

export const TransactionStatusIcon = memo(({ status, size = 24 }: Props) => {
  const [iconName, color] = useMemo((): [IconName, IconColor] => {
    switch (status) {
      case "pending":
        return ["loader", "primaryBtn"];
      case "error":
        return ["xCircle", "pink"];
      case "refund":
        return ["revert", "yellow"];
      case "unknown":
        return ["question", "secondary"];
      case "notStarted":
        return ["hourglass", "secondary"];
      default:
        return ["checkmark", "secondaryBtn"];
    }
  }, [status]);

  return <Icon color={color} name={iconName} size={size} spin={iconName === "loader"} />;
});
