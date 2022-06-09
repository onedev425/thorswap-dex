import {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { usePopper } from 'react-popper'

import { Box } from 'components/Atomic'

import useOnClickOutside from 'hooks/useClickOutside'

interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  disabled?: boolean
  onClose?: () => void
}

type ForwarderProps = { close: () => void; open: () => void }

export const Popover = forwardRef<ForwarderProps, PopoverProps>(
  ({ trigger, children, disabled, onClose }, popoverRef) => {
    const [isOpened, setIsOpened] = useState(false)
    const [btnRef, setReferenceElement] = useState<HTMLElement | null>()
    const [popperElement, setPopperElement] = useState<HTMLElement | null>()
    const containerRef = useRef<HTMLDivElement>(null)
    const { styles, attributes } = usePopper(btnRef, popperElement, {
      placement: 'bottom-end',
    })

    const closePopover = () => {
      if (isOpened) onClose?.()
      setIsOpened(false)
    }

    const openPopover = useCallback(() => {
      setIsOpened(true)
    }, [])

    const togglePopover = useCallback(() => {
      setIsOpened((v) => !v)
    }, [])

    useOnClickOutside(containerRef, closePopover)

    useImperativeHandle(popoverRef, () => ({
      close: closePopover,
      open: openPopover,
    }))

    return (
      <div ref={containerRef}>
        {disabled ? (
          trigger
        ) : (
          <div ref={setReferenceElement} onClick={togglePopover}>
            {trigger}
          </div>
        )}

        {isOpened && (
          <Box
            className="z-20"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            {children}
          </Box>
        )}
      </div>
    )
  },
)
