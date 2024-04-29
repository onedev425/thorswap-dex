import classNames from 'classnames';
import type { MouseEventHandler } from 'react';

import IconList from './iconList';

export type IconName = keyof typeof IconList;
export type IconColor = keyof typeof colorClasses;

export const colorClasses = {
  primary: 'text-light-typo-primary dark:text-dark-typo-primary',
  light: 'text-dark-typo-primary',
  secondary: 'text-light-typo-gray dark:text-dark-typo-gray',
  tertiary: 'text-light-typo-primary dark:text-dark-typo-gray',
  purple: 'text-purple',
  yellow: 'text-yellow',
  pink: 'text-pink',
  blue: 'text-blue',
  blueLight: 'text-blue-light',
  greenLight: 'text-green-light',
  green: 'text-green',
  orange: 'text-orange',
  cyan: 'text-cyan',
  gray: 'text-gray',
  red: 'text-red',
  white: 'text-white',
  primaryBtn: 'text-btn-primary dark:text-btn-primary',
  secondaryBtn: 'text-btn-secondary dark:text-btn-secondary',
  'brand.yellow': 'brand.yellow',
} as const;

export type IconProps = {
  className?: string;
  color?: keyof typeof colorClasses;
  spin?: boolean;
  name: IconName;
  size?: number;
  style?: React.CSSProperties;
  onClick?: (() => void) | MouseEventHandler;
};

export const Icon = ({
  className,
  color,
  spin = false,
  name,
  size = 24,
  style,
  onClick,
}: IconProps) => {
  const IconComp = IconList[name] || IconList.question;

  return (
    <IconComp
      className={classNames(
        'transition-all box-content',
        spin ? 'animate-spin' : 'animate-none',
        onClick ? 'cursor-pointer' : '',
        color ? colorClasses[color] : '',
        className,
      )}
      onClick={onClick}
      size={size}
      style={{ ...style, width: size, height: size }}
    />
  );
};
