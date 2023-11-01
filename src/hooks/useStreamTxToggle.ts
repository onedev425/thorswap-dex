import { useCallback, useEffect, useMemo, useState } from 'react';

export const useStreamTxToggle = (streamTxMemo?: string) => {
  const [stream, setStream] = useState(false);
  const canStream = useMemo(() => !!streamTxMemo, [streamTxMemo]);

  const toggleStream = useCallback(
    (enabled: boolean) => setStream(enabled && !!canStream),
    [canStream],
  );

  useEffect(() => {
    toggleStream(canStream);
  }, [canStream, toggleStream]);

  return {
    toggleStream,
    stream,
    canStream,
  };
};
