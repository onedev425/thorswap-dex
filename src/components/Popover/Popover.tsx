import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { usePopper } from 'react-popper'

import { Popover as HeadlessPopover } from '@headlessui/react'

interface PopoverProps {
  children: React.ReactNode
  trigger: React.ReactNode
  disabled?: boolean
  onClose?: () => void
}

export const Popover = forwardRef<{ close: () => void }, PopoverProps>(
  ({ trigger, children, disabled, onClose }, popoverRef) => {
    const [referenceElement, setReferenceElement] =
      useState<HTMLElement | null>()
    const [popperElement, setPopperElement] = useState<HTMLElement | null>()
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
      placement: 'bottom-end',
    })
    const prevOpenStateRef = useRef(false)
    const closePopoverRef = useRef<() => void | null>()

    const closePopover = () => {
      closePopoverRef?.current?.()
    }

    useImperativeHandle(popoverRef, () => ({ close: closePopover }))

    return (
      <HeadlessPopover>
        {({ open, close }) => {
          if (!open && prevOpenStateRef.current) {
            onClose?.()
          }

          closePopoverRef.current = close
          prevOpenStateRef.current = open

          return (
            <>
              {disabled ? (
                trigger
              ) : (
                <HeadlessPopover.Button as="div" ref={setReferenceElement}>
                  {trigger}
                </HeadlessPopover.Button>
              )}

              {open && (
                <HeadlessPopover.Panel
                  className="z-20"
                  ref={setPopperElement}
                  style={styles.popper}
                  {...attributes.popper}
                >
                  {children}
                </HeadlessPopover.Panel>
              )}
            </>
          )
        }}
      </HeadlessPopover>
    )
  },
)
