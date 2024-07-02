import { useCallback, useEffect, useState } from "react";

type Props = {
  onActiveChange?: (index: number | null) => void;
  initIndex?: number;
};

export const useAccordion = ({ onActiveChange, initIndex }: Props = {}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(() =>
    typeof initIndex === "number" ? initIndex : null,
  );

  const open = useCallback((index: number) => {
    setOpenIndex(index);
  }, []);

  const isOpened = useCallback(
    (index: number) => {
      return index === openIndex;
    },
    [openIndex],
  );

  const close = useCallback(
    (index?: number) => {
      if (typeof index === "undefined" || isOpened(index)) {
        setOpenIndex(null);
      }
    },
    [isOpened],
  );

  const toggle = useCallback(
    (index: number) => {
      if (isOpened(index)) {
        close(index);
      } else {
        open(index);
      }
    },
    [close, isOpened, open],
  );

  useEffect(() => {
    onActiveChange?.(openIndex);
  }, [onActiveChange, openIndex]);

  return {
    openIndex,
    open,
    close,
    isOpened,
    toggle,
  };
};
