import classNames from 'classnames';
import { Box, Icon, IconName, Typography } from 'components/Atomic';
import { memo, useCallback } from 'react';

import { WalletType } from './types';

type Props = {
  label: string;
  icon: IconName;
  type: WalletType;
  handleTypeSelect: (type: WalletType) => void;
  selected: boolean;
  disabled?: boolean;
  connected?: boolean;
};

const WalletOption = ({
  label,
  icon,
  connected,
  handleTypeSelect,
  type,
  selected,
  disabled,
}: Props) => {
  const handleClick = useCallback(() => {
    if (!disabled) handleTypeSelect(type);
  }, [disabled, handleTypeSelect, type]);

  return (
    <Box
      alignCenter
      className={classNames(
        'cursor-pointer relative bg-light-gray-light dark:bg-dark-gray-light hover:brightness-90 dark:hover:brightness-110',
        'w-fit h-10 rounded-xl m-1 gap-x-2 px-2',
        {
          '!bg-cyan !bg-opacity-20': selected,
          'opacity-40 cursor-not-allowed': disabled,
        },
      )}
      justify="between"
      onClick={handleClick}
    >
      <Box
        className={classNames(
          'opacity-0 duration-200 transition-all !bg-light-layout-primary dark:!bg-dark-bg-secondary',
          'absolute -top-2 -right-1 p-0.5 rounded-xl',
          'border border-solid border-cyan',
          { '!opacity-100': selected },
        )}
      >
        <Icon color="cyan" name="connect" size={14} />
      </Box>

      <Box
        className={classNames(
          'opacity-0 duration-200 transition-all !bg-light-layout-primary dark:!bg-dark-bg-secondary',
          'absolute -top-2 -left-1 p-0.5 rounded-xl',
          'border border-solid border-green',
          { '!opacity-100': connected },
        )}
      >
        <Icon color="green" name="connect" size={14} />
      </Box>

      <Icon name={icon} size={24} />

      <Typography className="text-center" variant="caption">
        {label}
      </Typography>
    </Box>
  );
};

export default memo(WalletOption);
