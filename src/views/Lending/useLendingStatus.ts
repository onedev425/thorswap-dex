import { useGetLendingStatusQuery } from 'store/thorswap/api';

export function useLendingStatus() {
  const { data } = useGetLendingStatusQuery();

  return {
    lendingStatus: data,
  };
}
