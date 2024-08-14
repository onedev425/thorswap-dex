import { Text } from "@chakra-ui/react";
import { Box, Icon, Tooltip } from "components/Atomic";
import type { RouteWithApproveType } from "components/SwapRouter/types";
import { formatDuration } from "components/TransactionTracker/helpers";
import { useMemo } from "react";
import { t } from "services/i18n";
import { useSwapTimeEstimate } from "views/Swap/hooks/useSwapTimeEstimate";

type Props = {
  timeEstimates: RouteWithApproveType["timeEstimates"] | undefined;
  streamSwap: boolean;
};

export const RouteTimeEstimate = ({ timeEstimates, streamSwap }: Props) => {
  const estimatedTime = useSwapTimeEstimate({
    timeEstimates,
    streamSwap,
  });

  const durationLength = useMemo(() => {
    if (estimatedTime) {
      if (estimatedTime > 54_000_000) {
        return "red";
      }
      if (estimatedTime > 28_800_000) {
        return "orange";
      }
    }
    return ""; // Replace with your default color
  }, [estimatedTime]);

  return (
    <div>
      <Box className="gap-1 items-center">
        <Text textStyle="caption" color={durationLength}>
          {estimatedTime ? formatDuration(estimatedTime) : "n/a"}
        </Text>
        <Tooltip content={t("txManager.estimatedTxDuration")}>
          <Icon name="timer" size={14} />
        </Tooltip>
      </Box>
    </div>
  );
};
