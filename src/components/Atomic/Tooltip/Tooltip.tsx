import { Text, Tooltip as CustomizeTooltip } from '@chakra-ui/react';
import classNames from 'classnames';
import { Icon, IconName } from 'components/Atomic';
import { TooltipPlacement } from 'components/Atomic/Tooltip/types';
import useWindowSize from 'hooks/useWindowSize';
import { PropsWithChildren } from 'react';

type Props = {
  place?: TooltipPlacement;
  content?: string;
  className?: string;
  disabled?: boolean;
  isOpen?: boolean;
  stretch?: boolean;
  onClick?: () => void;
} & ({ iconName: IconName; children?: undefined } | PropsWithChildren<{ iconName?: undefined }>);

const TOOLTIP_ICON = 14;

export const Tooltip = ({
  children,
  className,
  place = 'top',
  iconName,
  content,
  disabled = false,
  isOpen,
  stretch,
  onClick,
}: Props) => {
  const { isMdActive } = useWindowSize();

  if (!content) return (children as JSX.Element) || null;

  return (
    <CustomizeTooltip
      hasArrow
      arrowSize={11}
      backgroundColor="#222326"
      borderRadius={24}
      className={classNames(
        'flex items-center justify-center m-0.5',
        {
          'border border-solid bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-primary dark:border-dark-border-primary rounded-3xl':
            !children,
        },
        className,
      )}
      isDisabled={disabled || !isMdActive}
      isOpen={isOpen}
      label={
        <div
          className={classNames(
            'hidden w-full h-full sm:block px-5 py-2 rounded-2xl max-w-[260px]',
            'bg-light-bg-primary border border-light-border-primary border-solid dark:bg-dark-bg-primary dark:border-dark-border-primary',
          )}
        >
          <Text
            className="font-bold"
            textStyle="caption-xs"
            variant="primary"
            whiteSpace="pre-line"
          >
            {content}
          </Text>
        </div>
      }
      p={0}
      placement={place}
    >
      <div
        className={classNames({ 'cursor-pointer': onClick, 'w-full': stretch })}
        onClick={() => onClick?.()}
      >
        {children || <Icon color="secondary" name={iconName as IconName} size={TOOLTIP_ICON} />}
      </div>
    </CustomizeTooltip>
  );
};
