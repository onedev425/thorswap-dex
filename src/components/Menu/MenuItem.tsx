import { useMemo } from 'react'

import classNames from 'classnames'

import { genericBgClasses } from 'components/constants'
import { Icon } from 'components/Icon'
import { Link } from 'components/Link'
import { MenuItemType } from 'components/Menu/types'
import { Typography } from 'components/Typography'

type Props = {
  item: MenuItemType
}

export const MenuItem = ({ item }: Props) => {
  const renderedItem = useMemo(
    () => (
      <button
        className={classNames(
          'outline-none border-none relative p-0 flex flex-row w-full justify-between cursor-pointer px-4 py-2 hover:brightness-95 dark:hover:brightness-125 gap-3',
          genericBgClasses.secondary,
        )}
        onClick={item.onClick}
      >
        <Typography variant="caption">{item.label}</Typography>
        {!!item.icon && <Icon name={item.icon} size={16} />}
      </button>
    ),
    [item],
  )

  return item.href ? <Link to={item.href}>{renderedItem}</Link> : renderedItem
}
