import { useRef } from 'react'

import { Popover } from '@headlessui/react'
import classNames from 'classnames'

import { Button, Box, Icon, IconName } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'
import { MenuItem } from 'components/Menu/MenuItem'
import { MenuItemType } from 'components/Menu/types'

type Props = {
  items: MenuItemType[]
  stickToSide?: 'left' | 'right'
  openIcon?: IconName
  onBack?: () => void
  onClose?: () => void
}

export const Menu = ({
  items,
  openIcon = 'cog',
  stickToSide = 'right',
  onBack,
  onClose,
}: Props) => {
  const prevOpenStateRef = useRef(false)

  return (
    <Popover className="relative">
      <Popover.Button as="div">
        {({ open }) => {
          if (!open && prevOpenStateRef.current) {
            onClose?.()
          }

          prevOpenStateRef.current = open

          return (
            <Button
              className={classNames('px-2.5', {
                '!border-light-typo-gray dark:!border-dark-typo-gray': open,
              })}
              startIcon={<Icon name={openIcon} />}
              variant="tint"
            />
          )
        }}
      </Popover.Button>

      <Popover.Panel
        className={classNames(
          'absolute z-20 top-[50px]',
          stickToSide === 'left' ? 'left-0' : 'right-0',
        )}
      >
        <div
          className={classNames(
            'min-w-[200px] max-h-[350px] border border-solid !border-light-border-primary dark:!border-dark-border-primary',
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
              <Icon name="chevronLeft" size={16} />
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
