import classNames from "classnames";
import { Box } from "components/Atomic";
import useOnClickOutside from "hooks/useClickOutside";
import type { ReactNode } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { usePopper } from "react-popper";

interface PopoverProps {
  openOnHover?: boolean;
  trigger: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  onClose?: () => void;
}

export type ForwarderProps = { close: () => void; open: () => void };

export const Popover = forwardRef<ForwarderProps, PopoverProps>(
  ({ trigger, children, disabled, onClose, openOnHover }, popoverRef) => {
    const [isOpened, setIsOpened] = useState(false);
    const [btnRef, setReferenceElement] = useState<HTMLElement | null>();
    const [popperElement, setPopperElement] = useState<HTMLElement | null>();
    const containerRef = useRef<HTMLDivElement>(null);
    const { styles, attributes } = usePopper(btnRef, popperElement, {
      placement: "bottom-end",
    });

    const closePopover = () => {
      if (isOpened) onClose?.();
      setIsOpened(false);
    };

    const openPopover = useCallback(() => {
      setIsOpened(true);
    }, []);

    const togglePopover = useCallback(() => {
      setIsOpened((v) => !v);
    }, []);

    useOnClickOutside(containerRef, closePopover);

    useImperativeHandle(popoverRef, () => ({
      close: closePopover,
      open: openPopover,
    }));

    const openPopoverOnHover = () => {
      if (openOnHover) {
        setIsOpened(true);
      }
    };

    const closePopoverOnHoverOut = () => {
      if (openOnHover) {
        setTimeout(() => setIsOpened(false), 200);
      }
    };

    return (
      <div onMouseLeave={closePopoverOnHoverOut} ref={containerRef}>
        {disabled ? (
          trigger
        ) : (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div onClick={togglePopover} onMouseEnter={openPopoverOnHover} ref={setReferenceElement}>
            {trigger}
          </div>
        )}

        <Box
          className={classNames("-z-20 opacity-0", {
            "!opacity-100 !z-20": isOpened,
          })}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {children}
        </Box>
      </div>
    );
  },
);
