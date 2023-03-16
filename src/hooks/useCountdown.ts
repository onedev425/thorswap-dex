import { useEffect, useMemo, useState } from 'react';

export type CountdownProps = {
  endTimestamp?: number | null;
  estimatedEndTimestamp?: number | null;
  startTimestamp?: number | null;
  estimatedDuration?: number | null;
};

const useCountdown = ({
  startTimestamp: prividedStartTimestamp,
  estimatedEndTimestamp: providedEstimatedEndTimestamp,
  endTimestamp: providedendTimestamp,
  estimatedDuration: providedEstimatedDuration,
}: CountdownProps) => {
  const startTimestamp = Number(prividedStartTimestamp);
  const estimatedDuration = Number(providedEstimatedDuration);
  const endTimestamp = Number(providedendTimestamp);

  const estimatedEndTimestamp = useMemo(() => {
    if (providedEstimatedEndTimestamp) {
      return Number(providedEstimatedEndTimestamp);
    }

    if (startTimestamp && estimatedDuration) {
      return Number(startTimestamp) + Number(estimatedDuration);
    }

    return null;
  }, [estimatedDuration, providedEstimatedEndTimestamp, startTimestamp]);

  const [timeLeft, setTimeLeft] = useState(() =>
    estimatedEndTimestamp ? estimatedEndTimestamp - Date.now() : null,
  );
  const counter = useCounter({ startTimestamp, endTimestamp });

  useEffect(() => {
    if (endTimestamp) {
      setTimeLeft(0);
    }
  }, [endTimestamp]);

  useEffect(() => {
    if (!estimatedEndTimestamp || endTimestamp) {
      return;
    }

    const intervalId = setInterval(() => {
      const newTimeLeft = estimatedEndTimestamp - Date.now();
      if (newTimeLeft < 0) {
        setTimeLeft(0);
        clearInterval(intervalId);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [estimatedEndTimestamp, endTimestamp]);

  const getFinishedPercent = () => {
    if (timeLeft === null || !startTimestamp || !estimatedEndTimestamp) {
      return 0;
    }

    // less than 1s left
    if (timeLeft <= 1000) {
      return 100;
    }

    const duration = estimatedEndTimestamp - startTimestamp;
    const finishedPercent = 100 - Math.floor((timeLeft / duration) * 100);

    return finishedPercent;
  };

  return {
    percent: getFinishedPercent(),
    timeSince: counter?.timeSince || null,
    timeLeft,
  };
};

export const useCounter = ({ startTimestamp, endTimestamp }: CountdownProps) => {
  const [timeSince, setTimeSince] = useState(() =>
    startTimestamp ? startTimestamp - Date.now() : null,
  );

  useEffect(() => {
    if (endTimestamp && startTimestamp) {
      setTimeSince(endTimestamp - startTimestamp);
    }
  }, [endTimestamp, startTimestamp]);

  useEffect(() => {
    if (!startTimestamp || endTimestamp) {
      return;
    }

    const intervalId = setInterval(() => {
      const newTimeSince = Date.now() - startTimestamp;
      if (newTimeSince < 0) {
        clearInterval(intervalId);
      } else {
        setTimeSince(newTimeSince);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTimestamp, startTimestamp]);

  return { timeSince };
};

export { useCountdown };
