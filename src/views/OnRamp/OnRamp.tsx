import OnramperWidget from '@onramper/widget';
import { Box } from 'components/Atomic';
import { useTheme } from 'components/Theme/ThemeContext';
import { useMemo } from 'react';
import { useWallet } from 'store/wallet/hooks';

const OnRamp = () => {
  const { wallet } = useWallet();
  const { isLight } = useTheme();

  const wallets = useMemo(
    () =>
      wallet &&
      Object.entries(wallet).map(([chain, wallet]) => ({
        [chain]: { address: wallet?.address },
      })),
    [wallet],
  );

  return (
    <Box center>
      <Box style={{ width: '550px', height: '760px' }}>
        <OnramperWidget
          supportSell
          API_KEY={import.meta.env.VITE_ONRAMPER_KEY}
          color="#4DBAD6"
          darkMode={!isLight}
          defaultAddrs={wallets}
          defaultCrypto={wallet?.ETH ? 'ETH' : 'BTC'}
          defaultFiatSoft="USD"
          fontFamily="Poppins"
          isAddressEditable={false}
          supportSwap={false}
        />
      </Box>
    </Box>
  );
};

export default OnRamp;
