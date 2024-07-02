import type { MenuItemType } from "components/AppPopoverMenu/types";
import { Box } from "components/Atomic";

import { MenuItem } from "./MenuItem";

type Props = {
  items: MenuItemType[];
};

export const Submenu = ({ items }: Props) => {
  return (
    <Box col className="mt-4" flex={1}>
      {items.map((item) => (
        <MenuItem key={item.label} {...item} />
      ))}
    </Box>
  );
};
