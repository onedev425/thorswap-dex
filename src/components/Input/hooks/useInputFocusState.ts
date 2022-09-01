import { useCallback, useRef, useState } from 'react';

export const useInputFocusState = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const focus = useCallback(() => {
    inputRef.current?.focus?.();
  }, []);

  const blur = useCallback(() => {
    inputRef.current?.blur?.();
  }, []);

  const onFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return {
    ref: inputRef,
    isFocused,
    focus,
    blur,
    onFocus,
    onBlur,
  };
};
