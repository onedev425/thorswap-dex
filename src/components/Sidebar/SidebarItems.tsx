import classNames from 'classnames';
import { Typography } from 'components/Atomic';
import { NavItem } from 'components/Sidebar/NavItem';
import { SidebarItemProps, SidebarVariant } from 'components/Sidebar/types';
import { Fragment, memo, useCallback } from 'react';

type Props = {
  options: SidebarItemProps[];
  variant: SidebarVariant;
  collapsed: boolean;
  hasBackground?: boolean;
  onItemClick?: () => void;
};

export const SidebarItems = memo(
  ({ collapsed = false, hasBackground = false, onItemClick, options, variant }: Props) => {
    const collapseClass = collapsed ? 'scale-0 max-h-0' : 'scale-1 max-h-[20px]';

    const renderSidebarItem = useCallback(
      ({
        label,
        navLabel,
        children,
        hasBackground: background,
        href,
        ...rest
      }: SidebarItemProps) => {
        return (
          <Fragment key={label}>
            {(children || variant === 'primary') && (
              <div className={classNames('transition-all overflow-hidden', collapseClass)}>
                <Typography
                  className={children ? 'mb-1 ml-2' : 'ml2'}
                  color="secondary"
                  fontWeight="semibold"
                  transform="uppercase"
                  variant="caption-xs"
                >
                  {label}
                </Typography>
              </div>
            )}

            {children ? (
              <SidebarItems
                collapsed={collapsed}
                hasBackground={background || hasBackground}
                onItemClick={onItemClick}
                options={children}
                variant="secondary"
              />
            ) : (
              <NavItem
                {...rest}
                children={undefined}
                className={classNames('last-of-type:mb-0', variant === 'primary' ? 'mb-4' : 'mb-1')}
                collapsed={collapsed}
                href={href}
                key={label}
                label={navLabel || label}
                onItemClickCb={onItemClick}
                variant={variant}
              />
            )}
          </Fragment>
        );
      },
      [collapseClass, collapsed, hasBackground, onItemClick, variant],
    );

    return (
      <div className="mx-1">
        <ul
          className={classNames(
            'flex flex-col rounded-2xl w-full p-0 list-none',
            { 'mb-5': variant === 'secondary' },
            {
              'bg-light-green-lighter dark:.dark .dark:bg-dark-bg-secondary':
                variant === 'secondary' && hasBackground,
            },
          )}
          key={variant}
        >
          {options.map(renderSidebarItem)}
        </ul>
      </div>
    );
  },
);
