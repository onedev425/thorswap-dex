import { Chain } from '@thorswap-lib/types';
import { useEffect, useState } from 'react';

const checkIfExchangeBNBAddress = async (address: string) => {
  const { connectedWallets, validateAddress } = await (
    await import('services/multichain')
  ).getSwapKitClient();

  if (!connectedWallets.BNB || !validateAddress({ address, chain: Chain.Binance })) {
    return false;
  }

  const { BinanceToolbox } = await import('@thorswap-lib/toolbox-cosmos');
  const binanceToolbox = BinanceToolbox({});
  const { flags } = await binanceToolbox.getAccount(address);

  return typeof flags === 'number' && flags !== 0;
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

  return { isExchangeBNBAddress };
};
