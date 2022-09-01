import { Icon, Typography } from 'components/Atomic';

import { CollapseTitleProps } from './types';

export const CollapseIconTitle = ({ iconName, title, subTitle }: CollapseTitleProps) => {
  return (
    <div className="flex flex-row gap-x-2 items-center">
      <Icon color="secondary" name={iconName} />
      <Typography color="primary" fontWeight="normal" variant="subtitle1">
        {title}
      </Typography>
      <Typography color="secondary" fontWeight="normal" variant="subtitle1">
        {`(${subTitle})`}
      </Typography>
    </div>
  );
};
