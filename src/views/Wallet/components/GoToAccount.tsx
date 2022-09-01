import { SupportedChain } from '@thorswap-lib/types';
import { HoverIcon } from 'components/HoverIcon';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';

type Props = {
  chain: SupportedChain;
  address: string;
};

export const GoToAccount = ({ chain, address }: Props) => {
  const accountUrl = useMemo(
    () => multichain().getExplorerAddressUrl(chain, address),
    [chain, address],
  );

  return (
    <HoverIcon
      href={accountUrl}
      iconName="external"
      size={16}
      tooltip={t('views.wallet.goToAccount')}
    />
  );
};
