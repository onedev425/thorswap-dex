import { useMemo } from 'react'

import classNames from 'classnames'

import { Icon, Typography, Link, Box } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'
import { MenuItemType } from 'components/Menu/types'

type Props = {
  item: MenuItemType
}

export const MenuItem = ({ item }: Props) => {
  const iconName = useMemo(() => {
    if (item.hasSubmenu) return 'chevronRight'
    if (item.isSelected) return 'checkmark'
    return item.icon
  }, [item.hasSubmenu, item.icon, item.isSelected])

  const showIcon = (item.icon || item.hasSubmenu || item.isSelected) && iconName

  const renderedItem = useMemo(() => {
    return (
      <button
        className={classNames(
          'outline-none border-none relative p-0 flex flex-row w-full justify-between items-center cursor-pointer px-4 py-2 hover:brightness-95 dark:hover:brightness-125 gap-3',
          genericBgClasses.secondary,
        )}
        onClick={item.onClick}
      >
        <Typography className="mr-2" variant="caption">
          {item.label}
        </Typography>
        <Box center>
          {!!item.value && <Typography>{item.value}</Typography>}
          {showIcon && <Icon name={iconName} size={16} />}
        </Box>
      </button>
    )
  }, [iconName, item, showIcon])

  return item.href ? <Link to={item.href}>{renderedItem}</Link> : renderedItem
}
