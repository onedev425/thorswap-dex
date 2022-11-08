import { Chain } from '@thorswap-lib/types';
import { Box } from 'components/Atomic';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useMemo } from 'react';
import { useWallet } from 'store/wallet/hooks';

const baseKadoUrl = 'https://app.kado.money';

const chainToNetwork = {
  [Chain.Ethereum]: 'ETHEREUM',
  [Chain.Binance]: 'BINANCE',
  [Chain.Avalanche]: 'AVALANCHE',
  [Chain.Solana]: 'SOLANA',
  [Chain.Cosmos]: 'OSMOSIS',
};

const OnRamp = () => {
  const { wallet } = useWallet();

  const preselectedChain = useMemo(
    () =>
      wallet?.ETH
        ? Chain.Ethereum
        : wallet?.GAIA
        ? Chain.Cosmos
        : wallet?.AVAX
        ? Chain.Avalanche
        : wallet?.SOL
        ? Chain.Solana
        : Chain.Ethereum,
    [wallet?.AVAX, wallet?.ETH, wallet?.GAIA, wallet?.SOL],
  );

  const src = useMemo(() => {
    const address = wallet?.[preselectedChain]?.address;
    // @ts-expect-error false positive - array works as expected here
    const queryParams = new URLSearchParams({
      apiKey: import.meta.env.VITE_KADO_KEY,
      networkList: ['ETHEREUM', 'SOLANA', 'AVALANCHE', 'OSMOSIS'],
      network: chainToNetwork[preselectedChain],
      onToAddress: address,
    });

    return `${baseKadoUrl}?${queryParams.toString()}`;
  }, [preselectedChain, wallet]);

  const debouncedSrc = useDebouncedValue(src, 1000);

  return (
    <Box center>
      <iframe src={debouncedSrc} style={{ width: '600px', height: '780px', border: '0px' }} />
    </Box>
  );
};

export default OnRamp;
