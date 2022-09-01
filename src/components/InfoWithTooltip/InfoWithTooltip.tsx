import { Box, Icon, Tooltip, Typography } from 'components/Atomic';
import { baseTextHoverClass } from 'components/constants';
import { memo, ReactNode } from 'react';

type Props = {
  value: string | ReactNode;
  tooltip: string;
};

export const InfoWithTooltip = memo(({ value, tooltip }: Props) => {
  return (
    <Box alignCenter className="gap-x-2">
      {typeof value === 'string' ? (
        <Typography className="text-right" color="primary" fontWeight="semibold" variant="caption">
          {value}
        </Typography>
      ) : (
        value
      )}

      <Tooltip content={tooltip}>
        <Icon className={baseTextHoverClass} color="secondary" name="infoCircle" size={20} />
      </Tooltip>
    </Box>
  );
});
