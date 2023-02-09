import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { MenuItemType } from 'components/AppPopoverMenu/types';
import { Box, SwitchToggle } from 'components/Atomic';

type Props = {
  items: MenuItemType[];
  className?: string;
};

export const SwitchMenu = ({ items, className }: Props) => {
  return (
    <Box col className={classNames('w-full m-2', className)}>
      {items.map((item, index) => (
        <Box
          alignCenter
          className={classNames('px-5 py-4 dark:bg-btn-dark-tint rounded-2xl justify-between', {
            'mb-2': index !== items.length - 1,
          })}
          key={item.label}
        >
          <Text>{item.label}</Text>
          <SwitchToggle checked={!!item.status} onChange={item.onClick as () => void} />
        </Box>
      ))}
    </Box>
  );
};
