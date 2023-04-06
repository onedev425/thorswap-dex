import { QuoteRoute } from '@thorswap-lib/swapkit-core';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

type KyberSwapParams = {
  routes: QuoteRoute[];
};

export const useKyberSwap = ({ routes }: KyberSwapParams) => {
  const location = useLocation();

  const isKyberSwapPage = useMemo(() => {
    return location.pathname.split('/').includes('kyber');
  }, [location.pathname]);

  const kyberRoutes = useMemo(() => {
    return routes.filter(
      (r) => r.providers.filter((p) => p !== 'KYBER' && p !== 'THORCHAIN').length === 0,
    );
  }, [routes]);

  return {
    isKyberSwapPage,
    kyberRoutes,
  };
};
