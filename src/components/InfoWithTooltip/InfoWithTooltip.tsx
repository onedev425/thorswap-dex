import { Text } from '@chakra-ui/react';
import { Box, Icon, IconName, Tooltip } from 'components/Atomic';
import { baseTextHoverClass } from 'components/constants';
import { memo, ReactNode } from 'react';

type Props = {
  value: string | ReactNode;
  tooltip: string;
  icon?: IconName;
};

export const InfoWithTooltip = memo(({ value, tooltip, icon = 'infoCircle' }: Props) => {
  return (
    <Box alignCenter className="gap-x-2">
      {typeof value === 'string' ? (
        <Text className="text-right" fontWeight="semibold" textStyle="caption" variant="primary">
          {value}
        </Text>
      ) : (
        value
      )}

      {!!tooltip && (
        <Tooltip content={tooltip}>
          <Icon className={baseTextHoverClass} color="secondary" name={icon} size={20} />
        </Tooltip>
      )}
    </Box>
  );
});
