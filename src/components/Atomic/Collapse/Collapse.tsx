import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { Box, Card } from "components/Atomic";
import { CollapseChevron } from "components/Atomic/Collapse/CollapseChevron";
import { forwardRef, useImperativeHandle } from "react";

import type { CollapseProps } from "./types";
import { useCollapse } from "./useCollapse";

export const maxHeightTransitionClass =
  "duration-300 ease-in-out transition-max-height overflow-auto overflow-y-hidden";

export const Collapse = forwardRef<{ toggle: () => void }, CollapseProps>(
  (
    {
      children,
      className,
      contentClassName,
      titleClassName,
      shadow = true,
      title,
      defaultExpanded,
    },
    collapseRef,
  ) => {
    const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse({
      defaultExpanded,
    });

    useImperativeHandle(collapseRef, () => ({ toggle }), [toggle]);

    return (
      <Card
        className={classNames("flex flex-col h-max !p-0 !py-0", className)}
        shadow={shadow}
        size="md"
      >
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          className={classNames(
            "box-border w-full appearance-none focus:outline-none cursor-pointer px-4 py-2",
            titleClassName,
          )}
          onClick={toggle}
        >
          <Box alignCenter row justify="between">
            {typeof title === "string" ? (
              <Text fontWeight="normal" textStyle="subtitle1" variant="primary">
                {title}
              </Text>
            ) : (
              <Box flex={1}>{title}</Box>
            )}

            <Box className="w-6">
              <CollapseChevron isActive={isActive} />
            </Box>
          </Box>
        </div>

        <div className={maxHeightTransitionClass} ref={contentRef} style={maxHeightStyle}>
          <div className={classNames("px-4 pb-2", contentClassName)}>{children}</div>
        </div>
      </Card>
    );
  },
);
