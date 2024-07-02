import { Text } from "@chakra-ui/react";
import type { IconName } from "components/Atomic";
import { Box, Icon, Tooltip } from "components/Atomic";
import { baseTextHoverClass } from "components/constants";
import type { ReactNode } from "react";
import { memo } from "react";

type Props = {
  value: string | ReactNode;
  tooltip: string;
  icon?: IconName;
};

export const InfoWithTooltip = memo(({ value, tooltip, icon = "infoCircle" }: Props) => {
  return (
    <Box alignCenter className="gap-x-2">
      {typeof value === "string" ? (
        <Text className="text-right" fontWeight="semibold" textStyle="caption" variant="primary">
          {value}
        </Text>
      ) : (
        value
      )}

      {!!tooltip && (
        <Tooltip content={tooltip}>
          <Icon className={baseTextHoverClass} color="secondary" name={icon} size={20} />
        </Tooltip>
      )}
    </Box>
  );
});
