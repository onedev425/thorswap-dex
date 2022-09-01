import { Button, Icon } from 'components/Atomic';
import { stakingV2Addr, vThorInfo } from 'helpers/assets';
import { memo } from 'react';
import { t } from 'services/i18n';
import { NETWORK } from 'settings/config';

export const AddVThorMM = memo(() => {
  const addVTHOR = async () => {
    const vThorAddress = stakingV2Addr.VTHOR[NETWORK];

    // @ts-expect-error window types
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: vThorAddress,
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
