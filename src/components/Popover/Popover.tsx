import React, { useRef, useState } from 'react'

import { usePopper } from 'react-popper'

import { Popover as HeadlessPopover } from '@headlessui/react'

interface PopoverProps {
  children: React.ReactNode
  trigger: React.ReactNode
  onClose?: () => void
}

export const Popover = ({ trigger, children, onClose }: PopoverProps) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>()
  const [popperElement, setPopperElement] = useState<HTMLElement | null>()
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
  })
  const prevOpenStateRef = useRef(false)

  return (
    <HeadlessPopover>
      {({ open }) => {
        if (!open && prevOpenStateRef.current) {
          onClose?.()
        }

        prevOpenStateRef.current = open

        return (
          <>
            <HeadlessPopover.Button as="div" ref={setReferenceElement}>
              {trigger}
            </HeadlessPopover.Button>
            {open && (
              <HeadlessPopover.Panel
                className="z-10"
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
}
