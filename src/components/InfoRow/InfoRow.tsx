import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { Box } from "components/Atomic";
import type { InfoRowProps } from "components/InfoRow/types";

const labelVariant = {
  sm: "caption-xs",
  md: "caption",
  lg: "body",
} as const;
const valueVariant = { sm: "caption-xs", md: "caption", lg: "body" } as const;
const heightVariant = {
  sm: "min-h-[30px]",
  md: "min-h-[43px]",
  lg: "min-h-[52px]",
} as const;

export const InfoRow = ({
  label,
  value,
  className,
  onClick,
  size = "md",
  showBorder = true,
  capitalizeLabel = false,
}: InfoRowProps) => {
  const borderClasses =
    "border-0 border-b border-solid border-bottom border-light-typo-gray dark:border-dark-typo-gray !border-opacity-20";

  return (
    <Box
      alignCenter
      className={classNames(
        "gap-4",
        { [borderClasses]: showBorder },
        heightVariant[size],
        className,
      )}
      justify="between"
      onClick={onClick}
    >
      {typeof label === "string" ? (
        <Text
          fontWeight="medium"
          textStyle={labelVariant[size]}
          textTransform={capitalizeLabel ? "capitalize" : "none"}
          variant="secondary"
        >
          {label}
        </Text>
      ) : (
        label
      )}

      {typeof value === "string" || typeof value === "number" ? (
        <Text className="text-right" fontWeight="semibold" textStyle={valueVariant[size]}>
          {value}
        </Text>
      ) : (
        value
      )}
    </Box>
  );
};
