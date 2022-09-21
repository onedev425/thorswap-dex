import { useEffect, useState } from 'react';
import { useGetTokenListQuery } from 'store/static/api';

export const useThorchainErc20SupportedAddresses = () => {
  const [thorchainErc20SupportedAddresses, setThorchainErc20Supported] = useState<string[]>([]);

  const { data } = useGetTokenListQuery('Thorchain-whitelisted-erc20');

  useEffect(() => {
    if (data?.tokens?.length) {
      const tokenAddresses = data.tokens.map(({ address }) => address.toLowerCase());
      setThorchainErc20Supported(tokenAddresses);
    }
  }, [data?.tokens]);

  return thorchainErc20SupportedAddresses;
};
