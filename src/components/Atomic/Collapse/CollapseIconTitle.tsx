import { Text } from "@chakra-ui/react";
import { Icon } from "components/Atomic";

import type { CollapseTitleProps } from "./types";

export const CollapseIconTitle = ({ iconName, title, subTitle }: CollapseTitleProps) => {
  return (
    <div className="flex flex-row gap-x-2 items-center">
      <Icon color="secondary" name={iconName} />
      <Text fontWeight="normal" textStyle="subtitle1" variant="primary">
        {title}
      </Text>
      <Text fontWeight="normal" textStyle="subtitle1" variant="secondary">
        {`(${subTitle})`}
      </Text>
    </div>
  );
};
