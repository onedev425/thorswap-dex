import { useEffect, useState } from "react";

export function useTimeLeft(endTimestamp?: number) {
  // count against now and refresh every second

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!endTimestamp) {
      return;
    }

    if (endTimestamp < Date.now()) {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const timeLeft = endTimestamp - now;
      setTimeLeft(Math.max(timeLeft, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTimestamp]);

  return timeLeft;
}
