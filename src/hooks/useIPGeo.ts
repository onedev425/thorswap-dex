import { useCallback, useEffect, useRef, useState } from 'react';

export const useIPGeo = (customApi?: string) => {
  const isCancelled = useRef(false);
  const [country, setCountry] = useState<null | string>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = customApi || 'https://api.country.is';

  const fetchCountry = useCallback(async () => {
    if (typeof country === 'string') return;

    /**
     * make it less obvious how we store country code (firstLetter # timestamp # restOfCountry)
     */
    const [firstLetter, timestamp, restCountry] = (
      (sessionStorage.getItem('affTimestamp') as string) || ''
    ).split('#');
    const savedCountry = `${firstLetter}${restCountry}`;

    if (savedCountry && new Date(parseInt(timestamp)) > new Date()) {
      return setCountry(savedCountry);
    }

    setIsLoading(true);

    try {
      const response = await (await fetch(api)).json();
      if (response?.country && !isCancelled.current) {
        const [firstLetter, ...rest] = response.country;

        sessionStorage.setItem(
          'affTimestamp',
          `${firstLetter}#${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).getTime()}#${rest.join(
            '',
          )}`,
        );

        setCountry(response.country);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [api, country]);

  useEffect(() => {
    isCancelled.current = false;
    fetchCountry();

    return () => {
      isCancelled.current = true;
    };
  }, [fetchCountry]);

  return { country, error, isLoading };
};
