import { useEffect, useMemo, useState } from 'react';

export const useDebouncedValue = <T>(value: T, delay = 200) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const memoizedValue = useMemo(() => value, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(memoizedValue);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, memoizedValue]);

  return debouncedValue;
};
