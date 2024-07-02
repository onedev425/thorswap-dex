import type { DebounceSettings, DebouncedFunc } from "lodash";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";

export function useDebouncedCallback<T extends (...args: Todo[]) => Todo>(
  callback: T,
  delay = 0,
  options?: DebounceSettings,
): DebouncedFunc<T> {
  return useCallback(debounce(callback, delay, options), [callback, delay, options]);
}

export function useDebouncedValue<T>(value: T, delay = 0, options?: DebounceSettings): T {
  const previousValue = useRef(value);
  const [current, setCurrent] = useState(value);
  const debouncedCallback = useDebouncedCallback((value: T) => setCurrent(value), delay, options);

  useEffect(() => {
    // doesn't trigger the debounce timer initially
    if (value !== previousValue.current) {
      debouncedCallback(value);
      previousValue.current = value;
      // cancel the debounced callback on clean up
      return debouncedCallback.cancel;
    }
  }, [value]);

  return current;
}
