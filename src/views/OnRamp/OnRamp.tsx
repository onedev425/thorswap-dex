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
      Object.entries(wallet)
        .map(
          ([chain, wallet]) =>
            wallet?.address && {
              [chain]: { address: wallet.address },
            },
        )
        .filter(Boolean),
    [wallet],
  );

  return (
    <Box center>
      <Box
        className="dark:brightness-125"
        style={{ width: '550px', height: '760px', color: '#1C3346', boxShadow: '0px 5px 20px 1px' }}
      >
        <OnramperWidget
          supportBuy
          supportSell
          API_KEY={import.meta.env.VITE_ONRAMPER_KEY}
          color="#3CA9C5"
          darkMode={!isLight}
          defaultAddrs={wallets}
          defaultCrypto={wallet?.ETH ? 'ETH' : 'BTC'}
          defaultFiatSoft="USD"
          displayChatBubble={false}
          fontFamily="Poppins, sans-serif"
          isAddressEditable={false}
          supportSwap={false}
        />
      </Box>
    </Box>
  );
};

export default OnRamp;
