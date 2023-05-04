import { SidebarWidgetOption } from 'components/Sidebar/types';
import { ThorBurn } from 'components/Sidebar/widgets/ThorBurn';

type Props = {
  type: SidebarWidgetOption;
  collapsed?: boolean;
};

export const RenderWidget = ({ type, collapsed }: Props) => {
  switch (type) {
    case SidebarWidgetOption.ThorBurn: {
      return <ThorBurn collapsed={collapsed} />;
    }

    default: {
      return null;
    }
  }
};
