import { MenuItemType } from 'components/AppPopoverMenu/types';
import { Box, SwitchToggle, Typography } from 'components/Atomic';

type Props = {
  items: MenuItemType[];
};

export const SwitchMenu = ({ items }: Props) => {
  return (
    <Box col className="w-full m-2">
      {items.map((item) => (
        <Box
          alignCenter
          className="px-5 py-4 mb-2 dark:bg-btn-dark-tint rounded-2xl justify-between"
          key={item.label}
        >
          <Typography>{item.label}</Typography>
          <SwitchToggle checked={!!item.status} onChange={item.onClick as () => void} />
        </Box>
      ))}
    </Box>
  );
};
