import { WalletOption } from '@thorswap-lib/multichain-core';
import { Button, Icon } from 'components/Atomic';
import { stakingV2Addr, vThorInfo } from 'helpers/assets';
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
          symbol: vThorInfo.ticker,
          decimals: vThorInfo.decimals,
          image: vThorInfo.iconUrl,
        },
      },
    });
  };

  return (
    <Button
      endIcon={<Icon name="metamask" size={16} />}
      onClick={addVTHOR}
      transform="none"
      type="outline"
      variant="tint"
    >
      {t('views.stakingVThor.addVTHOR')}
    </Button>
  );
});
