// import { Chain } from '@swapkit/core';
// import { Box } from 'components/Atomic';
// import { Helmet } from 'components/Helmet';
// import { useDebouncedValue } from 'hooks/useDebouncedValue';
// import { t } from 'i18next';
// import { useMemo } from 'react';
// import { useWallet } from 'store/wallet/hooks';

// const baseKadoUrl = 'https://app.kado.money';

// const chainToNetwork = {
//   [Chain.Ethereum]: 'ETHEREUM',
//   [Chain.Binance]: 'BINANCE',
//   [Chain.Avalanche]: 'AVALANCHE',
//   [Chain.Cosmos]: 'OSMOSIS',
// };

/**
 * Uncomment when we will have idea when and how we want to use it
 */

const OnRamp = () => {
  // const { wallet } = useWallet();

  // const preselectedChain = useMemo(
  //   () =>
  //     wallet?.ETH
  //       ? Chain.Ethereum
  //       : wallet?.GAIA
  //       ? Chain.Cosmos
  //       : wallet?.AVAX
  //       ? Chain.Avalanche
  //       : Chain.Ethereum,
  //   [wallet?.AVAX, wallet?.ETH, wallet?.GAIA],
  // );

  // const src = useMemo(() => {
  //   const address = wallet?.[preselectedChain]?.address;
  //   // @ts-expect-error false positive - array works as expected here
  //   const queryParams = new URLSearchParams({
  //     apiKey: import.meta.env.VITE_KADO_KEY,
  //     networkList: ['ETHEREUM', 'AVALANCHE', 'OSMOSIS'],
  //     network: chainToNetwork[preselectedChain],
  //     onToAddress: address,
  //   });

  //   return `${baseKadoUrl}?${queryParams.toString()}`;
  // }, [preselectedChain, wallet]);

  // const debouncedSrc = useDebouncedValue(src, 1000);

  return null;

  // return (
  //   <Box center>
  //     <Helmet content="Create Wallet" title={t('views.onRamp.title')} />

  //     <iframe src={debouncedSrc} style={{ width: '600px', height: '780px', border: '0px' }} />
  //   </Box>
  // );
};

export default OnRamp;
