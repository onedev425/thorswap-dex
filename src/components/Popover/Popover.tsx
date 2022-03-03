import React, { useState } from 'react'

import { usePopper } from 'react-popper'

import { Popover as HeadlessPopover } from '@headlessui/react'

interface PopoverProps {
  children: React.ReactNode
  trigger: React.ReactNode
}

export const Popover = ({ trigger, children }: PopoverProps) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>()
  const [popperElement, setPopperElement] = useState<HTMLElement | null>()
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
  })

  return (
    <HeadlessPopover>
      {({ open }) => (
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
      )}
    </HeadlessPopover>
  )
}
