import { WalletOption } from '@thorswap-lib/multichain-core';
import { Box, Icon, IconName, Tooltip } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { t } from 'services/i18n';

type Props = {
  className?: string;
  walletType?: WalletOption;
  size?: number;
  onClick?: () => void;
  tooltipDisabled?: boolean;
};

// @ts-expect-error remove after solana update on core
const walletIcons: Record<WalletOption, IconName> = {
  [WalletOption.BRAVE]: 'brave',
  [WalletOption.METAMASK]: 'metamask',
  [WalletOption.TRUSTWALLET_EXTENSION]: 'trustWallet',
  [WalletOption.LEDGER]: 'ledger',
  [WalletOption.LEDGER_LIVE]: 'ledger',
  [WalletOption.KEYSTORE]: 'keystore',
  [WalletOption.TRUSTWALLET]: 'walletConnect',
  [WalletOption.XDEFI]: 'xdefi',
  [WalletOption.KEPLR]: 'keplr',
};

export const WalletIcon = ({ className, walletType, size, tooltipDisabled, onClick }: Props) => {
  const tooltipContent =
    walletType === WalletOption.KEYSTORE
      ? t('views.walletModal.viewPhrase')
      : walletType === WalletOption.TRUSTWALLET_EXTENSION
      ? t('views.wallet.walletTypeConnected', {
          walletType: 'Trustwallet Browser',
        })
      : t('views.wallet.walletTypeConnected', {
          walletType,
        });

  return (
    <Tooltip content={tooltipContent} disabled={tooltipDisabled}>
      <Box className={onClick ? baseHoverClass : className} onClick={onClick}>
        {walletType && <Icon name={walletIcons[walletType]} size={size} />}
      </Box>
    </Tooltip>
  );
};
