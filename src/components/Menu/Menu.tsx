// import { Fragment } from 'react'

import { Popover } from '@headlessui/react'
import classNames from 'classnames'

import { Button, Box, Icon, IconName } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'
import { MenuItem } from 'components/Menu/MenuItem'
import { MenuItemType } from 'components/Menu/types'

type Props = {
  items: MenuItemType[]
  stickToSide?: 'left' | 'right'
  onBack?: () => void
  openIcon?: IconName
}

export const Menu = ({
  items,
  openIcon = 'threeDotsHorizontal',
  stickToSide = 'right',
  onBack,
}: Props) => {
  return (
    <Popover className="relative">
      <Popover.Button as="div">
        {({ open }) => (
          <Button
            className={classNames('px-2.5', {
              '!border-light-typo-gray dark:!border-dark-typo-gray': open,
            })}
            startIcon={<Icon name={openIcon} />}
            variant="tint"
          />
        )}
      </Popover.Button>

      <Popover.Panel
        className={classNames(
          'absolute z-10 top-[105%]',
          stickToSide === 'left' ? 'left-0' : 'right-0',
        )}
      >
        <div
          className={classNames(
            'min-w-[200px] max-h-[350px]',
            'overflow-y-auto flex flex-col py-2 drop-shadow-lg rounded-2xl',
            genericBgClasses.secondary,
          )}
        >
          {!!onBack && (
            <Box
              className={classNames(
                'w-full  px-4 py-2 hover:brightness-95 dark:hover:brightness-125 cursor-pointer',
                genericBgClasses.secondary,
              )}
              alignCenter
              onClick={onBack}
            >
              <Icon className="rotate-90" name="chevronDown" size={16} />
            </Box>
          )}
          {items.map((item) => (
            <MenuItem key={item.label} item={item} />
          ))}
        </div>

        <img src="/solutions.jpg" alt="" />
      </Popover.Panel>
    </Popover>
  )
}
