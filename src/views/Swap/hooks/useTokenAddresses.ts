import { useEffect, useState } from 'react';
import { useGetTokenListQuery } from 'store/static/api';

type TokenLists =
  | 'Thorchain-supported-ERC20'
  | 'Thorchain-supported-ARC20'
  | 'tc-whitelisted-avax-pools'
  | 'tc-whitelisted-bsc-pools';

export const useTokenAddresses = (tokenListPath: TokenLists) => {
  const [addresses, setAddresses] = useState<string[]>([]);

  const { data } = useGetTokenListQuery(tokenListPath);

  useEffect(() => {
    if (data?.tokens?.length) {
      setAddresses(data.tokens.map(({ address }) => address.toLowerCase()));
    }
  }, [data?.tokens]);

  return addresses;
};
