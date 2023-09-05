import type { SystemStyleObject } from '@chakra-ui/react';
import type { IconName, TextTransform } from 'components/Atomic';
import type { MouseEventHandler } from 'react';

export type SidebarVariant = 'primary' | 'secondary';

export enum SidebarWidgetOption {
  ThorBurn = 'thorBurn',
}

type ItemProps = {
  iconName?: IconName;
  rightIconName?: IconName;
  hasBackground?: boolean;
  beta?: boolean;
  label?: string;
  widgets?: [SidebarWidgetOption];
} & ({ href: string; children?: undefined } | { href?: undefined; children: SidebarItemProps[] });

export type NavItemProps = ItemProps & {
  transform?: TextTransform;
  variant?: SidebarVariant;
  sx?: SystemStyleObject;
  collapsed?: boolean;
  onClick?: MouseEventHandler;
  onItemClickCb?: () => void;
};

type SideBarItem = ItemProps & {
  label?: string;
  navLabel?: string;
  transform?: TextTransform;
};

export type SidebarItemProps = SideBarItem & { children?: SideBarItem[] };

export type SidebarProps = {
  sx?: SystemStyleObject;
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
