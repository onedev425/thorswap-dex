import { Text } from '@chakra-ui/react';
import { MenuItemType } from 'components/AppPopoverMenu/types';
import { Box, Icon } from 'components/Atomic';

type Props = {
  items: MenuItemType[];
};

export const MainMenu = ({ items }: Props) => {
  return (
    <Box className="grid grid-cols-2 gap-1 mt-3">
      {items.map((item) => (
        <Box
          col
          className="p-4 cursor-pointer rounded-2xl bg-light-bg-primary dark:bg-dark-gray-light hover:brightness-95 dark:hover:brightness-125 transition-colors"
          key={item.label}
          onClick={item.onClick}
        >
          <Box row justify="between">
            {item.icon && !item.iconComponent && <Icon name={item.icon} />}
            {!!item.iconComponent && item.iconComponent}
            <Icon name="chevronRight" />
          </Box>

          <Text className="mt-4">{item.label}</Text>
          <Text textStyle="caption-xs" variant="secondary">
            {item.desc}
          </Text>
        </Box>
      ))}
    </Box>
  );
};
