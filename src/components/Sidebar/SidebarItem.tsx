import { Fragment, memo } from 'react'

import classNames from 'classnames'

import { Typography } from 'components/Atomic'
import { NavItem } from 'components/Sidebar/NavItem'
import { SidebarItemProps, SidebarVariant } from 'components/Sidebar/types'

type Props = {
  options: SidebarItemProps[]
  variant: SidebarVariant
  collapsed: boolean
  hasBackground?: boolean
  onItemClick?: () => void
}

export const SidebarItem = memo(
  ({
    collapsed = false,
    variant,
    options,
    hasBackground = false,
    onItemClick,
  }: Props) => {
    const collapseClass = collapsed ? 'scale-0 max-h-0' : 'scale-1 max-h-[20px]'

    return (
      <div className="mx-1">
        <ul
          key={variant}
          className={classNames(
            'flex flex-col rounded-2xl w-full p-0 list-none',
            { 'mb-5': variant === 'secondary' },
            {
              'bg-light-green-lighter dark:.dark .dark:bg-dark-bg-secondary':
                variant === 'secondary' && hasBackground,
            },
          )}
        >
          {options.map(
            ({
              children,
              hasBackground: background,
              label,
              navLabel,
              href,
              ...rest
            }: SidebarItemProps) => {
              return (
                <Fragment key={label}>
                  {(children || variant === 'primary') && (
                    <div
                      className={classNames(
                        'transition-all overflow-hidden',
                        collapseClass,
                      )}
                    >
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
                    <SidebarItem
                      options={children}
                      collapsed={collapsed}
                      variant="secondary"
                      hasBackground={background || hasBackground}
                      onItemClick={onItemClick}
                    />
                  ) : (
                    <NavItem
                      {...rest}
                      href={href}
                      children={undefined}
                      key={label}
                      className={classNames(
                        'last-of-type:mb-0',
                        variant === 'primary' ? 'mb-4' : 'mb-1',
                      )}
                      variant={variant}
                      label={navLabel || label}
                      collapsed={collapsed}
                      onItemClickCb={onItemClick}
                    />
                  )}
                </Fragment>
              )
            },
          )}
        </ul>
      </div>
    )
  },
)
