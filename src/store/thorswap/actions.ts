import { getRequest } from '@thorswap-lib/helpers';

import { BASE_URL } from './constants';
import { LoansResponse } from './types';

export const getLoans = ({ asset, address }: { asset: string; address: string }) => {
  const queryParams = new URLSearchParams({ asset, address });
  return getRequest<LoansResponse>(
    `${BASE_URL}/aggregator/lending/loans?${queryParams.toString()}`,
  );
};
