import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const collapseClasses = 'ease-in-out transition-all';

type Props = {
  defaultExpanded?: boolean;
  isOpened?: boolean;
};

export const useCollapse = ({ defaultExpanded, isOpened }: Props = {}) => {
  const [isActive, setIsActive] = useState(defaultExpanded);
  const maxHeightRef = useRef(0);
  const [maxHeight, setMaxHeight] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    setIsActive((v) => !v);
  }, []);

  const expand = useCallback(() => {
    setIsActive(true);
  }, []);

  const collapse = useCallback(() => {
    setIsActive(false);
  }, []);

  const measure = useCallback((definedHeight?: number) => {
    const height = definedHeight || contentRef.current?.scrollHeight || 0;

    if (height !== maxHeightRef.current) {
      maxHeightRef.current = height;
      setMaxHeight(height);
    }
  }, []);

  useEffect(() => {
    if (typeof isOpened !== 'undefined') {
      setIsActive(isOpened);
    }
  }, [isOpened]);

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    const el = contentRef.current;
    const observer = new ResizeObserver(([entry]) => {
      measure(entry.target.scrollHeight);
    });

    observer.observe(el);

    return () => observer.unobserve(el);
  });

  useLayoutEffect(() => {
    measure();
  });

  const maxHeightActive = maxHeight ? `${maxHeight}px` : 'unset';
  const maxHeightStyle = {
    maxHeight: isActive ? maxHeightActive : '0px',
    overflow: 'hidden',
  };

  return {
    contentRef,
    isActive: !!isActive,
    toggle,
    expand,
    collapse,
    maxHeight,
    maxHeightStyle,
    collapseClasses,
  };
};
