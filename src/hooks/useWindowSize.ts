import { useCallback, useEffect, useMemo, useState } from 'react';

export enum BreakPoint {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

const BREAKPOINTS_WIDTHS = {
  [BreakPoint.sm]: 640,
  [BreakPoint.md]: 768,
  [BreakPoint.lg]: 1024,
  [BreakPoint.xl]: 1280,
};

const isClient = typeof window === 'object';

export const getSize = (type: 'innerWidth' | 'innerHeight' = 'innerWidth') => window[type] || 0;

const getCurrentBreakpoint = () => {
  const width = getSize('innerWidth');

  if (width >= BREAKPOINTS_WIDTHS[BreakPoint.lg]) return BreakPoint.lg;
  if (width >= BREAKPOINTS_WIDTHS[BreakPoint.md]) return BreakPoint.md;
  return BreakPoint.sm;
};

const useWindowSize = () => {
  const [breakpoint, setBreakpoint] = useState(getCurrentBreakpoint);

  const isSizeActive = useCallback(
    (minSize?: BreakPoint) => {
      if (!minSize || minSize === breakpoint || minSize === BreakPoint.sm) {
        return true;
      }

      if (minSize === BreakPoint.lg && [BreakPoint.xl, BreakPoint.lg].includes(breakpoint)) {
        return true;
      }

      if (
        minSize === BreakPoint.md &&
        [BreakPoint.xl, BreakPoint.lg, BreakPoint.md].includes(breakpoint)
      ) {
        return true;
      }

      return false;
    },
    [breakpoint],
  );

  const handleResize = useCallback(() => {
    const nextBreakpoint = getCurrentBreakpoint();

    if (breakpoint !== nextBreakpoint) {
      setBreakpoint(nextBreakpoint);
    }
  }, [breakpoint]);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return useMemo(
    () => ({
      breakpoint,
      isSizeActive,
      isMdActive: isSizeActive(BreakPoint.md),
      isLgActive: isSizeActive(BreakPoint.lg),
    }),
    [breakpoint, isSizeActive],
  );
};

export default useWindowSize;
