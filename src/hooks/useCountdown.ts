import { useEffect, useState } from 'react';

export type CountdownProps = {
  endTimestamp: number | null;
  startTimestamp?: number | null;
};

const useCountdown = ({ endTimestamp, startTimestamp }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(() => (endTimestamp ? endTimestamp - Date.now() : null));

  useEffect(() => {
    if (!endTimestamp) {
      return;
    }

    const intervalId = setInterval(() => {
      const newTimeLeft = endTimestamp - Date.now();
      if (newTimeLeft < 0) {
        clearInterval(intervalId);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTimestamp]);

  const getFinishedPercent = () => {
    if (timeLeft === null || !startTimestamp || !endTimestamp) {
      return 0;
    }

    // less than 1s left
    if (timeLeft <= 1000) {
      return 100;
    }

    const duration = endTimestamp - startTimestamp;
    const finishedPercent = 100 - Math.floor((timeLeft / duration) * 100);

    return finishedPercent;
  };

  return timeLeft !== null ? { ...getReturnValues(timeLeft), percent: getFinishedPercent() } : null;
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

export { useCountdown };
