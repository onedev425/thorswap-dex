import { useMemo } from 'react'

import classNames from 'classnames'

import { Icon, Typography, Link, Box, IconName } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'
import { MenuItemType } from 'components/Menu/types'

type Props = MenuItemType

export const MenuItem = ({
  onClick,
  icon,
  label,
  isSelected,
  labelClassName,
  value,
  href,
}: Props) => {
  const renderedItem = useMemo(() => {
    return (
      <button
        className={classNames(
          'outline-none border-none rounded-md relative flex flex-row w-full justify-between items-center cursor-pointer px-2 py-3 hover:brightness-95 dark:hover:brightness-125',
          genericBgClasses.secondary,
        )}
        onClick={onClick}
      >
        <Box alignCenter className="gap-6">
          {icon && <Icon name={icon as IconName} size={16} />}

          <Typography className={classNames('mx-2', labelClassName)}>
            {label}
          </Typography>
        </Box>
        <Box center>
          {!!value && <Typography>{value}</Typography>}
          {isSelected && <Icon name="checkmark" size={16} />}
        </Box>
      </button>
    )
  }, [icon, isSelected, label, labelClassName, onClick, value])

  return href ? <Link to={href}>{renderedItem}</Link> : renderedItem
}
