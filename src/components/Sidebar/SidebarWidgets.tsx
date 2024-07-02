import { Box } from "@chakra-ui/react";
import type { SidebarWidgetOption } from "components/Sidebar/types";
import { RenderWidget } from "components/Sidebar/widgets/RenderWidget";

type Props = {
  widgets?: SidebarWidgetOption[];
  collapsed?: boolean;
};

export const SidebarWidgets = ({ widgets, collapsed }: Props) => {
  if (!widgets?.length) return null;

  return (
    <Box py={2}>
      {widgets.map((widget) => (
        <RenderWidget collapsed={collapsed} key={widget} type={widget} />
      ))}
    </Box>
  );
};
