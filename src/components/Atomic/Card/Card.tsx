import classNames from 'classnames';
import { baseBorderClass } from 'components/constants';

import type { CardProps, CardSize } from './types';

const sizeVariants: Record<CardSize, string> = {
  sm: 'p-2 rounded-2xl',
  md: 'p-4 rounded-3xl',
  lg: 'p-8 md:p-10 rounded-3xl',
};

export const Card = ({
  className,
  size = 'md',
  stretch = false,
  children,
  shadow = true,
  onClick,
  withBorder,
}: CardProps) => {
  return (
    <div
      className={classNames(
        'bg-light-bg-secondary dark:bg-dark-bg-secondary transition-colors',
        { 'drop-shadow-box box-border': shadow },
        { [baseBorderClass]: withBorder },
        stretch ? 'flex flex-1' : 'inline-flex',
        sizeVariants[size],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
