import { useMemo } from 'react'

import classNames from 'classnames'

import { Icon, Typography, Link, Box, IconName } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'
import { MenuItemType } from 'components/Menu/types'

type Props = {
  item: MenuItemType
}

export const MenuItem = ({ item }: Props) => {
  const renderedItem = useMemo(() => {
    return (
      <button
        className={classNames(
          'outline-none border-none rounded-md relative flex flex-row w-full justify-between items-center cursor-pointer px-4 py-3 hover:brightness-95 dark:hover:brightness-125 gap-3',
          genericBgClasses.secondary,
        )}
        onClick={item.onClick}
      >
        <Box alignCenter className="gap-6">
          {item.icon && <Icon name={item.icon as IconName} size={16} />}
          <Typography className="mr-2">{item.label}</Typography>
        </Box>
        <Box center>
          {!!item.value && <Typography>{item.value}</Typography>}
          {item.isSelected && <Icon name="checkmark" size={16} />}
        </Box>
      </button>
    )
  }, [item])

  return item.href ? <Link to={item.href}>{renderedItem}</Link> : renderedItem
}
