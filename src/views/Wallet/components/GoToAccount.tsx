import { Chain } from '@thorswap-lib/types';
import { HoverIcon } from 'components/HoverIcon';
import { useEffect, useState } from 'react';
import { t } from 'services/i18n';

type Props = {
  chain: Chain;
  address: string;
};

export const GoToAccount = ({ chain, address }: Props) => {
  const [accountUrl, setAccountUrl] = useState('');

  useEffect(() => {
    import('services/swapKit')
      .then(({ getSwapKitClient }) => getSwapKitClient())
      .then(({ getExplorerAddressUrl }) =>
        setAccountUrl(getExplorerAddressUrl(chain, address) || ''),
      );
  }, [address, chain]);

  return (
    <HoverIcon
      iconName="external"
      size={16}
      to={accountUrl}
      tooltip={t('views.wallet.goToAccount')}
    />
  );
};
