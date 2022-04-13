import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { usePopper } from 'react-popper'

import { Popover as HeadlessPopover } from '@headlessui/react'

interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  disabled?: boolean
  onClose?: () => void
  isOpenedExternally?: boolean
}

type ForwarderProps = { close: () => void; open: () => void }

export const Popover = forwardRef<ForwarderProps, PopoverProps>(
  (
    { trigger, children, disabled, onClose, isOpenedExternally },
    popoverRef,
  ) => {
    const [btnRef, setReferenceElement] = useState<HTMLElement | null>()
    const [popperElement, setPopperElement] = useState<HTMLElement | null>()
    const { styles, attributes } = usePopper(btnRef, popperElement, {
      placement: 'bottom-end',
    })
    const prevOpenStateRef = useRef(false)
    const closePopoverRef = useRef<() => void | null>()

    const closePopover = () => {
      closePopoverRef?.current?.()
    }

    const openPopover = useCallback(() => {
      if (!prevOpenStateRef.current) {
        btnRef?.click()
      }
    }, [btnRef])

    useImperativeHandle(popoverRef, () => ({
      close: closePopover,
      open: openPopover,
    }))

    useEffect(() => {
      if (isOpenedExternally) {
        openPopover()
      }
    }, [isOpenedExternally, openPopover])

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
