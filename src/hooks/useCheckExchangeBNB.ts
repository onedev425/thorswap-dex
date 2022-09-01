import { Chain } from '@thorswap-lib/types';
import { useEffect, useState } from 'react';
import { multichain } from 'services/multichain';

const checkIfExchangeBNBAddress = async (address: string) => {
  // validate address
  if (!multichain().validateAddress({ address, chain: Chain.Binance })) {
    return false;
  }

  try {
    const response = await multichain().bnb.getClient().getBncClient().getAccount(address);
    // if flags === 0, it's not exchange address

    if (response && response?.result?.flags !== 0) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// used for checking if BNB address is an exchange address
export const useCheckExchangeBNB = (address: string | null) => {
  const [isExchangeBNBAddress, setIsExchangeBNBAddress] = useState(false);

  useEffect(() => {
    const checkFunc = async () => {
      if (address) {
        const isExchangeAddress = await checkIfExchangeBNBAddress(address);
        setIsExchangeBNBAddress(isExchangeAddress);
      }
    };

    checkFunc();
  }, [address]);

  return {
    isExchangeBNBAddress,
  };
};
