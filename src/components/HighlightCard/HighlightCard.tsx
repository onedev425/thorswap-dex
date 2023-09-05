import classNames from 'classnames';
import { Box } from 'components/Atomic';
import { borderHoverHighlightClass } from 'components/constants';
import type { CardStyleType } from 'components/HighlightCard/types';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
  isFocused?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  disabled?: boolean;
  type?: CardStyleType;
  withBackground?: boolean;
};

const borderClasses: Record<CardStyleType, string> = {
  primary: '',
  warn: 'border-yellow hover:!border-yellow border-opacity-50 hover:border-opacity-100 !bg-yellow !bg-opacity-10',
  info: 'border-btn-primary hover:!border-btn-primary border-opacity-50 hover:border-opacity-100 !bg-btn-primary !bg-opacity-10',
  success:
    'border-green hover:!border-green border-opacity-50 hover:border-opacity-100 !bg-green !bg-opacity-10',
};

export const HighlightCard = ({
  className,
  disabled,
  children,
  isFocused,
  type = 'primary',
  onClick,
  withBackground = true,
}: Props) => {
  return (
    <Box
      col
      className={classNames(
        'rounded-2xl md:rounded-3xl md:px-6 pb-3 md:py-4 md:gap-2 border border-solid border-transparent transition',
        {
          'bg-light-bg-primary dark:bg-dark-gray-light': withBackground,
          '!border-light-border-primary dark:!border-dark-gray-primary': isFocused,
          [borderHoverHighlightClass]: !disabled,
        },
        borderClasses[type],
        className,
      )}
      justify="between"
      onClick={onClick}
    >
      {children}
    </Box>
  );
};
