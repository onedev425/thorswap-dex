import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import type { IconName } from "components/Atomic";
import { Box, Icon } from "components/Atomic";
import useWindowSize from "hooks/useWindowSize";
import { memo, useCallback } from "react";

import type { WalletCategory } from "components/Modals/ConnectWalletModal/hooks";

type Props = {
  label: string;
  icon: IconName;
  category: WalletCategory;
  handleCategorySelect: (type: WalletCategory) => void;
  disabled?: boolean;
  id?: string;
};

const WalletCategorySelector = ({
  label,
  icon,
  category,
  handleCategorySelect,
  disabled,
  id,
}: Props) => {
  const { isMdActive } = useWindowSize();

  const handleClick = useCallback(() => {
    if (!disabled) handleCategorySelect(category);
  }, [disabled, handleCategorySelect, category]);

  return (
    <Box
      id={id}
      row
      alignCenter
      onClick={handleClick}
      key={category}
      className={classNames(
        "cursor-pointer bg-light-gray-light dark:bg-dark-gray-light hover:brightness-90 dark:hover:brightness-110",
        "w-[100%] px-4 md:px-6 py-4 rounded-xl my-2",
        {
          "opacity-40 cursor-not-allowed": disabled,
        },
      )}
    >
      <Text flex={1} fontWeight="semibold" textStyle={isMdActive ? "subtitle2" : "body"}>
        {label}
      </Text>
      <Icon className="p-2.5 rounded-2xl transform " name={icon} />
    </Box>
  );
};

export default memo(WalletCategorySelector);
