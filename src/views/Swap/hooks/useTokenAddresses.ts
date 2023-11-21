import { useEffect, useState } from 'react';
import { useGetTokenListQuery } from 'store/static/api';

type TokenLists =
  | 'Thorchain-supported-erc20'
  | 'Thorchain-supported-arc20'
  | 'Thorchain-supported-bsc20'
  | 'Thorchainpoolswhitelistavax'
  | 'Thorchainpoolswhitelistbsc'
  | 'Thorchainpoolswhitelisteth';

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
