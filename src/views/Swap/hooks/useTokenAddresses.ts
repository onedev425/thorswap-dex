import { useEffect, useState } from 'react';
import { useGetWhiteListPoolsQuery, useGetWhiteListTokensQuery } from 'store/static/api';

type WhitelistType = 'pools' | 'tokens';

export const useTokenAddresses = (type: WhitelistType) => {
  const [addresses, setAddresses] = useState<string[]>([]);

  const { data: poolsData } = useGetWhiteListPoolsQuery();

  const { data: tokensData } = useGetWhiteListTokensQuery();

  useEffect(() => {
    const tokensList =
      (type === 'pools' ? poolsData : tokensData)?.flatMap((provider) => provider.tokens) || [];
    const addresses = tokensList
      .map(({ address }) => address?.toLowerCase())
      .filter(Boolean) as string[];
    setAddresses(addresses);
  }, [poolsData, tokensData, type]);

  return addresses;
};
