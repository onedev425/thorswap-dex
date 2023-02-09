import { ETH_DECIMAL, WalletOption } from '@thorswap-lib/multichain-core';
import { Button, Icon } from 'components/Atomic';
import { stakingV2Addr } from 'helpers/assets';
import { getCustomIconImageUrl } from 'helpers/logoURL';
import { memo } from 'react';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';

export const AddVThorMM = memo(() => {
  const { wallet } = useWallet();
  const addVTHOR = async () => {
    const provider =
      // @ts-expect-error window types
      wallet?.ETH?.walletType === WalletOption.XDEFI ? window.xfi?.ethereum : window.ethereum;

    await provider?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: stakingV2Addr.VTHOR,
          symbol: 'vTHOR',
          decimals: ETH_DECIMAL,
          image: getCustomIconImageUrl('vthor', 'png'),
        },
      },
    });
  };

  return (
    <Button
      onClick={addVTHOR}
      rightIcon={<Icon name="metamask" size={16} />}
      textTransform="none"
      variant="outlineTint"
    >
      {t('views.stakingVThor.addVTHOR')}
    </Button>
  );
});
