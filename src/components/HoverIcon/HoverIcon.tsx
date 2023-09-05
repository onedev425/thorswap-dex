import classNames from 'classnames';
import type { IconColor, IconName } from 'components/Atomic';
import { Box, Icon, Link, Tooltip } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import type { MouseEventHandler } from 'react';
import { memo } from 'react';

type Props = {
  className?: string;
  tooltip?: string;
  size?: number;
  spin?: boolean;
  iconName: IconName;
  color?: IconColor;
  onClick?: (() => void) | MouseEventHandler;
  // eslint-disable-next-line react/no-unused-prop-types -- False positive
  to?: string;
  iconHoverHighlight?: boolean;
};

export const HoverIcon = memo(({ to, ...props }: Props) => {
  if (!to) return <IconComponent {...props} />;

  return (
    <Link to={to}>
      <IconComponent {...props} />
    </Link>
  );
});

const IconComponent = memo(
  ({
    tooltip,
    className,
    iconName,
    color = 'secondary',
    size = 16,
    spin = false,
    onClick,
    iconHoverHighlight = true,
  }: Props) => (
    <Tooltip content={tooltip}>
      <Box
        className={classNames(baseHoverClass, 'group box-content')}
        style={{ width: size, height: size }}
      >
        <Icon
          className={classNames(
            {
              'group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary':
                iconHoverHighlight,
            },
            className,
          )}
          color={color}
          name={iconName}
          onClick={onClick}
          size={size}
          spin={spin}
        />
      </Box>
    </Tooltip>
  ),
);
