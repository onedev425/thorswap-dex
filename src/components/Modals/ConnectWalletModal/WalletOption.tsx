import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import type { IconName } from "components/Atomic";
import { Box, Icon } from "components/Atomic";
import useWindowSize from "hooks/useWindowSize";
import { memo, useCallback } from "react";

import type { WalletType } from "./types";

type Props = {
  label: string;
  icon: IconName;
  type: WalletType;
  handleTypeSelect: (type: WalletType) => void;
  selected: boolean;
  disabled?: boolean;
  connected?: boolean;
  id?: string;
};

const WalletOption = ({
  label,
  icon,
  connected,
  handleTypeSelect,
  type,
  selected,
  disabled,
  id,
}: Props) => {
  const { isMdActive } = useWindowSize();
  const handleClick = useCallback(() => {
    if (!disabled) handleTypeSelect(type);
  }, [disabled, handleTypeSelect, type]);

  return (
    <Box
      id={id}
      alignCenter
      className={classNames(
        "cursor-pointer relative bg-light-gray-light dark:bg-dark-gray-light hover:brightness-90 dark:hover:brightness-110",
        "w-fit p-1.5 rounded-xl m-1 gap-x-1 md:h-10 md:gap-x-2 md:px-2",
        {
          "!bg-cyan !bg-opacity-20": selected,
          "opacity-40 cursor-not-allowed": disabled,
        },
      )}
      justify="between"
      onClick={handleClick}
    >
      <Box
        className={classNames(
          "opacity-0 duration-200 transition-all !bg-light-layout-primary dark:!bg-dark-bg-secondary",
          "absolute -top-2 -right-1 p-0.5 rounded-xl",
          "border border-solid border-cyan",
          { "!opacity-100": selected },
        )}
      >
        <Icon color="cyan" name="connect" size={14} />
      </Box>

      <Box
        className={classNames(
          "opacity-0 duration-200 transition-all !bg-light-layout-primary dark:!bg-dark-bg-secondary",
          "absolute -top-2 -left-1 p-0.5 rounded-xl",
          "border border-solid border-green",
          { "!opacity-100": connected },
        )}
      >
        <Icon color="green" name="connect" size={14} />
      </Box>

      <Icon name={icon} size={isMdActive ? 20 : 14} />

      <Text className="text-center !text-caption-xs md:!text-caption">{label}</Text>
    </Box>
  );
};

export default memo(WalletOption);
