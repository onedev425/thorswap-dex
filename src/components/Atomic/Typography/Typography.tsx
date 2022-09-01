import classNames from 'classnames';

import {
  colorClasses,
  defaultWeightClasses,
  Props,
  transformClasses,
  variantClasses,
  weightClasses,
} from './types';

export const Typography = ({
  component: Component = 'div',
  className = '',
  color = 'primary',
  variant = 'body',
  transform = 'none',
  fontWeight,
  children,
  ...rest
}: Props) => {
  return (
    <Component
      className={classNames(
        colorClasses[color],
        variantClasses[variant],
        transformClasses[transform],
        fontWeight ? weightClasses[fontWeight] : defaultWeightClasses[variant],
        className,
        'font-primary',
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
