import { useEffect, useState } from 'react';

export function useTimeLeft(endTimestamp?: number) {
  // count against now and refresh every second

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!endTimestamp) {
      console.log('🔥', 'qq');
      return;
    }

    if (endTimestamp < Date.now()) {
      console.log('🔥', 'qqq', endTimestamp);
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const timeLeft = endTimestamp - now;
      console.log('🔥ss', timeLeft);
      setTimeLeft(Math.max(timeLeft, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTimestamp]);

  return timeLeft;
}
