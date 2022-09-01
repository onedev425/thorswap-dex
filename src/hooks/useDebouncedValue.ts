import { useCallback, useEffect, useState } from 'react';

export const useDebouncedValue = <T>(value: T, delay = 200) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const handler = useCallback(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, value]);

  useEffect(handler, [handler]);

  return debouncedValue;
};
