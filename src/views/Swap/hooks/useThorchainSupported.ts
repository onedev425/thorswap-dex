import { useEffect, useState } from 'react';
import { useGetTokenListQuery } from 'store/static/api';

export const useThorchainErc20SupportedAddresses = () => {
  const [thorchainErc20SupportedAddresses, setThorchainErc20Supported] = useState<string[]>([]);

  const { data } = useGetTokenListQuery('Thorchain-supported-ERC20');

  useEffect(() => {
    if (data?.tokens?.length) {
      const tokenAddresses = data.tokens.map(({ address }) => address.toLowerCase());
      setThorchainErc20Supported(tokenAddresses);
    }
  }, [data?.tokens]);

  return thorchainErc20SupportedAddresses;
};

export const useThorchainAvaxSupportedAddresses = () => {
  const [thorchainAvaxSupportedAddresses, setThorchainAvaxSupported] = useState<string[]>([]);

  const { data } = useGetTokenListQuery('Thorchain-supported-ARC20');

  useEffect(() => {
    if (data?.tokens?.length) {
      const tokenAddresses = data.tokens.map(({ address }) => address.toLowerCase());
      setThorchainAvaxSupported(tokenAddresses);
    }
  }, [data?.tokens]);

  return thorchainAvaxSupportedAddresses;
};
