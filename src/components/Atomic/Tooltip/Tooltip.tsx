import { Tooltip as CustomizeTooltip } from '@chakra-ui/react';
import classNames from 'classnames';
import { Icon, IconName, Typography } from 'components/Atomic';
import { TooltipPlacement } from 'components/Atomic/Tooltip/types';
import useWindowSize from 'hooks/useWindowSize';
import { ReactNode } from 'react';

type Props = {
  place?: TooltipPlacement;
  content?: string;
  className?: string;
  disabled?: boolean;
} & ({ iconName: IconName; children?: undefined } | { children: ReactNode; iconName?: undefined });

const TOOLTIP_ICON = 14;

export const Tooltip = ({
  children,
  className,
  place = 'top',
  iconName,
  content,
  disabled = false,
}: Props) => {
  const { isMdActive } = useWindowSize();

  return content ? (
    <CustomizeTooltip
      hasArrow
      arrowSize={11}
      backgroundColor="#222326"
      borderRadius={24}
      className={classNames(
        'flex items-center justify-center m-0.5',
        {
          'border border-solid bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary rounded-3xl w-6 h-6':
            !children,
        },
        className,
      )}
      isDisabled={disabled || !isMdActive}
      label={
        <div
          className={classNames(
            'hidden w-full h-full sm:block px-5 py-2 rounded-2xl max-w-[260px]',
            'bg-light-bg-primary border border-light-border-primary border-solid dark:bg-dark-bg-primary dark:border-dark-border-primary',
          )}
        >
          <Typography className="font-bold" variant="caption-xs">
            {content}
          </Typography>
        </div>
      }
      p={0}
      placement={place}
    >
      <div>
        {children || <Icon color="secondary" name={iconName as IconName} size={TOOLTIP_ICON} />}
      </div>
    </CustomizeTooltip>
  ) : (
    <>{children}</>
  );
};
