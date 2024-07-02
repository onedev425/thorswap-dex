import classNames from "classnames";
import { Box } from "components/Atomic/Box/Box";
import { memo } from "react";

type Props = {
  type?: "solid" | "dashed";
  className?: string;
  dividerClassName?: string;
  color?: "primary" | "secondary";
};

export const Divider = memo(
  ({ color = "primary", type = "solid", className, dividerClassName }: Props) => (
    <Box className={className}>
      <div
        className={classNames(
          "flex-grow h-0 border-t-0 border-x-0 border-b-1 ",
          type === "solid" ? "border-solid" : "border-dashed",
          color === "primary"
            ? "border-light-typo-gray dark:border-dark-typo-gray"
            : "border-light-gray-light dark:border-dark-border-primary",
          dividerClassName,
        )}
      />
    </Box>
  ),
);
