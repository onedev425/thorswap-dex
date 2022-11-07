import { IconName, TextTransform } from 'components/Atomic';
import { MouseEventHandler } from 'react';

export type SidebarVariant = 'primary' | 'secondary';

type ItemProps = {
  iconName?: IconName;
  rightIconName?: IconName;
  hasBackground?: boolean;
  beta?: boolean;
  label?: string;
} & ({ href: string; children?: undefined } | { href?: undefined; children: SidebarItemProps[] });

export type NavItemProps = ItemProps & {
  transform?: TextTransform;
  variant?: SidebarVariant;
  className?: string;
  collapsed?: boolean;
  onClick?: MouseEventHandler;
  onItemClickCb?: () => void;
};

export type SidebarItemProps = ItemProps & {
  children?: SidebarItemProps[];
  label?: string;
  navLabel?: string;
  transform?: TextTransform;
};

export type SidebarProps = {
  className?: string;
  collapsed?: boolean;
  toggle?: () => void;
  onNavItemClick?: () => void;
};

export const itemClasses = {
  primary: 'hover:bg-btn-primary-translucent hover:dark:bg-btn-primary-translucent !mx-1',
  secondary: 'hover:bg-btn-secondary-translucent hover:dark:bg-btn-secondary-translucent',
};

export const iconClasses = {
  primary: 'text-light-gray-primary dark:text-dark-gray-primary',
  secondary: 'text-light-green-light dark:text-dark-green-light',
};
