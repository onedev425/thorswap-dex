import { BaseDecimal, WalletOption } from '@swapkit/core';
import { Button, Icon } from 'components/Atomic';
import { stakingV2Addr } from 'helpers/assets';
import { getCustomIconImageUrl } from 'helpers/logoURL';
import { memo, useCallback } from 'react';
import { t } from 'services/i18n';

type Props = {
  walletType?: WalletOption;
};

export const AddVThorMM = memo(({ walletType }: Props) => {
  const addVTHOR = useCallback(async () => {
    const provider = walletType === WalletOption.XDEFI ? window.xfi?.ethereum : window.ethereum;

    await provider?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: stakingV2Addr.VTHOR,
          symbol: 'vTHOR',
          decimals: BaseDecimal.ETH,
          image: getCustomIconImageUrl('vthor', 'png'),
        },
      },
    });
  }, [walletType]);

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
